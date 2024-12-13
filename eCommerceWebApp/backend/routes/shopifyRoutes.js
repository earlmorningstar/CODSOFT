const express = require("express");
const router = express.Router();
const { getShopifyRestClient } = require("../utils/shopify");
const { sendSuccess, sendError } = require("../utils/response");

router.get("/products", async (req, res) => {
  try {
    const restClient = getShopifyRestClient();
    const response = await restClient.get({
      path: "products",
      query: {
        limit: 70,
      },
    });
    sendSuccess(res, 200, "Products fetched successfully from Shopify", {
      products: response.body.products,
    });
  } catch (error) {
    console.error("Shopify API Error", error);
    sendError(
      res,
      500,
      "Failed to fetch products from Shopify",
      error.response?.data || error.message
    );
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restClient = getShopifyRestClient();
    const response = await restClient.get({
      path: `products/${id}`,
    });
    sendSuccess(res, 200, "Products fetched successfully from shopify", {
      product: response.body.product,
    });
  } catch (error) {
    console.error("Shopify API Error", error);
    if (error.response?.status === 404) {
      sendError(res, 404, "Product not found");
    } else {
      sendError(
        res,
        500,
        "Failed to fetch product details from shopify",
        error.response?.data || error.message
      );
    }
  }
});

module.exports = router;
