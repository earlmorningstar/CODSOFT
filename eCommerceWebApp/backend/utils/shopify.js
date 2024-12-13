require("dotenv").config();
require("@shopify/shopify-api/adapters/node");
const { shopifyApi, ApiVersion } = require("@shopify/shopify-api");

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  scopes: ["read_products", "write_products"],
  hostName: process.env.SHOPIFY_STORE.replace("https://", ""),
  isEmbeddedApp: false,
  apiVersion: ApiVersion.October24,
  logger: {
    level: "error",
  },
});

const getShopifyRestClient = () => {
  return new shopify.clients.Rest({
    session: {
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
      shop: process.env.SHOPIFY_STORE,
    },
  });
};

module.exports = {
  getShopifyRestClient,
};
