import mongoose from "mongoose";

// Main University Schema
const UniversitySchema = new mongoose.Schema({
  universityName: { type: String, required: true }, // University Name
  website: { type: String }, // University Website
  location: { type: String }, // University Location
  privatePublic: { type: String }, // Private or Public status
  totalEnrollment: { type: Number }, // Total enrollment
  undergraduates: { type: Number }, // Number of undergraduates
  male: { type: Number }, // Male students
  female: { type: Number }, // Female students
  sat: {
    erwMin: { type: Number },
    erwMax: { type: Number },
    mathMin: { type: Number },
    mathMax: { type: Number },
  }, // SAT Scores
  act: {
    min: { type: Number },
    max: { type: Number },
  }, // ACT Scores
  financialAid: { type: Boolean, default: false }, // Financial Aid Availability
  pellGrant: { type: Boolean, default: false }, // Pell Grant Availability
  expense: {
    min: { type: Number }, // Minimum expense
    max: { type: Number }, // Maximum expense
  },
  studentLoans: { type: Boolean, default: false }, // Student Loans Availability
  averageDebt: { type: Number }, // Average debt of students
  applicants: { type: Number }, // Number of applicants
  accepted: { type: Number }, // Number of accepted students
  enrolled: { type: Number }, // Number of enrolled students
  gradIn6Years: { type: Number }, // Graduation rate in 6 years
  returningFreshmen: { type: Number }, // Returning freshmen percentage
  ratings: {
    academics: { type: Number }, // Academics rating
    social: { type: Number }, // Social rating
    qualityOfLife: { type: Number }, // Quality of life rating
  },
  admissions: {
    phone: { type: String }, // Admissions phone number
    email: { type: String }, // Admissions email address
  },
  specialCourses: { type: [String], default: [] }, // Array of special courses
  courses: { type: [String], default: [] }, // Array of courses
});

// Create a Mongoose model for University
const University = mongoose.model("University", UniversitySchema);

export default University;

// import mongoose from "mongoose";

// // Schema for the SAT and ACT scores
// const SATSchema = new mongoose.Schema({
//   ERW_min: Number,
//   ERW_max: Number,
//   Math_min: Number,
//   Math_max: Number,
// });

// const ACTSchema = new mongoose.Schema({
//   min: Number,
//   max: Number,
// });

// // Main University Schema
// const UniversitySchema = new mongoose.Schema({
//   University_Name: { type: String, required: true },
//   Website: { type: String, required: true },
//   Location: { type: String, required: true },
//   Private_Public: { type: String, required: true },
//   Total_Enrollment: Number,
//   Undergraduates: Number,
//   Male: Number,
//   Female: Number,
//   SAT: SATSchema,
//   ACT: ACTSchema,
//   Financial_Aid: { type: Boolean, default: false },
//   Pell_Grant: { type: Boolean, default: false },
//   Expense: {
//     min: Number,
//     max: Number,
//   },
//   Student_Loans: { type: Boolean, default: false },
//   Average_Debt: Number,
//   Applicants: Number,
//   Accepted: Number,
//   Enrolled: Number,
//   Grad_in_6_Years: Number,
//   Returning_Freshmen: Number,
//   Ratings: {
//     Academics: Number,
//     Social: Number,
//     Quality_of_Life: Number,
//   },
//   Admissions: {
//     Phone: String,
//     Email: String,
//   },
//   Courses: [String], // Array of courses with specialization
// });

// // Create a Mongoose model for University
// const University = mongoose.model("University", UniversitySchema);

// // import mongoose from "mongoose";

// // const { Schema, model } = mongoose;

// // const UniversitySchema = new Schema({
// //   universityName: { type: String },
// //   website: { type: String },
// //   location: { type: String },
// //   privateOrPublic: { type: String },
// //   totalEnrollment: { type: String },
// //   undergraduates: { type: String },
// //   genderRatio: {
// //     male: { type: String },
// //     female: { type: String },
// //   },
// //   testScores: {
// //     SAT_ERW: { min: { type: String }, max: { type: String } },
// //     SAT_Math: { min: { type: String }, max: { type: String } },
// //     ACT: { min: { type: String }, max: { type: String } },
// //   },
// //   financialAid: {
// //     percentageAid: { type: String },
// //     pellGrant: { type: String },
// //     expense: { min: { type: String }, max: { type: String } },
// //     studentLoans: { type: String },
// //     averageDebt: { type: String },
// //   },
// //   acceptanceStats: {
// //     applicants: { type: String },
// //     accepted: { type: String },
// //     enrolled: { type: String },
// //   },
// //   graduation: {
// //     gradIn6Years: { type: String },
// //     returningFreshmen: { type: String },
// //   },
// //   ratings: {
// //     academics: { type: String },
// //     social: { type: String },
// //     qualityOfLife: { type: String },
// //   },
// //   admissionsContact: {
// //     phone: { type: String },
// //     email: { type: String },
// //   },
// //   programsOffered: {
// //     type: [String],
// //     default: [],
// //   },
// // });

