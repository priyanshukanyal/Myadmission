import mongoose from "mongoose";

const appliedUniversitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true,
  },
  appliedAt: { type: Date, default: Date.now },
});

const AppliedUniversity = mongoose.model(
  "AppliedUniversity",
  appliedUniversitySchema
);
export default AppliedUniversity;
