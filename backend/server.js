import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// 🌍 Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true
  })
);

app.use(express.json());

// 🔗 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("Bondify backend is running 🚀");
});

// 🔐 Auth Routes (REAL)
app.use("/api/auth", authRoutes);

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
