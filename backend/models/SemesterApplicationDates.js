import mongoose from "mongoose";

const SemesterApplicationDatesSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    fallStartDate: { type: Date, required: true },
    fallEndDate: { type: Date, required: true },
    springStartDate: { type: Date, required: true },
    springEndDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const SemesterApplicationDates = mongoose.model(
  "SemesterApplicationDates",
  SemesterApplicationDatesSchema
);

export default SemesterApplicationDates;
