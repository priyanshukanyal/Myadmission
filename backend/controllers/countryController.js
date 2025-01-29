import Country from "../models/country.js";

// Create a new country
export const createCountry = async (req, res) => {
  try {
    const {
      country_name,
      official_language,
      language_instruction,
      work_opportunity,
      work_permit,
      visa_requirements,
      healthcare,
      cost_of_living,
      climate,
      gdp,
      tax_policy,
      cultural_support,
    } = req.body;

    // Check if the country already exists
    const existingCountry = await Country.findOne({ country_name });
    if (existingCountry) {
      return res.status(400).json({ message: "Country already exists" });
    }

    const newCountry = new Country({
      country_name,
      official_language,
      language_instruction,
      work_opportunity,
      work_permit,
      visa_requirements,
      healthcare,
      cost_of_living,
      climate,
      gdp,
      tax_policy,
      cultural_support,
    });

    await newCountry.save();
    res
      .status(201)
      .json({ message: "Country created successfully", country: newCountry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating country", error: error.message });
  }
};

// Get all countries
export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching countries", error: error.message });
  }
};

// Get a single country by ID
export const getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json(country);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching country", error: error.message });
  }
};

// Get a single country by Name (NEW METHOD)
export const getCountryByName = async (req, res) => {
  try {
    const country = await Country.findOne({ country_name: req.params.name });
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json(country);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching country", error: error.message });
  }
};

// Update a country by ID
export const updateCountry = async (req, res) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json({
      message: "Country updated successfully",
      country: updatedCountry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating country", error: error.message });
  }
};

// Delete a country by ID
export const deleteCountry = async (req, res) => {
  try {
    const deletedCountry = await Country.findByIdAndDelete(req.params.id);
    if (!deletedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting country", error: error.message });
  }
};
