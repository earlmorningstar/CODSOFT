const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createNotification,
  getUserNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

router.delete("/clear-all", protect, deleteAllNotifications);
router.delete("/:id", protect, deleteNotification);

router.post("/", protect, createNotification);
router.get("/", protect, getUserNotification);
router.patch("/:id/read", protect, markAsRead);
router.patch("/mark-all-read", protect, markAllAsRead);
router.get("/unread/count", protect, getUnreadCount);

module.exports = router;
