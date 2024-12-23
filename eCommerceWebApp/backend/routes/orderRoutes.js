const express = require("express");
// const { validateObjectId } = require("../utils/validators");
const {
  protect,
  // isAdmin
} = require("../middleware/authMiddleware");
const {
  checkout,
  placeOrder,
  getOrders,
  updateOrderStatus,
  getOrderById,
} = require("../controllers/orderController");
const router = express.Router();

//Checkout Route
router.post("/checkout", protect, checkout);

//Place Order
router.post("/place-orders", protect, placeOrder);

//Get Orders for User
router.get("/get-orders", protect, getOrders);
router.get('/:orderId', protect, getOrderById);

router.patch("/:orderId/status", protect, updateOrderStatus);

//Admin routes -- Not yet in use.
// router.get("/admin", protect, isAdmin, getOrders);
// router.put(
//   "/:id/status",
//   protect,
//   isAdmin,
//   validateObjectId,
//   updateOrderStatus
// );

module.exports = router;
