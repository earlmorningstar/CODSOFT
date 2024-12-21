const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cards: [
      {
        last4: {
          type: String,
          required: true,
        },
        expMonth: {
          encryptedData: {
            type: String,
            required: true,
          },
          iv: {
            type: String,
            required: true,
          },
        },
        expYear: {
          encryptedData: {
            type: String,
            required: true,
          },
          iv: {
            type: String,
            required: true,
          },
        },
        brand: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
