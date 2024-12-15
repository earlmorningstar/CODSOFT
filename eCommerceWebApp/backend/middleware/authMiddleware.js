const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/response");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return sendError(res, 401, "Not authorized, no token provided");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return sendError(res, 401, "User not found");
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return sendError(res, 401, "Token expired. Please login again.");
      }

      console.error(error);
      return sendError(res, 401, "Not authorized, token failed!");
    }
  } else {
    return sendError(res, 401, "Not authorized, token failed!");
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return sendError(res, 403, "Access denied. Admins only.");
  }
};

module.exports = { protect, isAdmin };
