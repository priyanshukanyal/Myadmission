import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Card, Col, Row } from "react-bootstrap";

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
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">
        Semester Application Dates
      </h2>

      <Row>
        {data.map((item) => (
          <Col md={6} lg={4} className="mb-4" key={item._id}>
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5>{item.university.universityName}</h5>
              </Card.Header>
              <Card.Body>
                <Table bordered responsive>
                  <tbody>
                    <tr>
                      <th>Fall Semester Start</th>
                      <td>
                        {new Date(item.fallStartDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <th>Fall Semester End</th>
                      <td>{new Date(item.fallEndDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th>Spring Semester Start</th>
                      <td>
                        {new Date(item.springStartDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <th>Spring Semester End</th>
                      <td>
                        {new Date(item.springEndDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <th>Fall Orientation Week</th>
                      <td>
                        {item.fallOrientationWeekStart
                          ? `${new Date(
                              item.fallOrientationWeekStart
                            ).toLocaleDateString()} - ${new Date(
                              item.fallOrientationWeekEnd
                            ).toLocaleDateString()}`
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>Spring Orientation Week</th>
                      <td>
                        {item.springOrientationWeekStart
                          ? `${new Date(
                              item.springOrientationWeekStart
                            ).toLocaleDateString()} - ${new Date(
                              item.springOrientationWeekEnd
                            ).toLocaleDateString()}`
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>Visa Info</th>
                      <td>{item.visa || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Weather</th>
                      <td>{item.weather || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Security</th>
                      <td>{item.security || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Placement</th>
                      <td>{item.placement || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SemesterApplicationDatesPage;
