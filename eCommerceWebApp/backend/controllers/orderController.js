const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendSuccess, sendError } = require("../utils/response");

const checkout = async (req, res) => {
  if (!req.user || !req.user.id) {
    console.error("User not authenticated");
    return sendError(res, 401, "User not authenticated");
  }
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Empty cart:", items); //here
      return sendError(res, 400, "You cart is empty");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let calculatedTotal = 0;

      for (const item of items) {
        let product;

        if (/^\d+$/.test(item.id)) {
          product = await Product.findOne({
            shopifyProductId: item.id,
          }).session(session);
        } else if (mongoose.Types.ObjectId.isValid(item.id)) {
          product = await Product.findById(item.id).session(session);
        } else {
          await session.abortTransaction();
          return sendError(res, 400, `Invalid product ID: ${item.id}`);
        }

        if (!product) {
          console.error("Product not found:", item.id);
          await session.abortTransaction();
          return sendError(res, 400, `Product not found: ${item.id}`);
        }

        const variant = product.variants[0];
        if (!variant || !variant.price) {
          console.error(`No price found for product: ${product.title}`);
          await session.abortTransaction();
          return sendError(
            res,
            400,
            `No price set for product: ${product.title}`
          );
        }

        if (variant.inventory_quantity < item.quantity) {
          await session.abortTransaction();
          return sendError(
            res,
            400,
            `Insufficient stock for: ${product.title}`
          );
        }

        const itemTotal = variant.price * item.quantity;

        calculatedTotal += itemTotal;
      }

      let paymentIntent;

      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(calculatedTotal * 100),
          currency: process.env.STRIPE_CURRENCY || "usd",
          metadata: { userId: req.user.id },
        });
      } catch (stripeError) {
        console.error("Stripe PaymentIntent Error:", stripeError);
        await session.abortTransaction();
        return sendError(res, 500, "Payment failed", stripeError);
      }

      for (const item of items) {
        const product = /^\d+$/.test(item.id)
          ? await Product.findOne({ shopifyProductId: item.id }).session(
              session
            )
          : await Product.findById(item.id).session(session);

        const variantIndex = product.variants.findIndex(
          (v) => v.inventory_quantity >= item.quantity
        );

        if (variantIndex === -1) {
          await session.abortTransaction();
          return sendError(
            res,
            400,
            `Cannot find variant with sufficient stock for: ${product.title}`
          );
        }

        product.variants[variantIndex].inventory_quantity -= item.quantity;
        await product.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      sendSuccess(res, 200, "Checkout successful", {
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Checkout error:", error);
      return sendError(res, 500, "Checkout failed", error);
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Checkout error:", error);
    sendError(res, 500, "Failed to complete checkout");
  }
};

const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, totalAmount, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return sendError(res, 400, "Order must include an item");
    }

    let calculatedTotal = 0;
    const processedItems = [];

    for (const item of items) {
      try {
        let product = await Product.findOne({
          shopifyProductId: item.product,
        }).session(session);

        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return sendError(res, 400, `Product not found: ${item.product}`);
        }

        const variantIndex = product.variants.findIndex(
          (variant) => variant.inventory_quantity >= item.quantity
        );

        if (variantIndex === -1) {
          await session.abortTransaction();
          session.endSession();
          return sendError(
            res,
            400,
            `Insufficient stock for product: ${product.title}`
          );
        }

        const variant = product.variants[variantIndex];
        const itemTotal = variant.price * item.quantity;
        calculatedTotal += itemTotal;

        processedItems.push({
          product: product._id,
          quantity: item.quantity,
        });

        variant.inventory_quantity -= item.quantity;
        await product.save({ session });
      } catch (itemError) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error processing item ${item.product}:`, itemError);
        return sendError(
          res,
          400,
          `Failed to process product: ${item.product}`
        );
      }
    }

    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      await session.abortTransaction();
      session.endSession();
      return sendError(res, 400, "Order total mismatch");
    }

    const order = new Order({
      user: req.user.id,
      items: processedItems,
      totalAmount: calculatedTotal,
      paymentDetails,
      paymentStatus: paymentDetails.status || "Pending",
    });

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 201, "Order placed successfully", order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order placement error:", error);
    sendError(res, 500, "Failed to place order", error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //Build query base on filter
    const query = { user: req.user.id };

    //date filter if I change my mind to add it
    if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) };
    }

    //status filter
    if (req.query.status) {
      //multiple status
      const statuses = req.query.status.split(",");
      query.paymentStatus = { $in: statuses };
    }

    //execute query with pagination
    const orders = await Order.find(query)
      .populate({
        path: "items.product",
        select: "title images variants",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // total count for pagination
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    //process order to include required info
    const processedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber: order._id.toString().slice(-6).toUpperCase(),
      items: order.items.map((item) => ({
        product: {
          id: item.product._id,
          title: item.product.title,
          image: item.product.images[0]?.src || null,
          price: item.product.variants[0]?.price || 0,
        },
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentDetails: order.paymentDetails,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
    sendSuccess(res, 200, "Orders retrieved successfully", {
      orders: processedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    sendError(res, 500, "Failed to fetch orders", error.message);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    }).populate({
      path: "items.product",
      select: "title images variants",
    });

    if (!order) {
      return sendError(res, 404, "order not found");
    }

    const processedOrders = {
      id: order._id,
      orderNumber: order._id.toString().slice(-6).toUpperCase(),
      items: order.items.map((item) => ({
        product: {
          id: item.product._id,
          title: item.product.title,
          image: item.product.images[0]?.src || null,
          price: item.product.variants[0]?.price || 0,
        },
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentDetails: order.paymentDetails,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      statusHistory: order.statusHistory,
    };
    sendSuccess(res, 200, "Order retrieved successfully", processedOrders);
  } catch (error) {
    console.error("Error fetching order:", error);
    sendError(res, 500, "Failed to fetch order", error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { status } = req.body;

    //Validate Id
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return sendError(res, 400, "Invalid order ID");
    }

    //Validate status
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Canceled",
    ];
    if (!validStatuses.includes(status)) {
      return sendError(
        res,
        400,
        "Invalid status. Must be one of:" + validStatuses.join(", ")
      );
    }

    //Find order
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      await session.abortTransaction();
      return sendError(res, 404, "Order not found");
    }

    //To see if user has permission (admin or owner of the order)
    if (!req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      await session.abortTransaction();
      return sendError(res, 403, "Unauthorised to update this order");
    }

    //Check if order can be updated (Cannot update delivered orders)
    if (
      order.paymentStatus === "Delivered" ||
      order.paymentStatus === "Canceled"
    ) {
      await session.abortTransaction();
      return sendError(
        res,
        400,
        "Cannot update status of delivered or canceled orders"
      );
    }

    //Create status update log
    const statusUpdate = {
      from: order.paymentStatus,
      to: status,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    };

    //Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { paymentStattus: status },
        $push: { statusHistory: statusUpdate },
      },
      { new: true, session }
    ).populate({
      path: "items.product",
      select: "title images variants",
    });

    await session.commitTransaction();

    sendSuccess(res, 200, "Order status updated successfully", {
      order: {
        id: updatedOrder._id,
        status: updatedOrder.paymentStatus,
        updatedAt: updatedOrder.updatedAt,
        statusHistory: updatedOrder.statusHistory,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating order status:", error);
    sendError(res, 500, "failed to update order status", error.message);
  } finally {
    session.endSession();
  }
};

module.exports = {
  checkout,
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
