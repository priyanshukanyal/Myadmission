import Applied from "../models/Applied.js";
import University from "../models/universityModel.js";

// Apply to a university
export const applyToUniversity = async (req, res) => {
  try {
    const { universityId, applicationNumber } = req.body;
    const userId = req.user.id;

    if (!universityId || !applicationNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user has already applied to this university
    const existingApplication = await Applied.findOne({
      user: userId,
      university: universityId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this university." });
    }

    // Find university details
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    // Check if application number is unique
    const existingAppNumber = await Applied.findOne({ applicationNumber });
    if (existingAppNumber) {
      return res
        .status(400)
        .json({ message: "Application number already exists." });
    }

    // Create new application
    const applied = new Applied({
      user: userId,
      university: universityId,
      applicationNumber,
    });

    await applied.save();
    res
      .status(201)
      .json({ message: "Application submitted successfully", applied });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applied universities for a user
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Applied.find({ user: userId }).populate(
      "university",
      "universityName country"
    );

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an application
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    // Find the application and check ownership
    const application = await Applied.findOne({
      _id: applicationId,
      user: userId,
    });
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
    }

    await application.deleteOne();
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
