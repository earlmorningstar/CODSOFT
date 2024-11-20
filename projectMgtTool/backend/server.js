const express = require("express");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

app.get("/", (req, res) => {
  res.send("Project Management Tool API is running");
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
