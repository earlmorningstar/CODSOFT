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

module.exports = { createNotification, getUserNotification, markAsRead };
