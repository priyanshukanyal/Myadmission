import { Router } from "express";
import {
  getAllUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/universityControllers.js";

const router = Router();

// Route to get all universities
router.get("/", getAllUniversities);

// Route to get a specific university by ID
router.get("/:id", getUniversityById);

// Route to create a new university
router.post("/", createUniversity);

// Route to update a university by ID
router.put("/:id", updateUniversity);

// Route to delete a university by ID
router.delete("/:id", deleteUniversity);

export default router;
