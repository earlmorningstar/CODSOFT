const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createNotification,
  getUserNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require("../controllers/notificationController");
const router = express.Router();

router.post("/", protect, createNotification);
router.get("/", protect, getUserNotification);
router.patch("/:id/read", protect, markAsRead);
router.patch("/mark-all-read", protect, markAllAsRead);
router.get("/unread/count", protect, getUnreadCount);

module.exports = router;
