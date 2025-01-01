import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Nav } from "react-bootstrap";
import "../designsAndCss/UniversityList.css";
import axios from "axios";
import UniversityFilter from "../components/UniversityFilter.js";
import UniversitySearch from "../components/UniversitySearch.js";

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [activeTab, setActiveTab] = useState("universities");
  const [filters, setFilters] = useState({});
  // const [filteredUniversities, setFilteredUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        console.log("Fetching");
        setUniversities([]);
        const response = await axios.get(
          "http://localhost:8111/api/universities",
          {
            params:
              Object.keys(filters).length > 0
                ? { filter: JSON.stringify(filters) }
                : {}, // No filters if empty
          }
        );
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error.message);
      }
    };

    fetchUniversities(); // Always fetch, regardless of filters
  }, [filters]); // Add filters as a dependency

  const handleSearch = (universityName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      universityName,
    }));
  };

  const handleShortlist = (university) => {
    if (!shortlisted.some((u) => u._id === university._id)) {
      setShortlisted([...shortlisted, university]);
    }
  };
  const handleRemoveShortlist = (universityId) => {
    setShortlisted(shortlisted.filter((u) => u._id !== universityId));
  };

  return (
    <Container className="university-list-page">
      {/* <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(selectedKey) => setActiveTab(selectedKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey="universities">Universities</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="shortlisted">Shortlisted</Nav.Link>
        </Nav.Item>
      </Nav> */}
      <UniversityFilter
        onApplyFilters={(filter) => {
          console.log("filter1=>", filter);
          setFilters((prevFilters) => ({
            ...prevFilters,
            ...filter, // Spread the filter to correctly merge it with previous filters
          }));
        }}
      />
      <Row>
        <h1 className="page-title">Explore Top Universities Abroad</h1>
        <UniversitySearch
          onSearch={(university) => {
            handleSearch(university);
          }}
        />
        <Row>
          <Col md={9}>
            {activeTab === "universities" && (
              <Row className="university-cards">
                {universities.length > 0 ? (
                  universities.map((uni) => (
                    <Col md={12} key={uni._id} className="mb-4">
                      <Card className="university-card horizontal-card">
                        <Row className="no-gutters">
                          <Col md={4}>
                            <Card.Img
                              src={
                                uni.image || "https://via.placeholder.com/150"
                              }
                              alt={uni.universityName}
                              className="university-card-img"
                            />
                          </Col>
                          <Col md={8}>
                            <Card.Body>
                              <Card.Title>{uni.universityName}</Card.Title>
                              <Card.Text>
                                <strong>Website:</strong>{" "}
                                <a
                                  href={uni.website}
                                  target="_blank"
                                  rel="noreferrer"
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
                              <Card.Text>
                                <strong>Type:</strong> {uni.privatePublic}
                              </Card.Text>
                              <Card.Text>
                                <strong>Total Enrollment:</strong>{" "}
                                {uni.totalEnrollment}
                              </Card.Text>
                              <Card.Text>
                                <strong>Undergraduates:</strong>{" "}
                                {uni.undergraduates}
                              </Card.Text>
                              <Card.Text>
                                <strong>Male:</strong> {uni.male}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Female:</strong> {uni.female}%
                              </Card.Text>
                              <Card.Text>
                                <strong>SAT ERW Range:</strong> {uni.satErwMin}{" "}
                                - {uni.satErwMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>SAT Math Range:</strong>{" "}
                                {uni.satMathMin} - {uni.satMathMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>ACT Range:</strong> {uni.actMin} -{" "}
                                {uni.actMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>Financial Aid:</strong>{" "}
                                {uni.financialAid}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Pell Grant:</strong> {uni.pellGrant}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Expense Range:</strong> $
                                {uni.expenseMin} - ${uni.expenseMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>Student Loans:</strong>{" "}
                                {uni.studentLoans}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Average Debt:</strong> {uni.averageDebt}
                              </Card.Text>
                              <Card.Text>
                                <strong>Applicants:</strong> {uni.applicants}
                              </Card.Text>
                              <Card.Text>
                                <strong>Accepted:</strong> {uni.accepted}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Enrolled:</strong> {uni.enrolled}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Graduation in 6 Years:</strong>{" "}
                                {uni.gradIn6Years}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Returning Freshmen:</strong>{" "}
                                {uni.returningFreshmen}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Academics:</strong> {uni.academics}
                              </Card.Text>
                              <Card.Text>
                                <strong>Social:</strong> {uni.social}
                              </Card.Text>
                              <Card.Text>
                                <strong>Quality of Life:</strong>{" "}
                                {uni.qualityOfLife}
                              </Card.Text>
                              <Card.Text>
                                <strong>Admissions Phone:</strong> {uni.phone}
                              </Card.Text>
                              <Card.Text>
                                <strong>Email Address:</strong> {uni.email}
                              </Card.Text>

                              <Button
                                variant="primary"
                                className="shortlist-btn"
                                onClick={() => handleShortlist(uni)}
                              >
                                Shortlist
                              </Button>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="no-results">
                    No universities match your search criteria.
                  </p>
                )}
              </Row>
            )}

            {activeTab === "shortlisted" && (
              <Row className="university-cards">
                {shortlisted.length > 0 ? (
                  shortlisted.map((uni) => (
                    <Col md={12} key={uni._id} className="mb-4">
                      <Card className="university-card horizontal-card">
                        <Row className="no-gutters">
                          <Col md={4}>
                            <Card.Img
                              src={
                                uni.image || "https://via.placeholder.com/150"
                              }
                              alt={uni.universityName}
                              className="university-card-img"
                            />
                          </Col>
                          <Col md={8}>
                            <Card.Body>
                              <Card.Title>{uni.universityName}</Card.Title>
                              <Card.Text>
                                <strong>Website:</strong>{" "}
                                <a
                                  href={uni.website}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {uni.website}
                                </a>
                              </Card.Text>
                              <Card.Text>
                                <strong>Location:</strong> {uni.location}
                              </Card.Text>
                              <Card.Text>
                                <strong>Type:</strong> {uni.privatePublic}
                              </Card.Text>
                              <Card.Text>
                                <strong>Total Enrollment:</strong>{" "}
                                {uni.totalEnrollment}
                              </Card.Text>
                              <Card.Text>
                                <strong>Undergraduates:</strong>{" "}
                                {uni.undergraduates}
                              </Card.Text>
                              <Card.Text>
                                <strong>Male:</strong> {uni.male}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Female:</strong> {uni.female}%
                              </Card.Text>
                              <Card.Text>
                                <strong>SAT ERW Range:</strong> {uni.satErwMin}{" "}
                                - {uni.satErwMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>SAT Math Range:</strong>{" "}
                                {uni.satMathMin} - {uni.satMathMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>ACT Range:</strong> {uni.actMin} -{" "}
                                {uni.actMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>Financial Aid:</strong>{" "}
                                {uni.financialAid}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Pell Grant:</strong> {uni.pellGrant}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Expense Range:</strong> $
                                {uni.expenseMin} - ${uni.expenseMax}
                              </Card.Text>
                              <Card.Text>
                                <strong>Student Loans:</strong>{" "}
                                {uni.studentLoans}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Average Debt:</strong> {uni.averageDebt}
                              </Card.Text>
                              <Card.Text>
                                <strong>Applicants:</strong> {uni.applicants}
                              </Card.Text>
                              <Card.Text>
                                <strong>Accepted:</strong> {uni.accepted}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Enrolled:</strong> {uni.enrolled}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Graduation in 6 Years:</strong>{" "}
                                {uni.gradIn6Years}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Returning Freshmen:</strong>{" "}
                                {uni.returningFreshmen}%
                              </Card.Text>
                              <Card.Text>
                                <strong>Academics:</strong> {uni.academics}
                              </Card.Text>
                              <Card.Text>
                                <strong>Social:</strong> {uni.social}
                              </Card.Text>
                              <Card.Text>
                                <strong>Quality of Life:</strong>{" "}
                                {uni.qualityOfLife}
                              </Card.Text>
                              <Card.Text>
                                <strong>Admissions Phone:</strong> {uni.phone}
                              </Card.Text>
                              <Card.Text>
                                <strong>Email Address:</strong> {uni.email}
                              </Card.Text>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="no-results">No shortlisted universities yet.</p>
                )}
              </Row>
            )}
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default UniversityList;
