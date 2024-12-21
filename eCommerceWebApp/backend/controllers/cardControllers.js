const mongoose = require("mongoose");
const Card = require("../models/Card.js");
const User = require("../models/User.js");
const { encrypt, decrypt } = require("../utils/encryption.js");
const bcrypt = require("bcryptjs");
const { sendSuccess, sendError } = require("../utils/response");

const saveCardDetails = async (req, res) => {
  try {
    const { last4, expMonth, expYear, brand } = req.body;

    //validate expiry date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (
      parseInt(expYear) < currentYear ||
      (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth)
    ) {
      return sendError(res, 400, "Card has expired");
    }

    const encryptedMonth = encrypt(expMonth);
    const encryptedYear = encrypt(expYear);

    const newCard = {
      last4,
      expMonth: {
        encryptedData: encryptedMonth.encryptedData,
        iv: encryptedMonth.iv,
      },
      expYear: {
        encryptedData: encryptedYear.encryptedData,
        iv: encryptedYear.iv,
      },
      brand,
    };

    let cardData = await Card.findOne({ userId: req.user._id });
    if (cardData) {
      cardData.cards.push(newCard);
    } else {
      cardData = new Card({
        userId: req.user._id,
        cards: [newCard],
      });
    }

    await cardData.save();

    sendSuccess(res, 200, {
      message: "Card details saved successfully",
    });
  } catch (error) {
    console.error("Save card error:", error);
    sendError(res, 500, "Failed to save card details");
  }
};

const getCardDetails = async (req, res) => {
  try {
    const cardData = await Card.findOne({ userId: req.user._id });

    if (!cardData || cardData.cards.length === 0) {
      return sendError(res, 404, "No saved card found");
    }

    const decryptedCards = cardData.cards.map((card) => ({
      _id: card._id,
      last4: card.last4,
      expMonth: decrypt(card.expMonth.encryptedData, card.expMonth.iv),
      expYear: decrypt(card.expYear.encryptedData, card.expYear.iv),
      brand: card.brand,
    }));

    sendSuccess(res, 200, "Cards retrieved successfully.", decryptedCards);
  } catch (error) {
    console.error("Get card error:", error);
    return sendError(res, 500, "Failed to retrieve card details");
  }
};

const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, 401, "Invalid password");
    }
    sendSuccess(res, 200, "Password verification successful");
  } catch (error) {
    console.error("Password verification erro:", error);
    sendError(res, 500, "Failed to verify password");
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.isValidObjectId(cardId)) {
      return sendError(res, 400, "Invalid card ID format");
    }

    const cardData = await Card.findOne({ userId: req.user._id });

    if (!cardData) {
      return sendError(res, 404, "No cards found for this user");
    }

    const cardIndex = cardData.cards.findIndex(
      (card) => card._id.toString() === cardId
    );

    if (cardIndex === -1) {
      return sendError(res, 404, "Card not found");
    }

    cardData.cards.splice(cardIndex, 1);
    await cardData.save();

    return sendSuccess(res, 200, "Card deleted successfully");
  } catch (error) {
    console.error("Delete card error:", error);
    return sendError(res, 500, "Failed to delete card");
  }
};

module.exports = {
  saveCardDetails,
  getCardDetails,
  verifyPassword,
  deleteCard,
};
