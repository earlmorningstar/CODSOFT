const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} = require("../controllers/cartController");
const router = express.Router();

router.route("/").get(protect, getCart).post(protect, addToCart);

router
  .route("/:productId")
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
