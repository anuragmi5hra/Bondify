import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import pointsRoutes from "./routes/points.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();

/* ==============================
   MIDDLEWARE
============================== */

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

/* ==============================
   DATABASE
============================== */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB error:", err);
});

/* ==============================
   ROUTES
============================== */

app.get("/", (req, res) => {
  res.send("Bondify backend running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/notifications", notificationRoutes);

/* ==============================
   SERVER
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});