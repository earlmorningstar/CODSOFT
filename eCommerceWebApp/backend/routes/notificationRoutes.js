const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createNotification,
  getUserNotification,
  markAsRead,
} = require("../controllers/notificationController");
const router = express.Router();

router.post("/", protect, createNotification);
router.get("/", protect, getUserNotification);
router.patch("/:id/read", protect, markAsRead);

module.exports = router;
