require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  path: "/socket.io/",
  cors: {
    origin: [
      "http://localhost:3000",
      "https://codsoft-trendvault.vercel.app",
      "https://codsoft-trendvault-5ewnftgxs-onyeabor-joels-projects.vercel.app",
      "https://codsoft-trendvault-git-main-onyeabor-joels-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  pingTimeout: 60000,
  allowEIO3: true,
});

const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderAdminRoutes = require("./routes/orderAdminRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const shopifyRoutes = require("./routes/shopifyRoutes");
const cardRoutes = require("./routes/cardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://codsoft-trendvault.vercel.app",
      "https://codsoft-trendvault-5ewnftgxs-onyeabor-joels-projects.vercel.app",
      "https://codsoft-trendvault-git-main-onyeabor-joels-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
connectDB();
app.use("/api/users", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/users/whishlist", wishlistRoutes);
app.use("/api/shopify", shopifyRoutes);
app.use("/api/users/", cardRoutes);
app.use("/api/notifications", notificationRoutes);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  socket.join(socket.userId);

  socket.on("mark_as_read", (notificationId) => {
    socket.broadcast.to(socket.userId).emit('notification_read', notificationId)
  })

  socket.on("mark_all_read", () => {
    socket.broadcast.to(socket.userId).emit("notifications_cleared");
  });

  socket.on("clear_notifications", () => {
    socket.broadcast.to(socket.userId).emit("notifications_cleared");
  });

  socket.on("disconnect", () => {
    console.log("User disconnect:", socket.userId);
  });
});

app.get("/", (req, res) => {
  res.send("E-Commerce Web Application Is Running...");
});

server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
