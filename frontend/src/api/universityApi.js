import axios from "axios";

// Base URL for API requests
const API_URL = "http://localhost:8111/api";

// Fetch all universities
export const fetchAllUniversities = async () => {
  try {
    const response = await axios.get(`${API_URL}/universities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching universities:", error.message);
    throw error; // Re-throw error for handling in the calling code
  }
};
