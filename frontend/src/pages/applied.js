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
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8111/api/universities/applied",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      setAppliedUniversities(response.data || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching applied universities:", error);
      setAppliedUniversities([]); // Prevent undefined state
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
          appliedUniversities.map(
            (uni) =>
              uni.university ? ( // Check if university exists before rendering
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
              ) : null // Skip entries where university is null
          )
        ) : (
          <p className="text-muted text-center">No universities applied yet.</p>
        )}
      </Row>
    </Container>
  );
};

export default Applied;
