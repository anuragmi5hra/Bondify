import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ==============================
   SIGNUP (🔥 WITH RESTORE LOGIC)
============================== */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existingUser = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    /* 🔥 RESTORE DELETED ACCOUNT */
    if (existingUser) {

      // ✅ If deleted → restore
      if (existingUser.isDeleted) {

        existingUser.isDeleted = false;
        existingUser.password = hashedPassword;

        await existingUser.save();

        const token = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.json({
          message: "Welcome back! 🎉",
          token,
          user: {
            id: existingUser._id,
            email: existingUser.email,
          },
        });
      }

      // ❌ If already active
      return res.status(400).json({ message: "User already exists" });
    }

    /* ✅ NORMAL SIGNUP */

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   LOGIN
============================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 BLOCK LOGIN IF DELETED
    if (user.isDeleted) {
      return res.status(400).json({
        message: "Account deleted. Please signup again to restore."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   FORGOT PASSWORD
============================== */
router.post("/forgot-password", async (req, res) => {
  try {

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password updated successfully. You can login now."
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

export default router;