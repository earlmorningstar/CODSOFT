const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishController");

const router = express.Router();

router
  .route("/wishlist")
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route("/wishlist/remove").post(protect, removeFromWishlist);

module.exports = router;
