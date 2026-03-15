import express from "express";
import User, { Bond } from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

/* ==============================
   MULTER STORAGE
============================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

/* ==============================
   UPLOAD PROFILE PHOTO
============================== */

router.post("/photo", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);

    user.profilePic = req.file.filename;
    await user.save();

    res.json({
      message: "Profile photo uploaded successfully",
      profilePic: req.file.filename
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* ==============================
   UPDATE PROFILE
============================== */

router.put("/me", authMiddleware, async (req, res) => {
  try {

    const { username, bio, dob } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.dob = dob || user.dob;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   GET MY PROFILE
============================== */

router.get("/me", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: "bonds",
        populate: {
          path: "user",
          select: "username profilePic"
        }
      });

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
   GET ALL USERS
============================== */

router.get("/all", authMiddleware, async (req, res) => {
  try {

    const users = await User.find({
      _id: { $ne: req.user.id },
      username: { $exists: true, $ne: "" }
    })
      .select("username profilePic email")
      .lean();

    const formattedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic || null
    }));

    res.json(formattedUsers);

  } catch (err) {
    console.log("ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   FOLLOW USER
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

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const bond = await Bond.create({
      user: targetUserId,
      bondType
    });

    currentUser.bonds.push(bond._id);
    await currentUser.save();

    res.json({ message: "Followed successfully" });

  } catch (err) {
    console.log("FOLLOW ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   UNFOLLOW USER
============================== */

router.delete("/unfollow/:id", authMiddleware, async (req, res) => {
  try {

    const targetUserId = req.params.id;

    const currentUser = await User.findById(req.user.id).populate("bonds");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const bond = currentUser.bonds.find(
      (b) => b.user.toString() === targetUserId
    );

    if (!bond) {
      return res.status(400).json({ message: "Bond not found" });
    }

    currentUser.bonds = currentUser.bonds.filter(
      (b) => b._id.toString() !== bond._id.toString()
    );

    await currentUser.save();

    await Bond.findByIdAndDelete(bond._id);

    res.json({ message: "Unfollowed successfully" });

  } catch (err) {
    console.log("UNFOLLOW ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   GET BONDS BY TYPE
============================== */

router.get("/bonds", authMiddleware, async (req, res) => {
  try {

    const { type } = req.query;

    const user = await User.findById(req.user.id)
      .populate({
        path: "bonds",
        populate: {
          path: "user",
          select: "username profilePic"
        }
      });

    const filtered = user.bonds.filter(
      (b) => b.bondType === type
    );

    res.json(filtered);

  } catch (err) {
    console.log("BOND FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;