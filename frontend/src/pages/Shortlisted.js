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
  Modal,
  Form,
} from "react-bootstrap";

const Shortlisted = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState(""); // Store application number
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

        if (Array.isArray(response.data.shortlistedUniversities)) {
          setShortlisted(response.data.shortlistedUniversities);
        } else {
          setShortlisted([]);
        }
      } catch (error) {
        setError("Failed to fetch shortlisted universities.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShortlistedUniversities();
  }, [token, state.user?._id]);

  const handleApplyClick = (university) => {
    setSelectedUniversity(university);
    setShowModal(true);
  };

  const handleApply = async () => {
    if (!selectedUniversity || !applicationNumber) {
      setError("Please enter an application number.");
      return;
    }

    try {
      setIsApplying(true);

      const response = await axios.post(
        "http://localhost:8111/api/applied/apply",
        { universityId: selectedUniversity._id, applicationNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Application successful:", response.data);
      setSuccessMessage("University successfully applied!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowModal(false);
      setApplicationNumber("");
    } catch (error) {
      console.error("Failed to apply:", error.response?.data || error);
      setError(
        error.response?.data?.message || "Failed to apply. Please try again."
      );
    } finally {
      setIsApplying(false);
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
          const { university, _id } = item;
          if (!university) return null;

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
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="success"
                      onClick={() => handleApplyClick(university)}
                    >
                      Apply
                    </Button>
                    <Button variant="danger">Remove</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Apply Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Apply to {selectedUniversity?.universityName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Application Number</Form.Label>
            <Form.Control
              type="text"
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              placeholder="Enter application number"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply} disabled={isApplying}>
            {isApplying ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Shortlisted;
