import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const UpdateSemesterDateForm = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [formData, setFormData] = useState({
    fallStartDate: "",
    fallEndDate: "",
    springStartDate: "",
    springEndDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data for the specific ID
    const fetchSemesterDate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/admin-module/semester-dates${id}`
        );
        setFormData({
          fallStartDate: response.data.fallStartDate,
          fallEndDate: response.data.fallEndDate,
          springStartDate: response.data.springStartDate,
          springEndDate: response.data.springEndDate,
        });
      } catch (error) {
        console.error("Error fetching semester date:", error);
      }
    };

    fetchSemesterDate();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8111/api/admin-module/semester-dates`,
        { ...formData, id }
      );
      navigate("/semester-application-dates"); // Navigate back to the main page
    } catch (error) {
      console.error("Error updating semester date:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Semester Application Dates</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Fall Start Date</Form.Label>
          <Form.Control
            type="date"
            name="fallStartDate"
            value={formData.fallStartDate.split("T")[0]}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fall End Date</Form.Label>
          <Form.Control
            type="date"
            name="fallEndDate"
            value={formData.fallEndDate.split("T")[0]}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Spring Start Date</Form.Label>
          <Form.Control
            type="date"
            name="springStartDate"
            value={formData.springStartDate.split("T")[0]}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Spring End Date</Form.Label>
          <Form.Control
            type="date"
            name="springEndDate"
            value={formData.springEndDate.split("T")[0]}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
};

export default UpdateSemesterDateForm;
