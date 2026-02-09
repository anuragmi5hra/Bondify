import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("Bondify backend is running 🚀");
});

// 🔐 Auth routes placeholder
app.post("/api/auth/login", (req, res) => {
  res.json({ token: "dummy-token" });
});

app.post("/api/auth/signup", (req, res) => {
  res.json({ token: "dummy-token" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
