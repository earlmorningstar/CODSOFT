const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Products");
const Cart = require("../models/Cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendSuccess, sendError } = require("../utils/response");

const VALID_STATUSES = ["Pending", "Shipped", "Delivered", "Canceled"];

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
  try {
    const { items, totalAmount, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, "Order must include an item");
    }

    let calculatedTotal = 0;
    const processedItems = [];

    for (const item of items) {
      try {
        const productId = mongoose.Types.ObjectId(item.product);

        const product = await Product.findById(productId);

        if (!product) {
          return sendError(res, 400, `Product not found: ${item.product}`);
        }

        if (product.stock < item.quantity) {
          return sendError(
            res,
            400,
            `Insufficient sock for product: ${product.name}`
          );
        }

        const itemTotal = product.price * item.quantity;

        calculatedTotal += itemTotal;

        processedItems.push({
          product: productId,
          quantity: item.quantity,
        });

        product.stock -= item.quantity;
        await product.save();
      } catch (itemError) {
        console.error(`Error processing item ${item.product}:`, itemError);
        return sendError(res, 400, `Invalid product ID: ${item.product}`);
      }
    }

    if (Math.round(calculatedTotal * 100) !== Math.round(totalAmount * 100)) {
      return sendError(res, 400, "Order total mismatch");
    }

    const order = new Order({
      user: req.user.id,
      items: processedItems,
      totalAmount: calculatedTotal,
      paymentDetails,
      status: "Pending",
    });

    await order.save();

    // const cart = await Cart.findOne({ user: req.user.id }).populate(
    //   "items.product"
    // );
    // if (!cart || cart.items.length === 0) {
    //   return sendError(res, 400, "Order must include an item");
    // }

    // let calculatedTotal = 0;
    // for (const item of cart.items) {
    //   if (item.product.stock < item.quantity) {
    //     return sendError(
    //       res,
    //       400,
    //       `Insufficient stock for product: ${item.product.name}`
    //     );
    //   }
    //   calculatedTotal += item.product.price * item.quantity;
    // }

    // if (Math.round(calculatedTotal * 100) !== Math.round(totalAmount * 100)) {
    //   return sendError(res, 400, "Order total mismatch");
    // }

    // const order = new Order({
    //   user: req.user.id,
    //   items: cart.items,
    //   totalAmount: calculatedTotal,
    //   paymentDetails,
    //   status: "Pending", //default
    // });
    // await order.save();
    // cart.items = [];
    // await cart.save();

    sendSuccess(res, 201, "Order placed successfully", order);
  } catch (error) {
    console.error("Order placement error:", error);
    sendError(res, 500, "Failed to place order", error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return sendError(res, 400, "Invalid order status");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    order.status = status;
    await order.save();

    sendSuccess(res, 200, `Order status updated to ${status}.`, order);
  } catch (error) {
    sendError(res, 500, "Failed to update order status", error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const query = req.user.isAdmin
      ? {} //admin sees all orders
      : { user: req.user.id }; //reg users sees their orders only

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .skip((page - 1) * limitNumber)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, "Order retrieved successfully", {
      orders,
      pagination: {
        totalOrders,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalOrders / limitNumber),
        hasNextPage: pageNumber * limitNumber < totalOrders,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Get orders error:", error.message);
    sendError(res, 500, "Failed to retrieve orders", error.message);
  }
};

module.exports = {
  checkout,
  placeOrder,
  updateOrderStatus,
  getOrders,
};