// // // Pre-save middleware to clean and parse number fields
// // UniversitySchema.pre("save", function (next) {
// //   // Utility function to clean strings with %, $, commas
// //   const parseNumber = (value) => {
// //     if (typeof value === "string") {
// //       const cleanedValue = value.replace(/[%$,]/g, "").trim();
// //       const parsedValue = parseFloat(cleanedValue);
// //       return isNaN(parsedValue) ? null : parsedValue;
// //     }
// //     return value; // Return the original value if it's already a number
// //   };

// //   // Clean numeric fields before saving
// //   this.totalEnrollment = parseNumber(this.totalEnrollment);
// //   this.undergraduates = parseNumber(this.undergraduates);

// //   if (this.genderRatio) {
// //     this.genderRatio.male = parseNumber(this.genderRatio.male);
// //     this.genderRatio.female = parseNumber(this.genderRatio.female);
// //   }

// //   if (this.testScores) {
// //     this.testScores.SAT_ERW.min = parseNumber(this.testScores.SAT_ERW.min);
// //     this.testScores.SAT_ERW.max = parseNumber(this.testScores.SAT_ERW.max);
// //     this.testScores.SAT_Math.min = parseNumber(this.testScores.SAT_Math.min);
// //     this.testScores.SAT_Math.max = parseNumber(this.testScores.SAT_Math.max);
// //     this.testScores.ACT.min = parseNumber(this.testScores.ACT.min);
// //     this.testScores.ACT.max = parseNumber(this.testScores.ACT.max);
// //   }

// //   if (this.financialAid) {
// //     this.financialAid.percentageAid = parseNumber(
// //       this.financialAid.percentageAid
// //     );
// //     this.financialAid.pellGrant = parseNumber(this.financialAid.pellGrant);
// //     this.financialAid.expense.min = parseNumber(this.financialAid.expense.min);
// //     this.financialAid.expense.max = parseNumber(this.financialAid.expense.max);
// //     this.financialAid.studentLoans = parseNumber(
// //       this.financialAid.studentLoans
// //     );
// //     this.financialAid.averageDebt = parseNumber(this.financialAid.averageDebt);
// //   }

// //   if (this.acceptanceStats) {
// //     this.acceptanceStats.applicants = parseNumber(
// //       this.acceptanceStats.applicants
// //     );
// //     this.acceptanceStats.accepted = parseNumber(this.acceptanceStats.accepted);
// //     this.acceptanceStats.enrolled = parseNumber(this.acceptanceStats.enrolled);
// //   }

// //   if (this.graduation) {
// //     this.graduation.gradIn6Years = parseNumber(this.graduation.gradIn6Years);
// //     this.graduation.returningFreshmen = parseNumber(
// //       this.graduation.returningFreshmen
// //     );
// //   }

// //   next();
// // });

// // const University = model("University", UniversitySchema);

// // export default University;

// // // import mongoose from "mongoose";

// // // const { Schema, model } = mongoose;

// // // const UniversitySchema = new Schema({
// // //   universityName: { type: String, required: true },
// // //   website: { type: String },
// // //   location: { type: String },
// // //   privateOrPublic: { type: String }, // Private or Public University
// // //   totalEnrollment: { type: String },
// // //   undergraduates: { type: String },
// // //   genderRatio: {
// // //     male: { type: String },
// // //     female: { type: String },
// // //   },
// // //   testScores: {
// // //     SAT_ERW: { min: { type: String }, max: { type: String } },
// // //     SAT_Math: { min: { type: String }, max: { type: String } },
// // //     ACT: { min: { type: String }, max: { type: String } },
// // //   },
// // //   financialAid: {
// // //     percentageAid: { type: String },
// // //     pellGrant: { type: String },
// // //     expense: { min: { type: String }, max: { type: String } },
// // //     studentLoans: { type: String },
// // //     averageDebt: { type: String },
// // //   },
// // //   acceptanceStats: {
// // //     applicants: { type: Number },
// // //     accepted: { type: Number },
// // //     enrolled: { type: Number },
// // //   },
// // //   graduation: {
// // //     gradIn6Years: { type: Number },
// // //     returningFreshmen: { type: Number },
// // //   },
// // //   ratings: {
// // //     academics: { type: Number },
// // //     social: { type: Number },
// // //     qualityOfLife: { type: Number },
// // //   },
// // //   admissionsContact: {
// // //     phone: { type: String },
// // //     email: { type: String },
// // //   },
// // //   programsOffered: {
// // //     type: [String], // Accepts an array of strings
// // //     default: [], // Defaults to an empty array
// // //   },
// // // });

// // // const University = model("University", UniversitySchema);

// // // export default University;
