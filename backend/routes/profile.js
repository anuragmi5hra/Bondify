import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

/* ==============================
   📁 MULTER STORAGE CONFIG
============================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ==============================
   📸 UPLOAD PROFILE PHOTO
   POST /api/profile/photo
============================== */

router.post(
  "/photo",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePic = req.file.filename;
      await user.save();

      res.json({
        message: "Profile photo uploaded",
        file: req.file.filename
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* ==============================
   💾 SAVE PROFILE INFO
   POST /api/profile/me
============================== */

router.post("/me", authMiddleware, async (req, res) => {
  try {
    const { username, bio, dob } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio, dob },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   📥 GET PROFILE
   GET /api/profile/me
============================== */

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;