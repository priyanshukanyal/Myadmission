import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
  {
    country_name: {
      type: String,
      required: true,
      unique: true, // Ensures country_name is unique
    },
    official_language: {
      type: [String],
      required: true,
    },
    language_instruction: {
      type: [String],
      required: true,
    },
    work_opportunity: {
      type: String,
      required: true,
    },
    work_permit: {
      type: String,
      required: true,
    },
    visa_requirements: {
      type: String,
      required: true,
    },
    healthcare: {
      type: String,
      required: true,
    },
    cost_of_living: {
      type: Number,
      required: true,
    },
    climate: {
      type: String,
      required: true,
    },
    gdp: {
      type: String,
      required: true,
    },
    tax_policy: {
      type: String,
      required: true,
    },
    cultural_support: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Country = mongoose.model("Country", CountrySchema);

export default Country;
