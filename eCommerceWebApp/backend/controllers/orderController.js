const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendSuccess, sendError } = require("../utils/response");

const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      return sendError(res, 400, "Your cart is empty");
    }

    //validate stock, calc total amt
    let totalAmount = 0;

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return sendError(
          res,
          400,
          `Insufficient stock for product: ${item.product.name}`
        );
      }
      totalAmount += item.product.price * item.quantity;
    }

    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: process.env.STRIPE_CURRENCY || "usd",
      metadata: { userId: req.user.id },
    });

    //Reduce stock quantitiess for each product
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).session(session);
      product.stock -= item.quantity;
      await product.save({ session });
    }

    //create order
    const order = new Order({
      user: req.user.id,
      items: cart.items,
      totalAmount,
      paymentStatus: "Pending",
      paymentDetails: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
    });

    await order.save({ session });

    cart.items = [];
    await cart.save({ session });

    //commit transaction
    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 200, "Order created successfully", {
      order,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    await session.abortTransaction(); //abort in case of error
    session.endSession();
    sendError(res, 500, "Failed to complete checkout", error.message);
  }
};

const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, "Order must include an item");
    }

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      paymentDetails,
      status: "Pending", //default
    });
    await order.save();

    sendSuccess(res, 201, "Order placed successfully", order);
  } catch (error) {
    sendError(res, 500, "Failed to place order", error.message);
  }
};

const viewOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    sendSuccess(res, 200, "Order history retrieved successfully", orders);
  } catch (error) {
    sendError(res, 500, "Failed to retrieve order history", error.message);
  }
};

const viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    sendSuccess(res, 200, "All orders retrieved successfully", orders);
  } catch (error) {
    sendError(res, 500, "Failed to retrieve orders", error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "Shipped", "Delivered", "Canceled"];
    if (!validStatuses.includes(status)) {
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

module.exports = {
  checkout,
  placeOrder,
  viewOrderHistory,
  viewAllOrders,
  updateOrderStatus,
};
