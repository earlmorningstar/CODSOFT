const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const sendError = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({ success: true, message, error });
};

const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({ success: true, message, data });
};

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

module.exports = { checkout };
