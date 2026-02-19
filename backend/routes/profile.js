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
============================== */

router.post(
  "/photo",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

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
============================== */

router.post("/me", authMiddleware, async (req, res) => {
  try {
    const { username, bio, dob } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio, dob },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

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
   📥 GET MY PROFILE
============================== */

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("bonds.user", "username profilePic");

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
      _id: { $ne: req.user.id }
    })
      .select("username profilePic")   // select only needed fields
      .lean();                        // 🔥 VERY IMPORTANT

    res.json(users);

  } catch (err) {
    console.log("ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   🤝 FOLLOW USER WITH BOND TYPE
============================== */

router.post("/follow/:id", authMiddleware, async (req, res) => {
  try {
    const { bondType } = req.body;
    const targetUserId = req.params.id;

    if (!["friend", "couple", "charity"].includes(bondType)) {
      return res.status(400).json({ message: "Invalid bond type" });
    }

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ prevent self-follow
    if (currentUser._id.toString() === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // ❌ prevent duplicate follow
    const alreadyBonded = currentUser.bonds.find(
      bond => bond.user.toString() === targetUserId
    );

    if (alreadyBonded) {
      return res.status(400).json({ message: "Already followed" });
    }

    // ✅ Add bond to current user
    currentUser.bonds.push({
      user: targetUserId,
      bondType
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

    // Remove bond
    currentUser.bonds = currentUser.bonds.filter(
      bond => bond.user.toString() !== targetUserId
    );

    await currentUser.save();

    res.json({ message: "Unfollowed successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;