import mongoose from "mongoose";

/* ==============================
   🤝 BOND SCHEMA
============================== */

const bondSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bondType: {
      type: String,
      enum: ["friend", "couple", "charity"],
      required: true
    }
  },
  { timestamps: true }
);

export const Bond = mongoose.model("Bond", bondSchema);

/* ==============================
   👤 USER SCHEMA
============================== */

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    username: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    dob: {
      type: Date
    },

    profilePic: {
      type: String,
      default: ""
    },

    /* ==============================
       🔥 BONDS
    ============================== */

    bonds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bond"
      }
    ],

    /* ==============================
       💰 POINTS SYSTEM
    ============================== */

    points: {
      type: Number,
      default: 10
    },

    totalReceivedPoints: {
      type: Number,
      default: 0
    },

    lastDailyReward: {
      type: Date
    },

    /* ==============================
       ❌ SOFT DELETE (IMPORTANT)
    ============================== */

    isDeleted: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;