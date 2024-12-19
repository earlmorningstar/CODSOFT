const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      country: user.country,
      deliveryAddress: user.deliveryAddress,
      token: generateToken(user._id),
    });
  } catch (error) {
    sendError(res, 500, "Server error", { error: error.message });
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
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      country: user.country,
      deliveryAddress: user.deliveryAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user profile details",
      error: error.message,
    });
  }
};

module.exports = { generateToken, registerUser, loginUser, getProfile };
