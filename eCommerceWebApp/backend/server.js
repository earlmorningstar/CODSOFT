require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce Web Application Is Running...");
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
