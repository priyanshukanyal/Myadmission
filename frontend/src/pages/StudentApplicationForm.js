import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  ProgressBar,
} from "react-bootstrap";

const StudentApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    nationality: "",
    email: "",
    phone: "",
    address: "",
    sop: "",
  });

  const [documents, setDocuments] = useState({
    marksheets: null,
    degreeTranscripts: null,
    diplomas: null,
    lor: null,
    resume: null,
    passport: null,
    financialProof: null,
    workExperience: null,
    portfolio: null,
    additionalDocuments: null,
    universityForm: null,
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments({ ...documents, [name]: files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setProgress(10);
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No token found. Please log in.");
        alert("Authentication required. Please log in again.");
        setUploading(false);
        return;
      }

      // Step 1: Save student details
      let studentId;
      try {
        const studentDetailsResponse = await axios.post(
          "http://localhost:8111/api/application/submit",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        studentId = studentDetailsResponse.data.studentId;
        setProgress(40);
      } catch (error) {
        console.error(
          "Failed to save student details:",
          error.response?.data || error
        );
        setMessage("❌ Failed to save student details. Please try again.");
        setUploading(false);
        return;
      }

      // Step 2: Upload documents
      const uploadedFiles = {};
      const totalFiles = Object.values(documents).filter((file) => file).length;
      let uploadProgress = 40;

      for (const key in documents) {
        if (documents[key]) {
          try {
            const fileData = new FormData();
            fileData.append("file", documents[key]);
            fileData.append("studentId", studentId);

            const uploadResponse = await axios.post(
              "http://localhost:8111/api/application/files/upload",
              fileData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            uploadedFiles[key] = uploadResponse.data.fileUrl;
            uploadProgress += Math.floor(50 / totalFiles);
            setProgress(uploadProgress);
          } catch (error) {
            console.error(
              `Failed to upload ${key}:`,
              error.response?.data || error
            );
          }
        }
      }

      // Step 3: Save file URLs in MongoDB
      try {
        await axios.post(
          "http://localhost:8111/api/application/upload-documents",
          { studentId, documents: uploadedFiles },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProgress(100);
        setMessage("🎉 Application submitted successfully!");
      } catch (error) {
        console.error(
          "Failed to save uploaded document URLs:",
          error.response?.data || error
        );
        setMessage("❌ Failed to save uploaded documents. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("❌ Unexpected error occurred. Please try again.");
    }

    setUploading(false);
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-lg p-4">
        <Card.Header className="bg-primary text-white text-center">
          <h3>Student Application Form</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name (as per passport)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Permanent Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Statement of Purpose (SOP)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="sop"
                value={formData.sop}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <h5 className="mt-4">📁 Upload Required Documents (PDF Only)</h5>
            <Row>
              {Object.keys(documents).map((key, index) => (
                <Col md={6} key={index} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name={key}
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <Button
              variant="primary"
              type="submit"
              disabled={uploading}
              className="w-100 mt-3"
            >
              {uploading ? "Uploading..." : "Submit Application"}
            </Button>

            {uploading && (
              <ProgressBar animated now={progress} className="mt-3" />
            )}
          </Form>

          {message && (
            <p className="text-success text-center mt-3">{message}</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentApplicationForm;
