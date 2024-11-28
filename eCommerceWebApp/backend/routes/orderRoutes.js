const express = require("express");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  checkout,
  placeOrder,
  viewAllOrders,
  viewOrderHistory,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/checkout", protect, checkout);

router.post("/", protect, placeOrder);
router.get("/", protect, viewOrderHistory);

//Admin routes
router.get("/admin", protect, isAdmin, viewAllOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

module.exports = router;
