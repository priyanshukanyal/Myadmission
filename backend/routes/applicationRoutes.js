import express from "express";
import mongoose from "mongoose";
import StudentApplication from "../models/studentApplication.js";
import { upload, uploadToAzure } from "../middleware/azureUpload.js";
import protect from "../middleware/authMiddleware.js"; // Import authentication middleware

const router = express.Router();

/**
 * @route   POST /api/application/submit
 * @desc    Create or Update Student Application (Personal Details Only)
 * @access  Private
 */
router.post("/submit", protect, async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      nationality,
      contactDetails,
      permanentAddress,
      statementOfPurpose,
    } = req.body;

    const userId = req.user.userId; // Extract userId from token

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let studentApp = await StudentApplication.findOneAndUpdate(
      { userId },
      {
        fullName,
        dateOfBirth,
        nationality,
        contactDetails,
        permanentAddress,
        statementOfPurpose,
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Application submitted successfully",
      studentApp,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   POST /api/application/upload
 * @desc    Upload PDF Document to Azure and Save in DB
 * @access  Private
 */
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    const { documentType } = req.body;
    const userId = req.user.userId; // Extract userId from token

    if (!userId || !req.file) {
      return res.status(400).json({ message: "User ID and file are required" });
    }

    // Upload file to Azure Blob Storage
    const fileUrl = await uploadToAzure(req.file);

    // Update student's application with uploaded document
    const studentApp = await StudentApplication.findOneAndUpdate(
      { userId },
      {
        $push: {
          documents: {
            name: req.file.originalname,
            type: documentType || "Other", // Default to "Other" if not provided
            url: fileUrl,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "File uploaded successfully",
      fileUrl,
      documents: studentApp.documents,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   GET /api/application/:userId
 * @desc    Get Student Application Details (Including PDF URLs)
 * @access  Private
 */
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const studentApp = await StudentApplication.findOne({ userId });

    if (!studentApp) {
      return res.status(404).json({ message: "No application found" });
    }

    res.status(200).json(studentApp);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   GET /api/application/download/:docId
 * @desc    Download/View a Document by Document ID
 * @access  Private
 */
router.get("/download/:docId", protect, async (req, res) => {
  try {
    const { docId } = req.params;
    const userId = req.user.userId; // Extract userId from token

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({ message: "Invalid Document ID" });
    }

    const studentApp = await StudentApplication.findOne({ userId });

    if (!studentApp || !studentApp.documents.length) {
      return res.status(404).json({ message: "No documents found" });
    }

    const document = studentApp.documents.find(
      (doc) => doc._id.toString() === docId
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.redirect(document.url);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
