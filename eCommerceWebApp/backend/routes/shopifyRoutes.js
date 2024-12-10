// const express = require("express");
// const router = express.Router();
// const Shopify = require("../shopifyConfig");

// router.get("./products", async (req, res) => {
//   try {
//     const client = new Shopify.Clients.Rest(
//       process.env.SHOPIFY_STORE,
//       process.env.SHOPIFY_ACCESS_TOKEN
//     );

//     const products = await client.get({
//       path: "products",
//     });

//     res.status(200).json(products.body.products);
//   } catch (error) {
//     console.error("Error fetching products from Shopify:", error.message);
//     res.status(500).json({ error: "Failed to fetch products from SHopify" });
//   }
// });

// module.exports = router;
