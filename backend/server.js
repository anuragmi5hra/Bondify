import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });


app.get("/", (req, res) => {
  res.send("Bondify backend is running 🚀");
});


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
