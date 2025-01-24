import express from "express";
import {
  createOrUpdateSemesterDates,
  getSemesterDatesByUniversity,
  deleteSemesterDates,
} from "../controllers/SemesterApplicationDatesController.js";

const router = express.Router();

// POST: Create or Update Semester Application Dates
router.post("/semester-dates", createOrUpdateSemesterDates);

// GET: Get Semester Application Dates by University ID
router.get("/semester-dates/:universityId", getSemesterDatesByUniversity);

// DELETE: Delete Semester Application Dates
router.delete("/semester-dates/:id", deleteSemesterDates);

export default router;
