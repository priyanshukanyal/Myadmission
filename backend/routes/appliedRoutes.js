import express from "express";
import {
  applyToUniversity,
  getUserApplications,
  deleteApplication,
} from "../controllers/appliedController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyToUniversity);
router.get("/my-applications", protect, getUserApplications);
router.delete("/application/:applicationId", protect, deleteApplication); // New route to delete application

export default router;
