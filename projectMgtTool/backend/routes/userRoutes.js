const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
});

module.exports = router;
