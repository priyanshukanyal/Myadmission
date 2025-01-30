import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

const Shortlisted = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { state } = useAuth();
  const { token } = state;

  // Fetch shortlisted universities
  useEffect(() => {
    const fetchShortlistedUniversities = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:8111/api/universities/shortlisted",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Shortlisted universities:", response.data);

        if (Array.isArray(response.data)) {
          setShortlisted(response.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          setShortlisted([]);
        }
      } catch (error) {
        console.error("Error fetching shortlisted universities:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch shortlisted universities."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchShortlistedUniversities();
  }, [token]);

  // Remove university from shortlist
  const handleRemoveShortlist = async (universityId) => {
    if (!token || !universityId) return;

    try {
      await axios.delete(
        `http://localhost:8111/api/universities/shortlist/${universityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Successfully removed university:", universityId);

      // Update state to remove the university from the list
      setShortlisted((prevShortlist) =>
        prevShortlist.filter((uni) => uni.university?._id !== universityId)
      );

      setSuccessMessage("University removed from shortlist.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error removing shortlisted university:", error);
      setError("Failed to remove the university. Please try again.");
    }
  };

  return (
    <Container className="shortlisted-list-page">
      <h1 className="page-title mb-4 text-primary">
        My Shortlisted Universities
      </h1>

      {isLoading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage(null)}
          dismissible
        >
          {successMessage}
        </Alert>
      )}

      {!isLoading && shortlisted.length === 0 && !error && (
        <p className="text-center text-muted">
          No shortlisted universities found.
        </p>
      )}

      <Row>
        {shortlisted.map(({ university, _id }) => {
          if (!university) return null; // Skip if university data is missing

          return (
            <Col md={4} key={_id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Img
                  variant="top"
                  src={
                    university.image || "https://via.placeholder.com/300x200"
                  }
                  alt={university.universityName || "Unknown University"}
                />
                <Card.Body>
                  <Card.Title className="text-primary">
                    {university.universityName || "Unknown University"}
                  </Card.Title>
                  <Card.Text>
                    <strong>Location:</strong> {university.location || "N/A"}
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveShortlist(university._id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Shortlisted;
