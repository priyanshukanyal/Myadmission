// controllers/studentProfileController.js
import StudentProfile from "../models/StudentProfile.js";

// Get student profile
export const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create or update student profile
export const upsertProfile = async (req, res) => {
  const {
    name,
    fullName,
    address,
    phoneNumber,
    fatherName,
    motherName,
    additionalDetails,
  } = req.body;

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      {
        name,
        fullName,
        address,
        phoneNumber,
        fatherName,
        motherName,
        additionalDetails,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};
