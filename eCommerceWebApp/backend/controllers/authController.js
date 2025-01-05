const mongoose = require("mongoose");
const crypto = require("crypto");
const Token = require("../models/Token");
const { sendEmail } = require("../utils/emailService");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    age,
    country,
    deliveryAddress,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !age ||
    !country ||
    !deliveryAddress
  ) {
    return sendError(res, 400, "All fields are required");
  }

  if (password !== confirmPassword) {
    return sendError(res, 400, "Passwords do not match");
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, "This user is already registered.");
    }

    const user = await User.create({
      name,
      email,
      password,
      age,
      country,
      deliveryAddress,
    });

    await Notification.create({
      title: "Welcome to TrendVault!",
      message: `Welcome aboard ${name}! Your account setup is complete. We're excited to have you with us.`,
      type: "info",
      userId: user._id,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      country: user.country,
      deliveryAddress: user.deliveryAddress,
      token: generateToken(user._id),
    });
  } catch (error) {
    return sendError(res, 500, "Server error", { error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalisedEmail = email.trim();

    const user = await User.findOne({ email: normalisedEmail });

    if (!user) {
      return sendError(res, 400, "User not found");
    }
    const isMatch = await user.matchPassword(password, user.password);

    if (!isMatch) {
      return sendError(res, 400, "Invalid email or password");
    }

    const token = generateToken(user._id);

    sendSuccess(res, 200, "Login successful", {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    sendError(res, 500, "An error occured during login", {
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return sendError(res, 404, "User not found!");
    }
    const { password, ...userDetails } = user.toObject();
    res.json(userDetails);
  } catch (error) {
    sendError(res, 500, "Error fetching user profile details", {
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ meessage: "This user was not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;
    user.country = req.body.country || user.country;
    user.deliveryAddress = req.body.deliveryAddress || user.deliveryAddress;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    const { password, ...updatedUserDetails } = updatedUser.toObject();
    res.json(updatedUserDetails);
  } catch (error) {
    sendError(res, 500, "Error updating profile", { error: error.message });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (!password) {
      return sendError(res, 400, "Password is required to delete account");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, 401, {
        message: "Incorrect password. Account deletion failed",
        isAuthError: false,
      });
    }

    await User.findByIdAndDelete(userId);

    sendSuccess(res, 200, "Account successfully deleted");
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    sendError(res, 500, "Error deleting account", { error: error.message });
  }
};

const verifySession = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalisedEmail = email.trim();
    const user = await User.findOne({ email: normalisedEmail });

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const isMatch = await user.matchPassword(password, user.password);

    if (!isMatch) {
      return sendError(res, 400, "Invalid password");
    }

    const token = generateToken(user._id);

    sendSuccess(res, 200, "Session verified", {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error during session verification:", error);
    sendError(res, 500, "An error occured during session verification", {
      error: error.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, 400, "User with this email doesn't exist");
    }

    //delete any existing toke for this user
    await Token.deleteMany({ userId: user._id });

    const resetToken = crypto.randomBytes(3).toString("hex").toUpperCase();

    await Token.create({
      userId: user._id,
      token: resetToken,
    });

    //sending email
    const message = `Message from TrendVault - Your password reset code is: ${resetToken}\nThis code will expire in 1 hour. Do not share this code with anybody.`;
    const emailSent = await sendEmail(email, "Password Reset Request", message);

    if (!emailSent) {
      return sendError(res, 500, "Error sending email");
    }

    return sendSuccess(res, 200, "Password reset code sent to your email");
  } catch (error) {
    return sendError(res, 500, "Server error", { error: error.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const resetToken = await Token.findOne({
      userId: user._id,
      token: token,
    });

    if (!resetToken) {
      return sendError(res, 400, "Invalid or expired reset token");
    }

    return sendSuccess(res, 200, "Token verified successfully");
  } catch (error) {
    return sendError(res, 500, "Server error", { error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const resetToken = await Token.findOne({
      userId: user._id,
      token: token,
    });

    if (!resetToken) {
      return sendError(res, 400, "Invalid or expired reset token");
    }

    user.password = newPassword;
    await user.save();
    await Token.deleteOne({ _id: resetToken._id });

    await Notification.create({
      title: "Password Reset Successful",
      message: "Your password has been successfully reset.",
      type: "info",
      userId: user._id,
    });

    return sendSuccess(res, 200, "Passowrd reset successfully. Now login.");
  } catch (error) {
    return sendError(res, 500, "Server error", { error: error.message });
  }
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  deleteUserAccount,
  verifySession,
  forgetPassword,
  verifyResetToken,
  resetPassword,
};
