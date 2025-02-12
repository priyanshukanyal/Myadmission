import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext";
import debounce from "lodash.debounce";

const ApplySection = () => {
  const { state } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [universities, setUniversities] = useState([]);
  const [appliedUniversities, setAppliedUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppliedUniversities();
  }, []);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchTerm) {
      } else {
        setUniversities([]);
      }
    }, 500);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const fetchAppliedUniversities = async () => {
    try {
      setError("");
      const res = await axios.get(
        "http://localhost:8111/api/applied/my-applications",
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      setAppliedUniversities(res.data);
    } catch (err) {
      console.error("Error fetching applied universities:", err);
      setError("Failed to load applied universities.");
    }
  };

  const handleApply = async () => {
    if (!applicationNumber) {
      setError("Please enter an application number.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await axios.post(
        "http://localhost:8111/api/applied/apply",
        {
          universityId: selectedUniversity._id,
          applicationNumber,
        },
        { headers: { Authorization: `Bearer ${state.token}` } }
      );

      setShowModal(false);
      setApplicationNumber("");
      fetchAppliedUniversities();
    } catch (err) {
      console.error("Error applying to university:", err);
      setError("Failed to apply.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      setError("");
      setLoading(true);
      await axios.delete(
        `http://localhost:8111/api/applied/application/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );

      fetchAppliedUniversities();
    } catch (err) {
      console.error("Error deleting application:", err);
      setError("Failed to delete application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Applied Universities */}
      <h3 className="mt-4">Applied Universities</h3>
      {appliedUniversities.length === 0 ? (
        <p>No applied universities yet.</p>
      ) : (
        <ListGroup>
          {appliedUniversities.map((app) => (
            <ListGroup.Item
              key={app._id}
              className="d-flex justify-content-between"
            >
              <div>
                <strong>{app.university.universityName}</strong> -{" "}
                {app.university.country}
                <br />
                Application No: {app.applicationNumber}
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteApplication(app._id)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

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
          <Button variant="primary" onClick={handleApply} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplySection;
