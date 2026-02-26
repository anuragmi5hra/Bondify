import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

/* ==============================
   📁 MULTER STORAGE CONFIG
============================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ==============================
   📸 UPLOAD PROFILE PHOTO
============================== */

router.post(
  "/photo",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePic = req.file.filename;
      await user.save();

      res.json({
        message: "Profile photo uploaded successfully",
        profilePic: req.file.filename,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* ==============================
   ✏️ UPDATE PROFILE INFO
============================== */

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { username, bio, dob } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username ?? user.username;
    user.bio = bio ?? user.bio;
    user.dob = dob ?? user.dob;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   📥 GET MY PROFILE
============================== */

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("bonds.user", "username profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   👥 GET ALL USERS (EXCEPT ME)
============================== */

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    })
      .select("username profilePic")
      .lean();

    res.json(users);
  } catch (err) {
    console.log("ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   🤝 FOLLOW USER
============================== */

router.post("/follow/:id", authMiddleware, async (req, res) => {
  try {
    const { bondType } = req.body;
    const targetUserId = req.params.id;

    if (!["friend", "couple", "charity"].includes(bondType)) {
      return res.status(400).json({ message: "Invalid bond type" });
    }

    if (req.user.id === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyBonded = currentUser.bonds.find(
      (bond) => bond.user.toString() === targetUserId
    );

    if (alreadyBonded) {
      return res.status(400).json({ message: "Already followed" });
    }

    currentUser.bonds.push({
      user: targetUserId,
      bondType,
    });

    await currentUser.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   ❌ UNFOLLOW USER
============================== */

router.delete("/unfollow/:id", authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.bonds = currentUser.bonds.filter(
      (bond) => bond.user.toString() !== targetUserId
    );

    await currentUser.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;