const express = require("express");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(core());
app.use(express.json());
connectDB();
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce Web Application Is Running...");
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
