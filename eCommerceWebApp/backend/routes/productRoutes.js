const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const Product = require("../models/Products");
const { sendSuccess, sendError } = require("../utils/response");

router.post("/sync", async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return sendError(res, 400, {
        message: "Invalid products data",
        error: "Products should be an array",
      });
    }
    const bulkOps = products.map((product) => ({
      updateOne: {
        filter: { shopifyProductId: product.id },
        update: {
          $set: {
            title: product.title,
            body_html: product.body_html,
            vendor: product.vendor,
            product_type: product.product_type,
            tags:
              typeof product.tags === "string"
                ? product.tags.split(",").map((tag) => tag.trim())
                : product.tags,
            variants: product.variants?.map((variant) => ({
              shopifyVariantId: variant.id,
              price: parseFloat(variant.price),
              sku: variant.sku,
              inventory_quantity: variant.inventory_quantity,
            })),
            images: product.images?.map((image) => ({
              shopifyImageId: image.id,
              src: image.src,
            })),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        upsert: true,
      },
    }));
    const result = await Product.bulkWrite(bulkOps, { ordered: false });
    sendSuccess(res, 200, "Product synced successfully", {
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Product sync error:", error);
    sendError(res, 500, "Error syncing products", { error: error.message });
  }
});

router.get("/shopify/:shopifyProductId", async (req, res) => {
  try {
    const { shopifyProductId } = req.params;

    const product = await Product.findOne({
      shopifyProductId: shopifyProductId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", shopifyProductId });
    }
    res
      .status(200)
      .json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    console.error("Product retrieval error:", error);
    sendError(res, 500, "Error retrieving product", error.message)
  }
});

module.exports = router;
