import express from "express";
import {
  createOrUpdateSemesterDates,
  getSemesterDatesByUniversity,
  deleteSemesterDates,
  getAllSemesterDates,
} from "../controllers/SemesterApplicationDatesController.js";

const router = express.Router();

// POST: Create or Update Semester Application Dates
router.post("/semester-dates", createOrUpdateSemesterDates);

// GET: Get Semester Application Dates by University ID
router.get("/semester-dates/:universityId", getSemesterDatesByUniversity);

// DELETE: Delete Semester Application Dates
router.delete("/semester-dates/:id", deleteSemesterDates);

// GET: Get All Semester Application Dates
router.get("/semester-dates", getAllSemesterDates);

export default router;
