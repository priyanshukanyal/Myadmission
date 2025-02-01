import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import UniversityFilter from "../components/universityFilter.js";
import UniversitySearch from "../components/UniversitySearch.js";
import { useAuth } from "../components/generalComponents/authContext.js";
import useShortlist from "../hooks/useShortlist.js";

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [sortCriteria, setSortCriteria] = useState("ranking");
  const { state } = useAuth();
  const { token } = state;
  const { shortlisted = [], addShortlist } = useShortlist();

  const universitiesPerPage = 10;

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setUniversities([]);

        // Ensure universityName is sent as a string
        const validFilters = Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) => value !== null && value !== ""
          )
        );

        if (
          validFilters.universityName &&
          typeof validFilters.universityName !== "string"
        ) {
          validFilters.universityName =
            validFilters.universityName.universityName; // Extract string value
        }

        const response = await axios.get(
          "http://localhost:8111/api/universities",
          {
            params: validFilters.universityName
              ? { filter: JSON.stringify(validFilters) }
              : {},
          }
        );

        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error.message);
      }
    };

    fetchUniversities();
  }, [filters]);

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8111/api/universities/shortlisted",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        addShortlist(response.data);
      } catch (error) {
        console.error(
          "Error fetching shortlisted universities:",
          error.message
        );
      }
    };

    if (token) {
      fetchShortlisted();
    }
  }, [token]);

  const handleSearch = (universityName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      universityName: universityName || "", // Ensure it's a string
    }));
  };

  const handleCheckboxChange = (filterKey, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value ? (filterKey === "isIvy" ? "Yes" : true) : null,
    }));
  };

  // Apply filters on frontend
  const filteredUniversities = universities.filter((uni) => {
    let matches = true;

    if (filters.isIvy === "Yes") {
      matches = matches && uni.isIvy === "Yes";
    }

    if (filters.top50Ranking) {
      matches = matches && uni.ranking <= 50;
    }

    if (filters.universityName && typeof filters.universityName === "string") {
      matches =
        matches &&
        uni.universityName
          .toLowerCase()
          .includes(filters.universityName.toLowerCase());
    }

    return matches;
  });

  const handleShortlist = async (university) => {
    try {
      const response = await axios.post(
        "http://localhost:8111/api/universities/shortlist",
        { universityId: university._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error shortlisting university:", error);
    }
  };

  const startIndex = (currentPage - 1) * universitiesPerPage;
  const currentUniversities = universities.slice(
    startIndex,
    startIndex + universitiesPerPage
  );

  const handleNext = () => {
    if (currentPage * universitiesPerPage < universities.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleApply = async (university) => {
    try {
      const response = await axios.post(
        "http://localhost:8111/api/universities/apply",
        { universityId: university._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      alert(error.response?.data?.message || "Error applying for university.");
    }
  };

  // Sorting logic
  const sortUniversities = (universitiesArray) => {
    return [...universitiesArray].sort((a, b) => {
      if (sortCriteria === "fees") {
        return a.fees - b.fees;
      } else if (sortCriteria === "placement") {
        return b.placement - a.placement;
      } else if (sortCriteria === "ranking") {
        return a.ranking - b.ranking;
      }
      return 0;
    });
  };

  const handleSortChange = (newSortCriteria) => {
    setSortCriteria(newSortCriteria);
  };

  // Sort the universities based on the selected sort criteria
  const sortedUniversities = sortUniversities(filteredUniversities);

  return (
    <Container className="university-list-page">
      <Row>
        <Col md={3} className="university-filter-wrapper mb-4">
          <Card className="p-3 shadow-sm">
            <UniversityFilter
              onApplyFilters={(filter) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  ...filter,
                }));
              }}
            />
          </Card>
        </Col>
        <Col md={9}>
          <h1 className="page-title mb-4 text-primary">
            Explore Top Universities Abroad
          </h1>
          <Card className="p-3 shadow-sm mb-4">
            <UniversitySearch onSearch={handleSearch} />
          </Card>

          {/* Checkbox Filters */}
          <Form className="d-flex align-items-center mb-4">
            <Form.Check
              type="checkbox"
              label="Is Ivy"
              className="me-3"
              onChange={(e) => handleCheckboxChange("isIvy", e.target.checked)}
              checked={filters.isIvy === "Yes"}
            />
            <Form.Check
              type="checkbox"
              label="Top 50 Ranking"
              onChange={(e) =>
                handleCheckboxChange("top50Ranking", e.target.checked)
              }
              checked={filters.top50Ranking === true}
            />
          </Form>

          {/* Sorting Dropdown */}
          <DropdownButton
            variant="outline-primary"
            title={`Sort by ${
              sortCriteria.charAt(0).toUpperCase() + sortCriteria.slice(1)
            }`}
            className="mb-4"
            onSelect={(e) => setSortCriteria(e)}
          >
            <Dropdown.Item eventKey="ranking">Ranking</Dropdown.Item>
            <Dropdown.Item eventKey="fees">Fees</Dropdown.Item>
            <Dropdown.Item eventKey="placement">Placement</Dropdown.Item>
          </DropdownButton>

          {/* View Mode Toggle Button */}
          <ButtonGroup className="mb-4">
            <Button
              variant={viewMode === "list" ? "primary" : "outline-primary"}
              onClick={() => setViewMode("list")}
            >
              List View
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "outline-primary"}
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </Button>
          </ButtonGroup>

          <Row className={viewMode === "grid" ? "g-4" : ""}>
            {currentUniversities.length > 0 ? (
              sortedUniversities
                .slice(startIndex, startIndex + universitiesPerPage)
                .map((uni) => (
                  <Col
                    md={viewMode === "grid" ? 4 : 12}
                    key={uni._id}
                    className="mb-4"
                  >
                    <Card
                      className={`university-card shadow-sm border-0 ${
                        viewMode === "grid" ? "h-100" : ""
                      }`}
                    >
                      <Row className={viewMode === "list" ? "g-0" : ""}>
                        <Col
                          md={viewMode === "list" ? 4 : 12}
                          className="p-3 university-image"
                        >
                          <img
                            src={uni.logo || "/default-logo.png"}
                            alt={uni.universityName}
                            className="img-fluid rounded"
                          />
                        </Col>
                        <Col
                          md={viewMode === "list" ? 8 : 12}
                          className="p-3 university-details"
                        >
                          <h5>{uni.universityName}</h5>
                          <p>Location: {uni.location}</p>
                          <p>
                            <strong>Ranking: </strong>
                            {uni.ranking}
                          </p>
                          <p>
                            <strong>Fees: </strong>$ {uni.fees} {" / "} ₹{" "}
                            {uni.fees * 86.5}
                          </p>
                          <p>
                            <strong>Is IVY: </strong>
                            {uni.isIvy}
                          </p>
                          <p>
                            <strong>Placement: </strong>
                            {uni.placement}%
                          </p>
                          <div className="d-flex justify-content-between">
                            <Button
                              variant="outline-primary"
                              onClick={() => handleShortlist(uni)}
                            >
                              {shortlisted.some((item) => item._id === uni._id)
                                ? "Shortlisted"
                                : "Add to Shortlist"}
                            </Button>
                            <Link to={`/university/${uni._id}`}>
                              <Button variant="primary">View Details</Button>
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))
            ) : (
              <p>No universities found.</p>
            )}
          </Row>

          {/* Pagination */}
          <div className="pagination mt-4">
            <Button
              variant="outline-primary"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleNext}
              disabled={
                currentPage * universitiesPerPage >= universities.length
              }
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UniversityList;

//   return (
//     <Container className="university-list-page">
//       <Row>
//         <Col md={3} className="university-filter-wrapper mb-4">
//           <Card className="p-3 shadow-sm">
//             <UniversityFilter
//               onApplyFilters={(filter) => {
//                 setFilters((prevFilters) => ({
//                   ...prevFilters,
//                   ...filter,
//                 }));
//               }}
//             />
//           </Card>
//         </Col>
//         <Col md={9}>
//           <h1 className="page-title mb-4 text-primary">
//             Explore Top Universities Abroad
//           </h1>
//           <Card className="p-3 shadow-sm mb-4">
//             <UniversitySearch onSearch={handleSearch} />
//           </Card>
//           <Row className="university-cards">
//             {currentUniversities.length > 0 ? (
//               currentUniversities.map((uni) => (
//                 <Col md={12} key={uni._id} className="mb-4">
//                   <Card className="university-card shadow-sm border-0">
//                     <Row className="g-0">
//                       <Col md={4} className="university-card-img-wrapper">
//                         <Card.Img
//                           src={
//                             uni.image || "https://via.placeholder.com/300x200"
//                           }
//                           alt={uni.universityName}
//                           className="university-card-img"
//                         />
//                       </Col>
//                       <Col md={8}>
//                         <Card.Body>
//                           <Card.Title className="text-primary mb-3">
//                             {uni.universityName}
//                           </Card.Title>
//                           <Row>
//                             <Col md={6}>
//                               <Card.Text>
//                                 <strong>Website:</strong>{" "}
//                                 <a
//                                   href={uni.website}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="text-decoration-none"
//                                 >
//                                   {uni.website}
//                                 </a>
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Location:</strong> {uni.location}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Country:</strong> {uni.country}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Type:</strong> {uni.privatePublic}
//                               </Card.Text>
//                             </Col>
//                             <Col md={6}>
//                               <Card.Text>
//                                 <strong>Total Enrollment:</strong>{" "}
//                                 {uni.totalEnrollment}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Undergraduates:</strong>{" "}
//                                 {uni.undergraduates}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Male:</strong> {uni.male}%
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Female:</strong> {uni.female}%
//                               </Card.Text>
//                             </Col>
//                           </Row>
//                           <div className="d-flex justify-content-start mt-3">
//                             <Button
//                               variant="primary"
//                               onClick={() => handleShortlist(uni)}
//                               disabled={shortlisted.some(
//                                 (u) => u._id === uni._id
//                               )}
//                               className="me-2"
//                             >
//                               {shortlisted.some((u) => u._id === uni._id)
//                                 ? "Shortlisted"
//                                 : "Shortlist"}
//                             </Button>

//                             <Link
//                               to={`/university/${uni._id}`}
//                               className="btn btn-outline-primary me-2"
//                             >
//                               View Details
//                             </Link>
//                             <a
//                               href={uni.website}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="btn btn-secondary"
//                             >
//                               Apply
//                             </a>
//                           </div>
//                         </Card.Body>
//                       </Col>
//                     </Row>
//                   </Card>
//                 </Col>
//               ))
//             ) : (
//               <p className="text-center text-muted">
//                 No universities match your search criteria.
//               </p>
//             )}
//           </Row>
//           <div className="pagination-buttons text-center mt-4">
//             <Button
//               variant="secondary"
//               onClick={handlePrevious}
//               disabled={currentPage === 1}
//               className="me-2"
//             >
//               Previous
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={handleNext}
//               disabled={
//                 currentPage * universitiesPerPage >= universities.length
//               }
//             >
//               Next
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default UniversityList;

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import axios from "axios";
// import UniversityFilter from "../components/UniversityFilter.js";
// import UniversitySearch from "../components/UniversitySearch.js";

// const UniversityList = () => {
//   const [universities, setUniversities] = useState([]);
//   const [shortlisted, setShortlisted] = useState([]);
//   const [filters, setFilters] = useState({});
//   const [currentPage, setCurrentPage] = useState(1); // Track the current page

//   const universitiesPerPage = 10; // Number of universities to show per page

//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         setUniversities([]);
//         const response = await axios.get(
//           "http://localhost:8111/api/universities",
//           {
//             params:
//               Object.keys(filters).length > 0
//                 ? { filter: JSON.stringify(filters) }
//                 : {},
//           }
//         );
//         setUniversities(response.data);
//       } catch (error) {
//         console.error("Error fetching universities:", error.message);
//       }
//     };

//     fetchUniversities(); // Always fetch, regardless of filters
//   }, [filters]);

//   const handleSearch = (universityName) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       universityName,
//     }));
//   };

//   const handleShortlist = (university) => {
//     if (!shortlisted.some((u) => u._id === university._id)) {
//       setShortlisted([...shortlisted, university]);
//     }
//   };

//   // Calculate the universities to display based on the current page
//   const startIndex = (currentPage - 1) * universitiesPerPage;
//   const currentUniversities = universities.slice(
//     startIndex,
//     startIndex + universitiesPerPage
//   );

//   const handleNext = () => {
//     if (currentPage * universitiesPerPage < universities.length) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <Container className="university-list-page">
//       <Row>
//         <Col md={3}>
//           <div className="university-filter-wrapper">
//             <UniversityFilter
//               onApplyFilters={(filter) => {
//                 setFilters((prevFilters) => ({
//                   ...prevFilters,
//                   ...filter,
//                 }));
//               }}
//             />
//           </div>
//         </Col>
//         <Col md={9}>
//           <h1 className="page-title">Explore Top Universities Abroad</h1>
//           <UniversitySearch onSearch={handleSearch} />
//           <Row className="university-cards">
//             {currentUniversities.length > 0 ? (
//               currentUniversities.map((uni) => (
//                 <Col md={12} key={uni._id} className="mb-4">
//                   <Card className="university-card">
//                     <Row className="no-gutters">
//                       <Col md={4}>
//                         <Card.Img
//                           src={uni.image || "https://via.placeholder.com/150"}
//                           alt={uni.universityName}
//                           className="university-card-img"
//                         />
//                       </Col>
//                       <Col md={8}>
//                         <Card.Body>
//                           <Card.Title>{uni.universityName}</Card.Title>
//                           <Row>
//                             <Col md={6}>
//                               <Card.Text>
//                                 <strong>Website:</strong>{" "}
//                                 <a
//                                   href={uni.website}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                 >
//                                   {uni.website}
//                                 </a>
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Location:</strong> {uni.location}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Country:</strong> {uni.country}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Type:</strong> {uni.privatePublic}
//                               </Card.Text>
//                             </Col>
//                             <Col md={6}>
//                               <Card.Text>
//                                 <strong>Total Enrollment:</strong>{" "}
//                                 {uni.totalEnrollment}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Undergraduates:</strong>{" "}
//                                 {uni.undergraduates}
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Male:</strong> {uni.male}%
//                               </Card.Text>
//                               <Card.Text>
//                                 <strong>Female:</strong> {uni.female}%
//                               </Card.Text>
//                             </Col>
//                           </Row>
//                           <Button
//                             variant="primary"
//                             onClick={() => handleShortlist(uni)}
//                           >
//                             Shortlist
//                           </Button>
//                         </Card.Body>
//                       </Col>
//                     </Row>
//                   </Card>
//                 </Col>
//               ))
//             ) : (
//               <p className="no-results">
//                 No universities match your search criteria.
//               </p>
//             )}
//           </Row>
//           <div className="pagination-buttons">
//             <Button
//               variant="secondary"
//               onClick={handlePrevious}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={handleNext}
//               disabled={
//                 currentPage * universitiesPerPage >= universities.length
//               }
//             >
//               Next
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default UniversityList;
