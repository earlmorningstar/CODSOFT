const mongoose = require("mongoose");
const Wishlist = require("../models/Wish");
const Product = require("../models/Products");
const { sendSuccess, sendError } = require("../utils/response");

const addToWishlist = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId } = req.body;

    if (!productId) {
      return sendError(res, 400, "Product ID is required");
    }

    let product = await Product.findOne({
      shopifyProductId: productId.toString()
    }).session(session);

    if(!product && mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId).session(session);
    };

    if (!product) {
      await session.abortTransaction();
      return sendError(res, 404, "Product not found");
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id }).session(
      session
    );

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        items: [
          {
            product: product._id,
            variant: product.variants[0],
          },
        ],
      });
    } else {
      const existingItem = wishlist.items.find(
        (item) => item.product.toString() === product._id.toString()
      );

      if (existingItem) {
        await session.abortTransaction();
        await wishlist.populate("items.product");
        return sendSuccess(res, 200, "Product already in wishlist", wishlist);
      }

      wishlist.items.push({
        product: product._id,
        variant: product.variants[0],
      });
    }

    wishlist.lastModified = Date.now();
    await wishlist.save({ session });
    await session.commitTransaction();

    //populate prod details before sending res
    await wishlist.populate("items.product");

    sendSuccess(res, 200, "Product added to wishlist", wishlist);
  } catch (error) {
    await session.abortTransaction();
    console.error("Add to wishlist error:", error);
    sendError(res, 500, "Failed to add item to wishlist", error.message);
  } finally {
    session.endSession();
  }
};

const removeFromWishlist = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId } = req.params;

    // First find the wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('items.product')
      .session(session);

    if (!wishlist) {
      await session.abortTransaction();
      return sendError(res, 404, "Wishlist not found");
    }

    // Find the item to remove by either Mongo or shopify
    const itemIndex = wishlist.items.findIndex(item => 
      item.product._id.toString() === productId || 
      item.product.shopifyProductId === productId
    );

    if (itemIndex === -1) {
      await session.abortTransaction();
      return sendError(res, 404, "Product not found in wishlist");
    }

    // Remove
    wishlist.items.splice(itemIndex, 1);
    wishlist.lastModified = Date.now();
    await wishlist.save({ session });
    await session.commitTransaction();

    sendSuccess(res, 200, "Product removed from wishlist", wishlist);
  } catch (error) {
    await session.abortTransaction();
    console.error("Remove from wishlist error:", error);
    sendError(res, 500, "Failed to remove from wishlist", error.message);
  } finally {
    session.endSession();
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!wishlist) {
      return sendSuccess(res, 200, "Wishlist is empty", { items: [] });
    }
    sendSuccess(res, 200, "Wishlist retrieved successfully", wishlist);
  } catch (error) {
    console.error("get wishlist error:", error);
    sendError(res, 500, "Failed to retrieve wishlist", error.message);
  }
};

const clearWishlist = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).session(
      session
    );

    if (!wishlist) {
      await session.abortTransaction();
      return sendError(res, 404, "Wishlist not found");
    }

    wishlist.items = [];
    wishlist.lastModified = Date.now();
    await wishlist.save({ session });
    await session.commitTransaction();

    sendSuccess(res, 200, "Wishlist cleared successfully", wishlist);
  } catch (error) {
    await session.abortTransaction();
    console.error("Clear wishlist error:", error);
    sendError(res, 500, "Failed to clear wishlist", error.message);
  } finally {
    session.endSession();
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
};
