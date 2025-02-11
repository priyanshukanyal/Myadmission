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
  const [isRemoving, setIsRemoving] = useState(false); // State for tracking removal loading
  const { state } = useAuth();
  const { token } = state;

  useEffect(() => {
    const fetchShortlistedUniversities = async () => {
      if (!token || !state.user?._id) {
        console.error("Missing token or user ID");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8111/api/universities/shortlisted/${state.user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Shortlisted universities:", response.data); // Debugging output

        // Check if the response contains the correct array or just a single shortlisted university
        if (
          response.data?.shortlistedUniversities &&
          Array.isArray(response.data.shortlistedUniversities)
        ) {
          setShortlisted(response.data.shortlistedUniversities);
        } else if (response.data?.shortlist) {
          // If a single university was returned
          setShortlisted([response.data.shortlist]);
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
  }, [token, state.user?._id]);

  const handleRemoveShortlist = async (universityId) => {
    if (!token || !universityId) {
      console.error("Missing token or university ID", { token, universityId });
      return;
    }

    try {
      setIsRemoving(true); // Set loading to true
      console.log("Removing university with ID:", universityId);

      const userId = state.user._id;

      // Ensure you're passing the correct URL and params
      await axios.delete(
        `http://localhost:8111/api/universities/shortlist/${userId}/${universityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Successfully removed university:", universityId);

      // Update the state
      setShortlisted((prevShortlist) =>
        prevShortlist.filter((item) => item.university._id !== universityId)
      );

      setSuccessMessage("University removed from shortlist.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(
        "Error removing shortlisted university:",
        error.response?.data || error
      );
      setError(
        error.response?.data?.message ||
          "Failed to remove the university. Please try again."
      );
    } finally {
      setIsRemoving(false); // Reset loading state
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
        {shortlisted.map((item) => {
          const { university, _id } = item; // Destructure university and _id from item

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
                    onClick={() => handleRemoveShortlist(university._id)} // Pass university._id here
                    disabled={isRemoving} // Disable button during the removal process
                  >
                    {isRemoving ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Remove"
                    )}
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
