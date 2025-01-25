import SemesterApplicationDates from "../models/SemesterApplicationDates.js";
import University from "../models/universityModel.js";

// Create or Update Application Dates
export const createOrUpdateSemesterDates = async (req, res) => {
  try {
    const {
      universityId,
      fallStartDate,
      fallEndDate,
      fallOrientationWeekStart,
      fallOrientationWeekEnd,
      fallAcademicSemesterStart,
      fallAcademicSemesterEnd,
      springStartDate,
      springEndDate,
      springOrientationWeekStart,
      springOrientationWeekEnd,
      springAcademicSemesterStart,
      springAcademicSemesterEnd,
      aboutUniversity,
      visa,
      weather,
      security,
      placement,
    } = req.body;

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const semesterDates = await SemesterApplicationDates.findOneAndUpdate(
      { university: universityId },
      {
        fallStartDate,
        fallEndDate,
        fallOrientationWeekStart,
        fallOrientationWeekEnd,
        fallAcademicSemesterStart,
        fallAcademicSemesterEnd,
        springStartDate,
        springEndDate,
        springOrientationWeekStart,
        springOrientationWeekEnd,
        springAcademicSemesterStart,
        springAcademicSemesterEnd,
        aboutUniversity,
        visa,
        weather,
        security,
        placement,
      },
      { new: true, upsert: true } // `upsert: true` creates a new document if it doesn't exist
    );

    res.status(200).json(semesterDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Semester Application Dates with University Names
export const getAllSemesterDates = async (req, res) => {
  try {
    const semesterDates = await SemesterApplicationDates.find()
      .populate("university", "universityName") // Only populate the university name
      .select(
        "fallStartDate fallEndDate fallOrientationWeekStart fallOrientationWeekEnd fallAcademicSemesterStart fallAcademicSemesterEnd springStartDate springEndDate springOrientationWeekStart springOrientationWeekEnd springAcademicSemesterStart springAcademicSemesterEnd aboutUniversity visa weather security placement university"
      ); // Select all relevant fields

    if (!semesterDates.length) {
      return res.status(404).json({ message: "No application dates found" });
    }

    res.status(200).json(semesterDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Application Dates by University
export const getSemesterDatesByUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;

    const semesterDates = await SemesterApplicationDates.findOne({
      university: universityId,
    });
    if (!semesterDates) {
      return res
        .status(404)
        .json({ message: "Application dates not found for this university" });
    }

    res.status(200).json(semesterDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Application Dates
export const deleteSemesterDates = async (req, res) => {
  try {
    const { id } = req.params;

    const semesterDates = await SemesterApplicationDates.findByIdAndDelete(id);
    if (!semesterDates) {
      return res.status(404).json({ message: "Application dates not found" });
    }

    res.status(200).json({ message: "Application dates deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
