const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    shopifyProductId: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: true,
    },
    body_html: String,
    vendor: String,
    product_type: String,
    tags: [String],
    variants: [
      {
        shopifyVariantId: String,
        price: Number,
        Sku: String,
        inventory_quantity: Number,
      },
    ],
    images: [
      {
        shopifyImageId: String,
        src: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ shopifyProductId: 1 }, { unique: true });

module.exports = mongoose.model("Product", ProductSchema);
