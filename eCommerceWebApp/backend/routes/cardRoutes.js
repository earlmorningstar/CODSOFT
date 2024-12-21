const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  saveCardDetails,
  getCardDetails,
  verifyPassword,
  deleteCard,
} = require("../controllers/cardControllers");

const router = express.Router();

router.post("/cards/save-card", protect, saveCardDetails);
router.get("/cards/card-details", protect, getCardDetails);
router.post("/cards/verify-password", protect, verifyPassword);
router.delete("/cards/:cardId", protect, deleteCard);
module.exports = router;
