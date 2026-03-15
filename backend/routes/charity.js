import express from "express";
import BondTransaction from "../models/BondTransaction.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =============================
   USER DAILY TRANSACTIONS
============================= */

router.get("/daily", authMiddleware, async (req, res) => {

  try {

    const userId = req.user.id;

    const today = new Date();
    today.setHours(0,0,0,0);

    const transactions = await BondTransaction.find({
      createdAt: { $gte: today },
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate("sender","email")
    .populate("receiver","email")
    .sort({ createdAt: -1 });

    res.json(transactions);

  } catch (err) {
    console.error("Charity error:", err);
    res.status(500).json({ message: "Server error" });
  }

});

export default router;