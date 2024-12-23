import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import emailjs from "emailjs-com";
import "bootstrap/dist/css/bootstrap.min.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "Contact from University Website",
  });

  const [emailStatus, setEmailStatus] = useState({
    success: null,
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_zbdcxr9", // Replace with your EmailJS Service ID
        "template_wm458ff", // Replace with your EmailJS Template ID
        formData,
        "y0j4kn4ZS9K7YHnyB" // Replace with your EmailJS User ID
      )
      .then(
        (response) => {
          setEmailStatus({
            success: true,
            message: "Your message has been sent successfully!",
          });
          setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
        },
        (error) => {
          setEmailStatus({
            success: false,
            message: "An error occurred. Please try again later.",
          });
        }
      );
  };

  return (
    <Container className="contact-form-container">
      <h1 className="text-center mt-4">Contact Us</h1>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            {emailStatus.message && (
              <Alert
                variant={emailStatus.success ? "success" : "danger"}
                className="text-center"
              >
                {emailStatus.message}
              </Alert>
            )}

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3 w-100">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactForm;
