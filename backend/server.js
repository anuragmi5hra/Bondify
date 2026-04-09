import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import pointsRoutes from "./routes/points.js";
import notificationRoutes from "./routes/notifications.js";
import charityRoutes from "./routes/charity.js";

dotenv.config();

const allowedOrigins = [
  "https://bondify-izpclvy9b-anuragmi5hras-projects.vercel.app",
  "https://bondify-aqd90zqme-anuragmi5hras-projects.vercel.app",
  "https://bondify-seven.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / mobile apps

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/charity", charityRoutes);

/* ==============================
   404 HANDLER (IMPORTANT)
============================== */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

/* ==============================
   GLOBAL ERROR HANDLER
============================== */

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error"
  });
});

/* ==============================
   SERVER
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});