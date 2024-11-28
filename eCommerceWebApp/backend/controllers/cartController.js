const Cart = require("../models/Cart");
const Product = require("../models/Products");
const { sendSuccess, sendError } = require("../utils/response");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart) {
      return sendSuccess(res, 200, "Cart is empty", { items: [] });
    }
    sendSuccess(res, 200, "Cart retrieved successfully", cart);
  } catch (error) {
    sendError(res, 500, "Failed to retrieve cart", error.message);
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return sendError(res, 400, "Invalid product");
  }

  if (!quantity || quantity < 1) {
    return sendError(res, 400, "Invalid quantity");
  }
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    const product = await Product.findById(productId);
    if (!product) {
      return sendError(res, 404, "Product not found");
    }
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }
    await cart.save();
    sendSuccess(res, 200, "Product added to cart", cart);
  } catch (error) {
    sendError(res, 500, "Failed to add product to cart", error.message);
  }
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return sendError(res, 400, "Quantity must be at least 1");
  }
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return sendError(res, 404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      sendSuccess(res, 200, "Cart item updated successfully", cart);
    } else {
      sendError(res, 404, "Product not found in cart");
    }
  } catch (error) {
    sendError(res, 500, "Failed to update cart item", error.message);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return sendError(res, 404, "Card not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await cart.save();
    sendSuccess(res, 200, "Product removed from cart", cart);
  } catch (error) {
    sendError(res, 500, "Failed to remove product from cart", error.message);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
