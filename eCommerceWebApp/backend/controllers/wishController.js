const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.wishlist.includes(productId)) {
      return sendError(res, 400, "Product already in wishlist");
    }

    user.wishlist.push(productId);
    await user.save();

    sendSuccess(res, 200, "Product added to wishlist", user.wishlist);
  } catch (error) {
    sendError(res, 500, "Failed to add to wishlist", error.message);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
    await user.save();

    sendSuccess(res, 200, "Product removed from wishlist", user.wishlist);
  } catch (error) {
    sendError(res, 500, "Failed to remove from wishlist", error.message);
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    sendSuccess(res, 200, "Wishlist retrieved successfully", user.wishlist);
  } catch (error) {
    sendError(res, 500, "Failed to retrieve wishlist", error.message);
  }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
