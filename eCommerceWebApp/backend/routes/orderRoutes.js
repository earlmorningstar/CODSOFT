const express = require("express");
const { validateObjectId } = require("../utils/validators");
const { protect, 
  isAdmin 
} = require("../middleware/authMiddleware");
const {
  checkout,
  placeOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

//Checkout Route
router.post("/checkout", protect, checkout);

//Place Order
router.post("/", protect, placeOrder);

//Admin routes
router.get("/admin", protect, isAdmin, getOrders);
router.put(
  "/:id/status",
  protect,
  isAdmin,
  validateObjectId,
  updateOrderStatus
);

//Get Orders for User
router.get("/", protect, getOrders);

module.exports = router;
