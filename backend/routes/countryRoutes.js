import express from "express";
import {
  createCountry,
  getAllCountries,
  getCountryById,
  getCountryByName,
  updateCountry,
  deleteCountry,
} from "../controllers/countryController.js";

const router = express.Router();

// CRUD Routes
router.post("/", createCountry); // Create a country
router.get("/", getAllCountries); // Get all countries
router.get("/name/:name", getCountryByName); // Get a country by Name (New Route)
router.get("/:id", getCountryById); // Get a country by ID
router.put("/:id", updateCountry); // Update a country
router.delete("/:id", deleteCountry); // Delete a country

export default router;
