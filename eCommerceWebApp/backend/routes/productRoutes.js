const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addToRecentlyViewed,
  getRecommendations,
  addProductReview,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getProducts).post(protect, createProduct);

router
  .route("/recommendations")
  .get(protect, getRecommendations)
  .post(protect, addToRecentlyViewed);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.route("/:id/reviews").post(protect, addProductReview);

module.exports = router;
