import { Router } from "express";
import {
  getAllUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversityNames,
} from "../controllers/universityControllers.js";

import {
  addToShortlist,
  getShortlistedUniversities,
  removeFromShortlist,
} from "../controllers/universityControllers.js";
import protect from "../middleware/authMiddleware.js";
import AppliedUniversity from "../models/AppliedUniversity.js";

const router = Router();

// Shortlist routes
router.post("/shortlist", addToShortlist); // Add to shortlist
router.get("/shortlisted", getShortlistedUniversities); // Get all shortlisted universities
router.delete("/shortlist/:id", removeFromShortlist); // Remove from shortlist

// University routes
router.get("/", getAllUniversities); // Get all universities
router.get("/names", getUniversityNames); // Get university names
router.get("/:id", getUniversityById); // Get university by ID
router.post("/", createUniversity); // Create new university
router.put("/:id", updateUniversity); // Update university by ID
router.delete("/:id", protect, deleteUniversity); // Delete university by ID

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
export default router;
