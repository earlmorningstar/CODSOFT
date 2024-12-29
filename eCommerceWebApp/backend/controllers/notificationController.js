const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");

const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notification = new Notification({
      userId: req.user._id,
      title,
      message,
      type,
    });
    await notification.save();
    req.app
      .get("io")
      .to(req.user._id.toString())
      .emit("notification", notification);
    sendSuccess(res, 200, "Notification created successfuly", notification);
  } catch (error) {
    sendError(res, 500, "Failed to create notification", {
      message: error.message,
    });
  }
};

const getUserNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    sendError(res, 500, "Failed to fetch notifications", {
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return sendError(res, 404, "Notification not found");
    }
    res.json(notification);
  } catch (error) {
    sendError(res, 500, "Failed to mark notification as read", {
      message: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    if (result.nModified === 0) {
      return sendError(res, 404, "No unread notification found");
    }

    sendSuccess(res, 200, "All notifications marked as read", {
      updated: result.nModified,
    });
  } catch (error) {
    sendError(res, 500, "Failed to mark all notifications as read", {
      message: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });
    return res.json({ count });
  } catch (error) {
    return sendError(res, 500, "Failed to fetch notification count");
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return sendError(res, 404, "Notification not found");
    }

    req.app
      .get("io")
      .to(req.user._id.toString())
      .emit("notification_deleted", req.params.id);

    sendSuccess(res, 200, "Notification deleted successfully");
  } catch (error) {
    sendError(res, 500, "Failed to dlete notification", {
      message: error.message,
    });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return sendError(res, 401, "User not authenticated");
    }

    const query = { userId: req.user._id };

    const result = await Notification.deleteMany(query);

    if (!result) {
      return sendError(res, 500, "Failed to delete notifications");
    }

    if (req.app.get("io")) {
      req.app
        .get("io")
        .to(req.user._id.toString())
        .emit("notifications_cleared");
    }

    return sendSuccess(res, 200, "All notifications deleted successfully", {
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return sendError(res, 500, "Failed to delete notifications");
  }
};

module.exports = {
  createNotification,
  getUserNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  deleteAllNotifications,
};
