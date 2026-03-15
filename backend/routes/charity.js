import express from "express";
import BondTransaction from "../models/BondTransaction.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =============================
   USER LATEST 10 TRANSACTIONS
============================= */

router.get("/daily", authMiddleware, async (req, res) => {

  try {

    const userId = req.user.id;

    const transactions = await BondTransaction.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate("sender", "email")
    .populate("receiver", "email")
    .sort({ createdAt: -1 })
    .limit(10);

    res.json(transactions);

  } catch (err) {
    console.error("Charity error:", err);
    res.status(500).json({ message: "Server error" });
  }

});


/* =============================
   USER FULL TRANSACTION HISTORY
============================= */

router.get("/all", authMiddleware, async (req, res) => {

  try {

    const userId = req.user.id;

    const transactions = await BondTransaction.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate("sender", "email")
    .populate("receiver", "email")
    .sort({ createdAt: -1 });

    res.json(transactions);

  } catch (err) {
    console.error("Full charity error:", err);
    res.status(500).json({ message: "Server error" });
  }

});

export default router;