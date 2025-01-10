import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ShortlistedUniversities = ({ shortlisted, setShortlisted }) => {
  const handleRemove = (universityId) => {
    const updatedList = shortlisted.filter((uni) => uni._id !== universityId);
    setShortlisted(updatedList); // This updates the shortlist
  };

  return (
    <Container className="shortlisted-page">
      <h1 className="page-title mb-4 text-primary">Shortlisted Universities</h1>
      {shortlisted.length > 0 ? (
        <Row className="university-cards">
          {shortlisted.map((uni) => (
            <Col md={12} key={uni._id} className="mb-4">
              <Card className="university-card shadow-sm border-0">
                <Row className="g-0">
                  <Col md={4} className="university-card-img-wrapper">
                    <Card.Img
                      src={uni.image || "https://via.placeholder.com/300x200"}
                      alt={uni.universityName}
                      className="university-card-img"
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title className="text-primary mb-3">
                        {uni.universityName}
                      </Card.Title>
                      <Row>
                        <Col md={6}>
                          <Card.Text>
                            <strong>Website:</strong>{" "}
                            <a
                              href={uni.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-decoration-none"
                            >
                              {uni.website}
                            </a>
                          </Card.Text>
                          <Card.Text>
                            <strong>Location:</strong> {uni.location}
                          </Card.Text>
                          <Card.Text>
                            <strong>Country:</strong> {uni.country}
                          </Card.Text>
                        </Col>
                        <Col md={6}>
                          <Card.Text>
                            <strong>Total Enrollment:</strong>{" "}
                            {uni.totalEnrollment}
                          </Card.Text>
                          <Card.Text>
                            <strong>Undergraduates:</strong>{" "}
                            {uni.undergraduates}
                          </Card.Text>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-start mt-3">
                        <Button
                          variant="danger"
                          onClick={() => handleRemove(uni._id)}
                          className="me-2"
                        >
                          Remove
                        </Button>
                        <Link
                          to={`/university/${uni._id}`}
                          className="btn btn-outline-primary me-2"
                        >
                          View Details
                        </Link>
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                        >
                          Apply
                        </a>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-muted">
          You have not shortlisted any universities yet.
        </p>
      )}
      <div className="text-center mt-4">
        <Link to="/Universities" className="btn btn-primary">
          Back to University List
        </Link>
      </div>
    </Container>
  );
};

export default ShortlistedUniversities;
