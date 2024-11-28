const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.put("/promote/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({ message: "User promoted to admin" });
  } catch (error) {
    res.status(500).json({ message: error.meessage });
  }
});


module.exports = router;
