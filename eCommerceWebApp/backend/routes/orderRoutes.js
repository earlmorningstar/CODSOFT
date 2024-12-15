const express = require("express");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  checkout,
  placeOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

// router.post("/checkout", protect, checkout);

router.post(
  "/checkout",
  protect,
  (req, res, next) => {
    console.log("Checkout route hit");
    next();
  },
  checkout
);

router.post("/", protect, placeOrder);

//Admin routes
router.get("/admin", protect, isAdmin, getOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

router.get("/", protect, getOrders);

module.exports = router;
