import University from "../models/universityModel.js";

// Get all universities
export const getAllUniversities = async (req, res) => {
  try {
    // Parse the filter object from query parameters
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    // Initialize a filter object for MongoDB
    console.log("filter==><", filter);
    const mongoFilters = {};

    // Apply filters conditionally
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

    // if (filter.expense) {
    //   mongoFilters.expenseMin = { $lte: parseInt(filter.expense, 10) };
    // }

    if (filter.universityName) {
      mongoFilters.universityName = {
        $regex: filter.universityName,
        $options: "i", // Case-insensitive partial match
      };
    }

    // Apply 'program' filter if it exists
    if (filter.program) {
      mongoFilters.program = {
        $regex: filter.program,
        $options: "i", // Case-insensitive match
      };
    }

    // Fetch universities based on the filters
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

// Get a university by ID
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

// Update a university by ID
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

// Delete a university by ID
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
// Search or get all university names
export const getUniversityNames = async (req, res) => {
  try {
    const { search } = req.query; // Extract 'search' query parameter

    const query = search
      ? { universityName: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    const universityNames = await University.find(query, "universityName");
    res.status(200).json(universityNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
