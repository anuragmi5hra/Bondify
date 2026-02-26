import mongoose from "mongoose";

/* ==============================
   🤝 BOND SCHEMA (Separate Model)
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

// Optional: export Bond model if needed elsewhere
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

    // 🔥 Bond references
    bonds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bond"
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

/* ==============================
   📊 SAFE VIRTUAL FIELD
============================== */

/* ==============================
   📊 SAFE VIRTUAL FIELD
============================== */

// userSchema.virtual("totalBonds").get(function () {
//   if (!this.bonds || !Array.isArray(this.bonds)) {
//     return 0;
//   }
//   return this.bonds.length;
// });
// /* ==============================
//    ⚙️ JSON SETTINGS
// ============================== */

// userSchema.set("toJSON", { virtuals: true });
// userSchema.set("toObject", { virtuals: true });

/* ==============================
   📦 EXPORT USER MODEL
============================== */

const User = mongoose.model("User", userSchema);

export default User;