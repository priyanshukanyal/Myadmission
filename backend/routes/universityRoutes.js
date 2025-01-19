import { Router } from "express";
import {
  getAllUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/universityControllers.js";

import {
  getUniversityNames,
  addToShortlist,
  getShortlistedUniversities,
  removeFromShortlist,
} from "../controllers/universityControllers.js";
import protect from "../middleware/authMiddleware.js";
import ShortlistedUniversity from "../models/ShortlistedUniversity.js";
import AppliedUniversity from "../models/AppliedUniversity.js";

const router = Router();
router.post("/shortlist", protect, addToShortlist);
router.get("/shortlisted", protect, getShortlistedUniversities);
router.delete("/shortlist/:id", protect, removeFromShortlist);
// Route to get all universities
router.get("/", getAllUniversities);
router.post("/shortlist", protect, addToShortlist);
router.get("/shortlisted", protect, getShortlistedUniversities);
router.delete("/shortlist/:id", protect, removeFromShortlist);

// Route to get a specific university by ID
// Route to create a new university
router.post("/", createUniversity);

router.get("/names", getUniversityNames);

// Route to update a university by ID
router.put("/:id", updateUniversity);

// Route to delete a university by ID
router.delete("/:id", deleteUniversity);

router.post("/apply", protect, async (req, res) => {
  try {
    const { universityId } = req.body;
    const userId = req.user.id;

    const existingApplication = await AppliedUniversity.findOne({
      user: userId,
      university: universityId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied." });
    }

    const application = new AppliedUniversity({
      user: userId,
      university: universityId,
    });
    await application.save();

    res.status(201).json({ message: "University applied successfully." });
  } catch (error) {
    console.error("Error applying for university:", error);
    res.status(500).json({ message: "Server error." });
  }
});
router.get("/applied", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const appliedUniversities = await AppliedUniversity.find({
      user: userId,
    }).populate("university");
    res.status(200).json(appliedUniversities);
  } catch (error) {
    console.error("Error fetching applied universities:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// universityRoutes.js
router.post("/shortlist", protect, async (req, res) => {
  try {
    const { universityId } = req.body;
    const userId = req.user._id;

    // Ensure universityId is provided
    if (!universityId) {
      return res.status(400).json({ message: "University ID is required." });
    }

    // Check if the university already exists in the shortlist
    const existingShortlist = await ShortlistedUniversity.findOne({
      user: userId,
      university: universityId,
    });
    if (existingShortlist) {
      return res.status(400).json({ message: "Already shortlisted." });
    }

    // Add the university to the shortlist
    const newShortlist = new ShortlistedUniversity({
      user: userId,
      university: universityId,
    });
    await newShortlist.save();

    res.status(201).json({ message: "University shortlisted successfully." });
  } catch (error) {
    console.error("Error in shortlist route:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Route to get all shortlisted universities for the logged-in user
router.get("/shortlisted", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const shortlisted = await ShortlistedUniversity.find({
      user: userId,
    }).populate("university");
    res.status(200).json(shortlisted);
  } catch (error) {
    console.error("Error fetching shortlisted universities:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/shortlist/:id", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    console.log("User ID:", userId);
    console.log("University ID to delete:", id);

    // Find and delete the shortlisted university
    const result = await ShortlistedUniversity.findOneAndDelete({
      user: userId,
      university: id,
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "University not found in shortlist." });
    }

    res.status(200).json({ message: "University removed from shortlist." });
  } catch (error) {
    console.error("Error removing shortlisted university:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;
