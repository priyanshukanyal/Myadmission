import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "../designsAndCss/UniversityFilter.css";

const UniversityFilter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    satEngScore: "",
    satMathScore: "",
    actScore: "",
    country: "",
    city: "",
    program: "",
    expense: "",
    universityType: "",
  });

  const [testType, setTestType] = useState("");
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch universities and cities when the component mounts
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8111/api/universities"
        );
        setUniversities(response.data);
        const uniqueCities = [...new Set(response.data.map((uni) => uni.city))]; // Extract unique cities
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  // Update filters state when a filter value changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleTestTypeChange = (e) => {
    const { value } = e.target;
    setTestType(value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      satEngScore: "",
      satMathScore: "",
      actScore: "",
    }));
  };

  // Trigger the filter application callback
  const applyFilters = () => {
    // Clean up the filter object by removing empty strings or undefined values
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== "" && value !== null && value !== undefined
      )
    );
    onApplyFilters(cleanedFilters); // Pass the cleaned filters to the parent
  };

  return (
    <Form className="filter-form">
      <h4>Filters</h4>

      {/* Test Type */}
      <Form.Group className="mb-3">
        <Form.Label>Test Type</Form.Label>
        <Form.Select
          name="testType"
          onChange={handleTestTypeChange}
          value={testType}
        >
          <option value="">Select Test Type</option>
          <option value="SAT">SAT</option>
          <option value="ACT">ACT</option>
        </Form.Select>
      </Form.Group>

      {/* Dynamic Score Input for SAT/ACT */}
      {testType === "SAT" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Enter English Score</Form.Label>
            <Form.Control
              type="number"
              name="satEngScore"
              placeholder="Enter English Score"
              onChange={handleFilterChange}
              value={filters.satEngScore}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Enter Math Score</Form.Label>
            <Form.Control
              type="number"
              name="satMathScore"
              placeholder="Enter Math Score"
              onChange={handleFilterChange}
              value={filters.satMathScore}
            />
          </Form.Group>
        </>
      )}
      {testType === "ACT" && (
        <Form.Group className="mb-3">
          <Form.Label>Enter ACT Score</Form.Label>
          <Form.Control
            type="number"
            name="actScore"
            placeholder="Enter ACT Score"
            onChange={handleFilterChange}
            value={filters.actScore}
          />
        </Form.Group>
      )}

      {/* Country Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Country</Form.Label>
        <Form.Select
          name="country"
          onChange={handleFilterChange}
          value={filters.country}
        >
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
        </Form.Select>
      </Form.Group>

      {/* City Filter */}
      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Form.Select
          name="city"
          onChange={handleFilterChange}
          value={filters.city}
        >
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Program Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Program</Form.Label>
        <Form.Select
          name="program"
          onChange={handleFilterChange}
          value={filters.program}
        >
          <option value="">Select Program</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
          <option value="Medicine">Medicine</option>
        </Form.Select>
      </Form.Group>

      {/* Expense Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Expense</Form.Label>
        <Form.Control
          type="number"
          name="expense"
          placeholder="Enter Expense"
          onChange={handleFilterChange}
          value={filters.expense}
        />
      </Form.Group>

      {/* University Type Filter */}
      <Form.Group className="mb-3">
        <Form.Label>University Type</Form.Label>
        <Form.Select
          name="universityType"
          onChange={handleFilterChange}
          value={filters.universityType}
        >
          <option value="">Select University Type</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </Form.Select>
      </Form.Group>

      {/* Apply Filters */}
      <Button variant="primary" className="me-2" onClick={applyFilters}>
        Apply Filters
      </Button>
    </Form>
  );
};

export default UniversityFilter;
