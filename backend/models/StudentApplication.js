import mongoose from "mongoose";

const studentApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Personal Details (Stored as Strings)
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    nationality: { type: String, required: true },
    contactDetails: {
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    permanentAddress: { type: String, required: true },
    statementOfPurpose: { type: String, required: true },

    // Documents (Only PDFs, Stored as URLs)
    documents: [
      {
        name: String, // File name
        type: String, // File type (e.g., "LOR", "Resume")
        url: String, // Azure Blob Storage URL
      },
    ],
  },
  { timestamps: true }
);

const StudentApplication = mongoose.model(
  "StudentApplication",
  studentApplicationSchema
);
export default StudentApplication;
