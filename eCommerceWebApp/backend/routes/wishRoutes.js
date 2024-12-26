const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} = require("../controllers/wishController");

const router = express.Router();

router.post("/add", protect, addToWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);
router.get("/", protect, getWishlist);
router.delete("/clear", protect, clearWishlist);

module.exports = router;
