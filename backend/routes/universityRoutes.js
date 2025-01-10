import { Router } from "express";
import {
  getAllUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/universityControllers.js";

import { getUniversityNames } from "../controllers/universityControllers.js";
import protect from "../middleware/authMiddleware.js";

import AppliedUniversity from "../models/AppliedUniversity.js";

const router = Router();

// Route to get all universities
router.get("/", getAllUniversities);

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

export default router;
