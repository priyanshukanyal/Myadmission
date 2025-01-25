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
    fallOrientationWeekStart: { type: Date, required: false },
    fallOrientationWeekEnd: { type: Date, required: false },
    fallAcademicSemesterStart: { type: Date, required: false },
    fallAcademicSemesterEnd: { type: Date, required: false },
    springStartDate: { type: Date, required: true },
    springEndDate: { type: Date, required: true },
    springOrientationWeekStart: { type: Date, required: false },
    springOrientationWeekEnd: { type: Date, required: false },
    springAcademicSemesterStart: { type: Date, required: false },
    springAcademicSemesterEnd: { type: Date, required: false },
    aboutUniversity: { type: String, required: false },
    visa: { type: String, required: false },
    weather: { type: String, required: false },
    security: { type: String, required: false },
    placement: { type: String, required: false },
  },
  { timestamps: true }
);

const SemesterApplicationDates = mongoose.model(
  "SemesterApplicationDates",
  SemesterApplicationDatesSchema
);

export default SemesterApplicationDates;
