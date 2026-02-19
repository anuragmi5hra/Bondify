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

    // 🔥 Bond-based following system
    bonds: [bondSchema]
  },
  { timestamps: true }
);

/* ==============================
   🚀 INDEX FOR PERFORMANCE
============================== */

// Prevent duplicate bonding to same user
userSchema.index(
  { _id: 1, "bonds.user": 1 },
  { unique: false }
);

/* ==============================
   📊 VIRTUAL FIELD (OPTIONAL)
============================== */

// Count how many people current user bonded with
userSchema.virtual("totalBonds").get(function () {
  return this.bonds.length;
});

// Allow virtual fields in JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

/* ==============================
   📦 EXPORT MODEL
============================== */

const User = mongoose.model("User", userSchema);

export default User;