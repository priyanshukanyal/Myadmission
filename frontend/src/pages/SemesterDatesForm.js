import React, { useState, useEffect } from "react";
import axios from "axios";
import UniversitySearch from "../components/UniversitySearch"; // Import your search component

const SemesterDatesForm = () => {
  const [formData, setFormData] = useState({
    fallStartDate: "",
    fallEndDate: "",
    springStartDate: "",
    springEndDate: "",
  });

  const [universityId, setUniversityId] = useState(""); // Store university ID here
  const [universityName, setUniversityName] = useState(""); // Optionally store the university name
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Debugging - Check universityId
  useEffect(() => {
    console.log("Selected University ID: ", universityId); // Log universityId
  }, [universityId]);

  // Fetch existing semester dates if available
  useEffect(() => {
    if (!universityId) return; // Skip fetch if no university selected

    const fetchSemesterDates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/admin-module/semester-dates/${universityId}`
        );
        setFormData({
          fallStartDate: response.data.fallStartDate.slice(0, 10),
          fallEndDate: response.data.fallEndDate.slice(0, 10),
          springStartDate: response.data.springStartDate.slice(0, 10),
          springEndDate: response.data.springEndDate.slice(0, 10),
        });
      } catch (error) {
        console.log("No existing data found.");
      }
    };

    fetchSemesterDates();
  }, [universityId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging - Check universityId before submitting
    console.log("Submitting form with universityId:", universityId);
    if (!universityId) {
      setMessage("Please select a university before submitting.");
      return;
    }

    setLoading(true);
    try {
      // Send POST request with universityId and form data
      await axios.post(
        "http://localhost:8111/api/admin-module/semester-dates",
        {
          universityId, // Only the universityId is needed
          ...formData,
        }
      );
      setMessage("Semester dates saved successfully!");
    } catch (error) {
      setMessage("Error saving semester dates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* University Search Component */}
      <UniversitySearch
        onSearch={(university) => {
          setUniversityId(university._id); // Set the university ID
          setUniversityName(university.universityName); // Optionally set the university name
          setMessage(""); // Clear any error message if a valid university is selected
          console.log("University selected:", university); // Debugging log
        }}
      />

      <form onSubmit={handleSubmit}>
        <h2>Enter Semester Application Dates for {universityName}</h2>{" "}
        {/* Show university name */}
        <div>
          <label>Fall Start Date:</label>
          <input
            type="date"
            name="fallStartDate"
            value={formData.fallStartDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Fall End Date:</label>
          <input
            type="date"
            name="fallEndDate"
            value={formData.fallEndDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Spring Start Date:</label>
          <input
            type="date"
            name="springStartDate"
            value={formData.springStartDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Spring End Date:</label>
          <input
            type="date"
            name="springEndDate"
            value={formData.springEndDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default SemesterDatesForm;
