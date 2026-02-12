import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";


const router = express.Router();

// 📁 Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/*
-----------------------------------
📸 Upload Profile Picture
POST /api/profile/photo
-----------------------------------
*/
router.post(
  "/photo",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      user.profilePic = req.file.filename;

      await user.save();

      res.json({ message: "Profile photo uploaded", file: req.file.filename });

    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/*
-----------------------------------
📥 GET PROFILE
-----------------------------------
*/
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
