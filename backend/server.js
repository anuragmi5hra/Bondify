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

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman etc.)
    if (!origin) return callback(null, true);

    // allow all vercel domains
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    // allow localhost (optional)
    if (origin.includes("localhost")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
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