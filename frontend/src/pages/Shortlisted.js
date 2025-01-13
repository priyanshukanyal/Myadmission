import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Shortlisted = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const { state } = useAuth();
  const { token } = state;

  // Fetch shortlisted universities
  useEffect(() => {
    const fetchShortlistedUniversities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8111/api/universities/shortlisted",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShortlisted(response.data);
      } catch (error) {
        console.error("Error fetching shortlisted universities:", error);
      }
    };

    if (token) fetchShortlistedUniversities();
  }, [token]);

  // Handle adding a university to the shortlist
  // const handleAddShortlist = async (universityId) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8111/api/universities/shortlist",
  //       { universityId }, // Ensure this matches the expected body
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     console.log("Successfully added to shortlist:", response.data);
  //   } catch (error) {
  //     console.error(
  //       "Error adding to shortlist:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };

  // Handle removing a university from the shortlist
  const handleRemoveShortlist = async (universityId) => {
    try {
      console.log("Attempting to delete:", universityId);
      const response = await axios.delete(
        `http://localhost:8111/api/universities/shortlist/${universityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Successfully removed from shortlist:", response.data);
      setShortlisted((prevShortlist) =>
        prevShortlist.filter((uni) => uni.university._id !== universityId)
      );
    } catch (error) {
      console.error(
        "Error removing shortlisted university:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Container className="shortlisted-list-page">
      <h1 className="page-title mb-4 text-primary">
        My Shortlisted Universities
      </h1>
      <Row>
        {shortlisted.length > 0 ? (
          shortlisted.map((uni) => (
            <Col md={4} key={uni._id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Img
                  variant="top"
                  src={uni.image || "https://via.placeholder.com/300x200"}
                  alt={uni.university.universityName}
                />
                <Card.Body>
                  <Card.Title className="text-primary">
                    {uni.university.universityName}
                  </Card.Title>
                  <Card.Text>
                    <strong>Location:</strong> {uni.university.location}
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveShortlist(uni.university._id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">
            No shortlisted universities found.
          </p>
        )}
      </Row>
    </Container>
  );
};

export default Shortlisted;
