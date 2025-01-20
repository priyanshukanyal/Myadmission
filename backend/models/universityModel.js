import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema(
  {
    universityName: { type: String, required: true },
    website: { type: String },
    location: { type: String },
    country: { type: String },
    privatePublic: { type: String },
    totalEnrollment: { type: Number },
    undergraduates: { type: Number },
    male: { type: Number },
    female: { type: Number },
    satErwMin: { type: Number },
    satErwMax: { type: Number },
    satMathMin: { type: Number },
    satMathMax: { type: Number },
    actMin: { type: Number },
    actMax: { type: Number },
    financialAid: { type: Number },
    pellGrant: { type: Number },
    expenseMin: { type: Number },
    expenseMax: { type: Number },
    studentLoans: { type: Number },
    averageDebt: { type: Number },
    applicants: { type: Number },
    accepted: { type: Number },
    enrolled: { type: Number },
    gradIn6Years: { type: Number },
    returningFreshmen: { type: Number },
    academics: { type: Number },
    social: { type: Number },
    qualityOfLife: { type: Number },
    admissionsPhone: { type: String, trim: true, default: null },
    emailAddress: { type: String, trim: true, lowercase: true, default: null },
    isIvy: { type: Boolean, default: false },
    placement: { type: Number },
    ranking: { type: Number },
    fees: { type: Number },
    specialCourses: { type: [String], default: [] },
    programs: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  { timestamps: true }
);

const University = mongoose.model("University", UniversitySchema);

export default University;

// import mongoose from "mongoose";

// const UniversitySchema = new mongoose.Schema({
//   universityName: { type: String, required: true },
//   website: { type: String },
//   location: { type: String },
//   privatePublic: { type: String },
//   totalEnrollment: { type: Number },
//   undergraduates: { type: Number },
//   male: { type: Number },
//   female: { type: Number },
//   satErwMin: { type: String },
//   satErwMax: { type: String },
//   satMathMin: { type: String },
//   satMathMax: { type: String },
//   actMin: { type: String },
//   actMax: { type: String },
//   financialAid: { type: Number },
//   pellGrant: { type: Number },
//   expenseMin: { type: Number },
//   expenseMax: { type: Number },
//   studentLoans: { type: Number },
//   averageDebt: { type: Number },
//   applicants: { type: Number },
//   accepted: { type: Number },
//   enrolled: { type: Number },
//   gradIn6Years: { type: Number },
//   returningFreshmen: { type: Number },
//   academics: { type: Number },
//   social: { type: Number },
//   qualityOfLife: { type: Number },
//   phone: { type: String },
//   email: { type: String },
//   specialCourses: { type: [String], default: [] },
// });

// const University = mongoose.model("University", UniversitySchema);

// export default University;

// import mongoose from "mongoose";

// // Main University Schema
// const UniversitySchema = new mongoose.Schema({
//   universityName: { type: String, required: true }, // University Name
//   website: { type: String }, // University Website
//   location: { type: String }, // University Location
//   privatePublic: { type: String }, // Private or Public status
//   totalEnrollment: { type: Number }, // Total enrollment
//   undergraduates: { type: Number }, // Number of undergraduates
//   male: { type: Number }, // Male students
//   female: { type: Number }, // Female students
//   sat: {
//     erwMin: { type: Number },
//     erwMax: { type: Number },
//     mathMin: { type: Number },
//     mathMax: { type: Number },
//   }, // SAT Scores
//   act: {
//     min: { type: Number },
//     max: { type: Number },
//   }, // ACT Scores
//   financialAid: { type: Number }, // Financial Aid Availability
//   pellGrant: { type: Number }, // Pell Grant Availability
//   expense: {
//     min: { type: Number }, // Minimum expense
//     max: { type: Number }, // Maximum expense
//   },
//   studentLoans: { type: Number }, // Student Loans Availability
//   averageDebt: { type: Number }, // Average debt of students
//   applicants: { type: Number }, // Number of applicants
//   accepted: { type: Number }, // Number of accepted students
//   enrolled: { type: Number }, // Number of enrolled students
//   gradIn6Years: { type: Number }, // Graduation rate in 6 years
//   returningFreshmen: { type: Number }, // Returning freshmen percentage
//   academics: { type: Number }, // Academics rating
//   social: { type: Number }, // Social rating
//   qualityOfLife: { type: Number }, // Quality of life rating
//   phone: { type: String }, // Admissions phone number
//   email: { type: String }, // Admissions email address
//   specialCourses: { type: [String], default: [] }, // Array of special courses
// });

// // Create a Mongoose model for University
// const University = mongoose.model("University", UniversitySchema);

// export default University;
