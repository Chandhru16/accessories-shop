require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Accessories Shop API is running."));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/settings", settingsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
