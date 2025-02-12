import mongoose from "mongoose"; // Ensure mongoose is imported
import University from "../models/universityModel.js";
import ShortlistedUniversity from "../models/ShortlistedUniversity.js";

// Add a university to the shortlist
export const addToShortlist = async (req, res) => {
  try {
    const { userId, universityId } = req.body;

    // Validate userId and universityId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID." });
    }
    if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({ message: "Invalid University ID." });
    }

    // Fetch university details
    const university = await University.findById(universityId).lean();
    if (!university) {
      return res.status(404).json({ message: "University not found." });
    }

    // Check if already shortlisted
    const existingShortlist = await ShortlistedUniversity.findOne({
      user: userId,
      university: universityId,
    }).lean();

    if (existingShortlist) {
      return res
        .status(400)
        .json({ message: "University already shortlisted." });
    }

    // ✅ Add university to the shortlist
    const newShortlist = new ShortlistedUniversity({
      user: userId,
      university: universityId,
    });

    await newShortlist.save();

    // 🔹 Populate ONLY `universityName` and `country`
    const populatedShortlist = await newShortlist.populate(
      "university",
      "universityName country"
    );

    res.status(201).json({
      message: "University shortlisted successfully.",
      shortlist: populatedShortlist,
    });
  } catch (error) {
    console.error("Error adding to shortlist:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all shortlisted universities for a specific user
export const getShortlistedUniversities = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID." });
    }

    const shortlisted = await ShortlistedUniversity.find({
      user: userId,
    })
      .populate("university", "universityName country") // 🔹 Populate only required fields
      .lean();

    res.status(200).json({ shortlistedUniversities: shortlisted });
  } catch (error) {
    console.error("Error fetching shortlisted universities:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Remove a university from the shortlist
export const removeFromShortlist = async (req, res) => {
  try {
    const { userId, universityId } = req.params;

    // Validate userId and universityId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({ message: "Invalid University ID." });
    }

    // Check if the university exists in the shortlist
    const existingShortlist = await ShortlistedUniversity.findOne({
      user: userId,
      university: universityId, // Ensure this matches schema field
    });

    if (!existingShortlist) {
      return res
        .status(404)
        .json({ message: "University not found in shortlist for the user." });
    }

    // ✅ Delete the shortlisted university
    await ShortlistedUniversity.deleteOne({
      user: userId,
      university: universityId,
    });

    res
      .status(200)
      .json({ message: "University removed from shortlist successfully." });
  } catch (error) {
    console.error("Error removing from shortlist:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all universities based on filter criteria
export const getAllUniversities = async (req, res) => {
  try {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const mongoFilters = {};

    // Apply various filters based on query parameters
    if (filter.satMathScore) {
      mongoFilters.satMathMin = { $lte: parseInt(filter.satMathScore, 10) };
    }

    if (filter.satEngScore) {
      mongoFilters.satErwMin = { $lte: parseInt(filter.satEngScore, 10) };
    }

    if (filter.actScore) {
      mongoFilters.actMin = { $lte: parseInt(filter.actScore, 10) };
    }

    if (filter.country) {
      mongoFilters.country = filter.country;
    }

    if (filter.city) {
      mongoFilters.location = filter.city;
    }

    if (filter.universityType) {
      mongoFilters.privatePublic = filter.universityType;
    }

    if (filter.expense) {
      mongoFilters.expenseMin = { $lte: parseInt(filter.expense, 10) };
    }

    if (filter.universityName) {
      mongoFilters.universityName = {
        $regex: filter.universityName,
        $options: "i", // Case-insensitive match
      };
    }

    // Apply 'program' filter if it exists
    if (filter.specialCourses) {
      mongoFilters.specialCourses = {
        $regex: filter.specialCourses,
        $options: "i", // Case-insensitive match
      };
    }

    // Fetch universities from the database with the applied filters
    const universities = await University.find(mongoFilters);

    if (universities.length === 0) {
      return res.status(404).json({
        message: "No universities found matching the filter criteria.",
      });
    }

    res.status(200).json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a university by its ID
export const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university)
      return res.status(404).json({ message: "University not found" });
    res.status(200).json(university);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new university
export const createUniversity = async (req, res) => {
  try {
    const newUniversity = new University(req.body);
    const savedUniversity = await newUniversity.save();
    res.status(201).json(savedUniversity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing university by its ID
export const updateUniversity = async (req, res) => {
  try {
    const updatedUniversity = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUniversity)
      return res.status(404).json({ message: "University not found" });
    res.status(200).json(updatedUniversity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a university by its ID
export const deleteUniversity = async (req, res) => {
  try {
    const deletedUniversity = await University.findByIdAndDelete(req.params.id);
    if (!deletedUniversity)
      return res.status(404).json({ message: "University not found" });
    res.status(200).json({ message: "University deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get university names with optional search filter
export const getUniversityNames = async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? { universityName: { $regex: search, $options: "i" } }
      : {};

    const universityNames = await University.find(query, "universityName");
    res.status(200).json(universityNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const addToShortlist = async (req, res) => {
//   try {
//     const { universityId } = req.body;
//     const userId = req.user._id;

//     if (!universityId) {
//       return res.status(400).json({ message: "University ID is required." });
//     }

//     const existingShortlist = await ShortlistedUniversity.findOne({
//       user: userId,
//       university: universityId,
//     });
//     if (existingShortlist) {
//       return res.status(400).json({ message: "Already shortlisted." });
//     }

//     const newShortlist = new ShortlistedUniversity({
//       user: userId,
//       university: universityId,
//     });
//     await newShortlist.save();

//     res.status(201).json({ message: "University shortlisted successfully." });
//   } catch (error) {
//     console.error("Error adding to shortlist:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

// export const getShortlistedUniversities = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const shortlisted = await ShortlistedUniversity.find({
//       user: userId,
//     }).populate("university");
//     res.status(200).json(shortlisted);
//   } catch (error) {
//     console.error("Error fetching shortlisted universities:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const removeFromShortlist = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { id } = req.params;

//     const result = await ShortlistedUniversity.findOneAndDelete({
//       user: userId,
//       university: id,
//     });

//     if (!result) {
//       return res
//         .status(404)
//         .json({ message: "University not found in shortlist." });
//     }

//     res.status(200).json({ message: "University removed from shortlist." });
//   } catch (error) {
//     console.error("Error removing shortlisted university:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };
