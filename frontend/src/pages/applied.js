import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext.js";

const Applied = () => {
  const [appliedUniversities, setAppliedUniversities] = useState([]);
  const { state } = useAuth();
  const { token } = state;

  const fetchAppliedUniversities = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming you're using token-based auth
      const response = await axios.get(
        "http://localhost:8111/api/universities/applied",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setAppliedUniversities(response.data);
    } catch (error) {
      console.error("Error fetching applied universities:", error);
    }
  };

  useEffect(() => {
    fetchAppliedUniversities();
  }, []);

  return (
    <Container>
      <h1 className="mt-4 mb-4 text-primary">Applied Universities</h1>
      <Row>
        {appliedUniversities.length > 0 ? (
          appliedUniversities.map((uni) => (
            <Col key={uni._id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    University Name: {uni.university.universityName}
                  </Card.Title>
                  <Card.Text>Location: {uni.university.location}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-muted text-center">No universities applied yet.</p>
        )}
      </Row>
    </Container>
  );
};

export default Applied;
