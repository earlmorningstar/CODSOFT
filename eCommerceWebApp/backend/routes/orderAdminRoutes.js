const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

router.get("/admin/orders", protect, isAdmin, async (req, res) => {
  try {
    const orders = Order.find();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
