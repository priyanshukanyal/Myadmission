import mongoose from "mongoose";

const appliedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },
    applicationNumber: {
      type: String,
      required: true,
      unique: true, // Ensures application number is unique
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Applied = mongoose.model("Applied", appliedSchema);
export default Applied;
