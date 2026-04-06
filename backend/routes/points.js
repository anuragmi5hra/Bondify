import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import BondTransaction from "../models/BondTransaction.js";

const router = express.Router();

/* =========================
   Daily Points (10 per day)
========================= */

router.get("/daily", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 (Optional safety)
    if (user.isDeleted) {
      return res.status(400).json({ message: "Account is suspended" });
    }

    const today = new Date();
    const last = user.lastDailyReward;

    if (!last || today.toDateString() !== new Date(last).toDateString()) {

      user.points += 10;
      user.lastDailyReward = today;

      await user.save();

      return res.json({
        message: "Daily 10 points received 🎉",
        points: user.points
      });

    }

    res.json({
      message: "Already received today",
      points: user.points
    });

  } catch (err) {
    console.error("Daily points error:", err);
    res.status(500).json({ message: "Server error" });
  }

});


/* =========================
   Send Points
========================= */

router.post("/send", authMiddleware, async (req, res) => {

  try {

    const { receiverId, points } = req.body;

    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 IMPORTANT CHECKS (ADD THIS)
    if (sender.isDeleted) {
      return res.status(400).json({
        message: "Your account is suspended"
      });
    }

    if (receiver.isDeleted) {
      return res.status(400).json({
        message: "User is suspended"
      });
    }

    const amount = points || 1;

    if (sender.points < amount) {
      return res.status(400).json({ message: "Not enough points" });
    }

    sender.points -= amount;
    receiver.points += amount;

    await sender.save();
    await receiver.save();

    /* ⭐ SAVE TRANSACTION */

    await BondTransaction.create({
      sender: sender._id,
      receiver: receiver._id,
      points: amount
    });

    res.json({
      message: "Points sent successfully ❤️",
      senderPoints: sender.points
    });

  } catch (err) {
    console.error("Send points error:", err);
    res.status(500).json({ message: "Server error" });
  }

});

export default router;