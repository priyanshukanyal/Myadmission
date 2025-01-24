import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert } from "react-bootstrap";

const SemesterApplicationDatesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8111/api/admin-module/semester-dates"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching semester application dates:", error);
        setError("Failed to fetch semester application dates.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Semester Application Dates</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>University Name</th>
            <th>Fall Start Date</th>
            <th>Fall End Date</th>
            <th>Spring Start Date</th>
            <th>Spring End Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.university.universityName}</td>
              <td>{new Date(item.fallStartDate).toLocaleDateString()}</td>
              <td>{new Date(item.fallEndDate).toLocaleDateString()}</td>
              <td>{new Date(item.springStartDate).toLocaleDateString()}</td>
              <td>{new Date(item.springEndDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SemesterApplicationDatesPage;
