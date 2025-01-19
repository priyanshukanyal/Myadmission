import mongoose from "mongoose";

const shortlistedUniversitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
  },
  { timestamps: true }
);

const ShortlistedUniversity = mongoose.model(
  "ShortlistedUniversity",
  shortlistedUniversitySchema
);
export default ShortlistedUniversity;
