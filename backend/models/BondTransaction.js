import mongoose from "mongoose";

const bondTransactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  points: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["sent", "received"],
    default: "sent"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("BondTransaction", bondTransactionSchema);