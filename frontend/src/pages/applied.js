import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext.js";

const Applied = () => {
  const [appliedUniversities, setAppliedUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useAuth();
  const { token } = state;

  const fetchAppliedUniversities = async () => {
    try {
      // Use token from useAuth context directly
      const response = await axios.get(
        "http://localhost:8111/api/universities/applied",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Ensure it's always an array
      setAppliedUniversities(response.data || []);
    } catch (error) {
      console.error("Error fetching applied universities:", error);
      setError("Error fetching applied universities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedUniversities();
  }, [token]); // Only re-run if token changes

  return (
    <Container>
      <h1 className="mt-4 mb-4 text-primary">Applied Universities</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : appliedUniversities.length > 0 ? (
        <Row>
          {appliedUniversities.map((uni) =>
            uni.university ? (
              <Col key={uni._id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      University Name: {uni.university.universityName}
                    </Card.Title>
                    <Card.Text>
                      Location: {uni.university.location || "N/A"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ) : null
          )}
        </Row>
      ) : (
        <p className="text-muted text-center">No universities applied yet.</p>
      )}
    </Container>
  );
};

export default Applied;
