require("dotenv").config();
require("@shopify/shopify-api/adapters/node");
const { shopifyApi, ApiVersion } = require("@shopify/shopify-api");

// Initialize Shopify API client
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  scopes: ["read_products", "write_products"],
  hostName: process.env.SHOPIFY_STORE.replace("https://", ""),
  isEmbeddedApp: false,
  apiVersion: ApiVersion.October24,
});

(async () => {
  try {
    // Create a REST client
    const restClient = new shopify.clients.Rest({
      session: {
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
        shop: process.env.SHOPIFY_STORE,
      },
    });

    // Fetch products
    const response = await restClient.get({
      path: "products",
      query: { limit: 40 },
    });

    console.log("Shopify API Response:", response.body.products);
  } catch (error) {
    console.error("Shopify API Error:", error.response?.data || error.message);
  }
})();
