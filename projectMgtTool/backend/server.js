const express = require("express");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Project Management Tool API is running");
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
