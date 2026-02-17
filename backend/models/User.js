import mongoose from "mongoose";

const bondSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    bondType: {
      type: String,
      enum: ["friend", "couple", "charity"]
    }
  },
  { timestamps: true }
);

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

    bonds: [bondSchema]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;