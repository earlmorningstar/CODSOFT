const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  deleteUserAccount,
  verifySession,
  forgetPassword,
  verifyResetToken,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/delete-account", protect, deleteUserAccount);
router.post("/verify-session", protect, verifySession);
router.post("/forgot-password", forgetPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
