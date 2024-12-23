import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Nav } from "react-bootstrap";
import "../designsAndCss/UniversityList.css";
import axios from "axios"; // Import axios for API calls

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [activeTab, setActiveTab] = useState("universities");
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    program: "",
  });

  // Fetch universities from backend
  const fetchUniversities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8111/api/universities"
      );
      setUniversities(response.data); // Update state with API data
    } catch (error) {
      console.error("Error fetching universities:", error.message);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleShortlist = (university) => {
    if (!shortlisted.some((u) => u._id === university._id)) {
      setShortlisted([...shortlisted, university]);
    }
  };

  const filteredUniversities = universities.filter((uni) => {
    const { country, state, program } = filters;
    return (
      (!country || uni.location.includes(country)) &&
      (!state || uni.location.includes(state)) &&
      (!program || uni[program] === true)
    );
  });

  return (
    <Container className="university-list-page">
      <h1 className="page-title">Explore Top Universities Abroad</h1>
      <Nav
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
      </Nav>

      {activeTab === "universities" && (
        <>
          <Form className="filter-form">
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder="Enter Country"
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    placeholder="Enter State"
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Program</Form.Label>
                  <Form.Control
                    type="text"
                    name="program"
                    placeholder="Enter Program (e.g., engineering)"
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>

          <Row className="university-cards">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((uni) => (
                <Col md={12} key={uni._id} className="mb-4">
                  <Card className="university-card horizontal-card">
                    <Row className="no-gutters">
                      <Col md={4}>
                        <Card.Img
                          src={uni.image || "https://via.placeholder.com/150"}
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
                            <strong>Type:</strong>{" "}
                            {uni.privatePublic === "private"
                              ? "Private"
                              : "Public"}
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
                            <strong>Financial Aid:</strong>{" "}
                            {uni.financialAid ? "Available" : "Not Available"}
                          </Card.Text>
                          <Card.Text>
                            <strong>Programs:</strong>{" "}
                            {Object.keys(uni)
                              .filter((key) => uni[key] === true)
                              .join(", ")}
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
        </>
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
                        src={uni.image || "https://via.placeholder.com/150"}
                        alt={uni.universityName}
                        className="university-card-img"
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{uni.universityName}</Card.Title>
                        <Card.Text>
                          <strong>Location:</strong> {uni.location}
                        </Card.Text>
                        <Card.Text>
                          <strong>Programs:</strong>{" "}
                          {Object.keys(uni)
                            .filter((key) => uni[key] === true)
                            .join(", ")}
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
    </Container>
  );
};

export default UniversityList;

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button, Nav } from "react-bootstrap";
// import axios from "axios"; // Import axios for API calls
// import "../designsAndCss/UniversityList.css";

// const UniversityList = () => {
//   const [universities, setUniversities] = useState([]);
//   const [shortlisted, setShortlisted] = useState([]);
//   const [activeTab, setActiveTab] = useState("universities");
//   const [filters, setFilters] = useState({
//     country: "",
//     satScore: "",
//     actScore: "",
//     expenseRange: "",
//     financialAid: "",
//   });

//   // Fetch universities from backend
//   const fetchUniversities = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:8111/api/universities"
//       );
//       setUniversities(response.data); // Update state with API data
//     } catch (error) {
//       console.error("Error fetching universities:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleShortlist = (university) => {
//     if (!shortlisted.some((u) => u._id === university._id)) {
//       setShortlisted([...shortlisted, university]);
//     }
//   };

//   const expenseBracket = (filter, expense) => {
//     if (!expense) return true;
//     const [min, max] = filter.split("-").map(Number);
//     return expense >= min && expense <= max;
//   };

//   const filteredUniversities = universities.filter((uni) => {
//     const { country, satScore, actScore, expenseRange, financialAid } = filters;
//     return (
//       (!country || uni.location?.includes(country)) &&
//       (!satScore || uni.sat?.mathMax >= parseInt(satScore, 10)) &&
//       (!actScore || uni.act?.max >= parseInt(actScore, 10)) &&
//       (!expenseRange || expenseBracket(expenseRange, uni.expense?.max)) &&
//       (!financialAid || uni.financialAid === (financialAid === "true"))
//     );
//   });

//   return (
//     <Container className="university-list-page">
//       <h1 className="page-title">Explore Top Universities Abroad</h1>
//       <Nav
//         variant="tabs"
//         activeKey={activeTab}
//         onSelect={(selectedKey) => setActiveTab(selectedKey)}
//       >
//         <Nav.Item>
//           <Nav.Link eventKey="universities">Universities</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="shortlisted">Shortlisted</Nav.Link>
//         </Nav.Item>
//       </Nav>

//       {activeTab === "universities" && (
//         <>
//           <Form className="filter-form">
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Country</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="country"
//                     placeholder="Enter Country"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>SAT Score</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="satScore"
//                     placeholder="Min SAT Math Score"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>ACT Score</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="actScore"
//                     placeholder="Min ACT Score"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Expense Range (USD)</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="expenseRange"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All Ranges</option>
//                     <option value="0-20000">0 - 20,000</option>
//                     <option value="20001-40000">20,001 - 40,000</option>
//                     <option value="40001-60000">40,001 - 60,000</option>
//                     <option value="60001-80000">60,001 - 80,000</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Financial Aid</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="financialAid"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Yes</option>
//                     <option value="false">No</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>

//           <Row className="university-cards">
//             {filteredUniversities.length > 0 ? (
//               filteredUniversities.map((uni) => (
//                 <Col md={12} key={uni._id} className="mb-4">
//                   <Card className="university-card horizontal-card">
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
//                           <Card.Text>Location: {uni.location}</Card.Text>
//                           <Card.Text>
//                             SAT: {`Math Max: ${uni.sat?.mathMax}`}
//                           </Card.Text>
//                           <Card.Text>ACT: {`Max: ${uni.act?.max}`}</Card.Text>
//                           <Card.Text>
//                             Expense:{" "}
//                             {`$${uni.expense?.min} - $${uni.expense?.max}`}
//                           </Card.Text>
//                           <Card.Text>
//                             Financial Aid:{" "}
//                             {uni.financialAid ? "Available" : "Not Available"}
//                           </Card.Text>
//                           <Button
//                             variant="primary"
//                             className="shortlist-btn"
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
//         </>
//       )}

//       {activeTab === "shortlisted" && (
//         <Row className="university-cards">
//           {shortlisted.length > 0 ? (
//             shortlisted.map((uni) => (
//               <Col md={12} key={uni._id} className="mb-4">
//                 <Card className="university-card horizontal-card">
//                   <Row className="no-gutters">
//                     <Col md={4}>
//                       <Card.Img
//                         src={uni.image || "https://via.placeholder.com/150"}
//                         alt={uni.universityName}
//                         className="university-card-img"
//                       />
//                     </Col>
//                     <Col md={8}>
//                       <Card.Body>
//                         <Card.Title>{uni.universityName}</Card.Title>
//                         <Card.Text>Location: {uni.location}</Card.Text>
//                         <Card.Text>
//                           SAT: {`Math Max: ${uni.sat?.mathMax}`}
//                         </Card.Text>
//                         <Card.Text>ACT: {`Max: ${uni.act?.max}`}</Card.Text>
//                         <Card.Text>
//                           Expense:{" "}
//                           {`$${uni.expense?.min} - $${uni.expense?.max}`}
//                         </Card.Text>
//                         <Card.Text>
//                           Financial Aid:{" "}
//                           {uni.financialAid ? "Available" : "Not Available"}
//                         </Card.Text>
//                       </Card.Body>
//                     </Col>
//                   </Row>
//                 </Card>
//               </Col>
//             ))
//           ) : (
//             <p className="no-results">No shortlisted universities yet.</p>
//           )}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default UniversityList;

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button, Nav } from "react-bootstrap";
// import "../designsAndCss/UniversityList.css";
// import axios from "axios"; // Import axios for API calls

// const UniversityList = () => {
//   const [universities, setUniversities] = useState([]);
//   const [shortlisted, setShortlisted] = useState([]);
//   const [activeTab, setActiveTab] = useState("universities");
//   const [filters, setFilters] = useState({
//     country: "",
//     state: "",
//     ranking: "",
//     program: "",
//     weather: "",
//     testScore: "",
//   });

//   // Fetch universities from backend
//   const fetchUniversities = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:8111/api/universities"
//       );
//       setUniversities(response.data); // Update state with API data
//     } catch (error) {
//       console.error("Error fetching universities:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleShortlist = (university) => {
//     if (!shortlisted.some((u) => u._id === university._id)) {
//       setShortlisted([...shortlisted, university]);
//     }
//   };

//   const rankingBracket = (rankingFilter, rank) => {
//     switch (rankingFilter) {
//       case "1-50":
//         return rank <= 50;
//       case "51-100":
//         return rank > 50 && rank <= 100;
//       case "101-200":
//         return rank > 100 && rank <= 200;
//       case "201-300":
//         return rank > 200 && rank <= 300;
//       case "301-400":
//         return rank > 300 && rank <= 400;
//       case "400+":
//         return rank > 400;
//       default:
//         return true;
//     }
//   };

//   const filteredUniversities = universities.filter((uni) => {
//     const { country, state, ranking, program, weather, testScore } = filters;
//     return (
//       (!country || uni.country === country) &&
//       (!state || uni.state === state) &&
//       (!program || uni.program.includes(program)) &&
//       (!weather || uni.weather === weather) &&
//       (!ranking || rankingBracket(ranking, uni.ranking)) &&
//       (!testScore || uni.testScore >= parseInt(testScore, 10))
//     );
//   });

//   return (
//     <Container className="university-list-page">
//       <h1 className="page-title">Explore Top Universities Abroad</h1>
//       <Nav
//         variant="tabs"
//         activeKey={activeTab}
//         onSelect={(selectedKey) => setActiveTab(selectedKey)}
//       >
//         <Nav.Item>
//           <Nav.Link eventKey="universities">Universities</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="shortlisted">Shortlisted</Nav.Link>
//         </Nav.Item>
//       </Nav>

//       {activeTab === "universities" && (
//         <>
//           <Form className="filter-form">
//             <Row>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Country</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="country"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All Countries</option>
//                     <option value="USA">USA</option>
//                     <option value="UK">UK</option>
//                     <option value="Canada">Canada</option>
//                     <option value="Australia">Australia</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>State</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="state"
//                     placeholder="Enter State"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Ranking</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="ranking"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All Rankings</option>
//                     <option value="1-50">1-50</option>
//                     <option value="51-100">51-100</option>
//                     <option value="101-200">101-200</option>
//                     <option value="201-300">201-300</option>
//                     <option value="301-400">301-400</option>
//                     <option value="400+">Greater than 400</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Weather</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="weather"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All Weather</option>
//                     <option value="Summers">Summers</option>
//                     <option value="Winter">Winter</option>
//                     <option value="Moderate">Moderate</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Test Score</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="testScore"
//                     placeholder="Enter Minimum Score"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Program</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="program"
//                     placeholder="Enter Program"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>

//           <Row className="university-cards">
//             {filteredUniversities.length > 0 ? (
//               filteredUniversities.map((uni) => (
//                 <Col md={12} key={uni._id} className="mb-4">
//                   <Card className="university-card horizontal-card">
//                     <Row className="no-gutters">
//                       <Col md={4}>
//                         <Card.Img
//                           src={uni.image || "https://via.placeholder.com/150"}
//                           alt={uni.name}
//                           className="university-card-img"
//                         />
//                       </Col>
//                       <Col md={8}>
//                         <Card.Body>
//                           <Card.Title>{uni.name}</Card.Title>
//                           <Card.Text>Country: {uni.country}</Card.Text>
//                           <Card.Text>State: {uni.state}</Card.Text>
//                           <Card.Text>Ranking: {uni.ranking}</Card.Text>
//                           <Card.Text>Program: {uni.program}</Card.Text>
//                           <Card.Text>Weather: {uni.weather}</Card.Text>
//                           <Card.Text>Test Score: {uni.testScore}</Card.Text>
//                           <Button
//                             variant="primary"
//                             className="shortlist-btn"
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
//         </>
//       )}

//       {activeTab === "shortlisted" && (
//         <Row className="university-cards">
//           {shortlisted.length > 0 ? (
//             shortlisted.map((uni) => (
//               <Col md={12} key={uni._id} className="mb-4">
//                 <Card className="university-card horizontal-card">
//                   <Row className="no-gutters">
//                     <Col md={4}>
//                       <Card.Img
//                         src={uni.image || "https://via.placeholder.com/150"}
//                         alt={uni.name}
//                         className="university-card-img"
//                       />
//                     </Col>
//                     <Col md={8}>
//                       <Card.Body>
//                         <Card.Title>{uni.name}</Card.Title>
//                         <Card.Text>Country: {uni.country}</Card.Text>
//                         <Card.Text>State: {uni.state}</Card.Text>
//                         <Card.Text>Ranking: {uni.ranking}</Card.Text>
//                         <Card.Text>Program: {uni.program}</Card.Text>
//                         <Card.Text>Weather: {uni.weather}</Card.Text>
//                         <Card.Text>Test Score: {uni.testScore}</Card.Text>
//                       </Card.Body>
//                     </Col>
//                   </Row>
//                 </Card>
//               </Col>
//             ))
//           ) : (
//             <p className="no-results">No shortlisted universities yet.</p>
//           )}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default UniversityList;

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button, Nav } from "react-bootstrap";
// import "../designsAndCss/UniversityList.css";

// const UniversityList = () => {
//   const [universities, setUniversities] = useState([]);
//   const [shortlisted, setShortlisted] = useState([]);
//   const [activeTab, setActiveTab] = useState("universities");
//   const [filters, setFilters] = useState({
//     country: "",
//     state: "",
//     ranking: "",
//     program: "",
//     weather: "",
//     testScore: "",
//   });

//   const fetchUniversities = async () => {
//     const mockData = [
//       {
//         id: 1,
//         name: "Harvard University",
//         country: "USA",
//         state: "Massachusetts",
//         ranking: 1,
//         program: "Engineering",
//         weather: "Winter",
//         testScore: 320,
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         id: 2,
//         name: "University of Cambridge",
//         country: "UK",
//         state: "Cambridge",
//         ranking: 2,
//         program: "Law",
//         weather: "Moderate",
//         testScore: 310,
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         id: 3,
//         name: "University of Toronto",
//         country: "Canada",
//         state: "Ontario",
//         ranking: 26,
//         program: "Medicine",
//         weather: "Winter",
//         testScore: 300,
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         id: 4,
//         name: "University of Sydney",
//         country: "Australia",
//         state: "New South Wales",
//         ranking: 51,
//         program: "Business",
//         weather: "Summers",
//         testScore: 280,
//         image: "https://via.placeholder.com/150",
//       },
//     ];
//     setUniversities(mockData);
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleShortlist = (university) => {
//     if (!shortlisted.some((u) => u.id === university.id)) {
//       setShortlisted([...shortlisted, university]);
//     }
//   };

//   const rankingBracket = (rankingFilter, rank) => {
//     switch (rankingFilter) {
//       case "1-50":
//         return rank <= 50;
//       case "51-100":
//         return rank > 50 && rank <= 100;
//       case "101-200":
//         return rank > 100 && rank <= 200;
//       case "201-300":
//         return rank > 200 && rank <= 300;
//       case "301-400":
//         return rank > 300 && rank <= 400;
//       case "400+":
//         return rank > 400;
//       default:
//         return true;
//     }
//   };

//   const filteredUniversities = universities.filter((uni) => {
//     const { country, state, ranking, program, weather, testScore } = filters;
//     return (
//       (!country || uni.country === country) &&
//       (!state || uni.state === state) &&
//       (!program || uni.program.includes(program)) &&
//       (!weather || uni.weather === weather) &&
//       (!ranking || rankingBracket(ranking, uni.ranking)) &&
//       (!testScore || uni.testScore >= parseInt(testScore, 10))
//     );
//   });

//   return (
//     <Container className="university-list-page">
//       <h1 className="page-title">Explore Top Universities Abroad</h1>
//       <Nav
//         variant="tabs"
//         activeKey={activeTab}
//         onSelect={(selectedKey) => setActiveTab(selectedKey)}
//       >
//         <Nav.Item>
//           <Nav.Link eventKey="universities">Universities</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="shortlisted">Shortlisted</Nav.Link>
//         </Nav.Item>
//       </Nav>

//       {activeTab === "universities" && (
//         <>
//           <Form className="filter-form">
//             <Row>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Country</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="country"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All Countries</option>
//                     <option value="USA">USA</option>
//                     <option value="UK">UK</option>
//                     <option value="Canada">Canada</option>
//                     <option value="Australia">Australia</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>State</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="state"
//                     placeholder="Enter State"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Ranking</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="ranking"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All Rankings</option>
//                     <option value="1-50">1-50</option>
//                     <option value="51-100">51-100</option>
//                     <option value="101-200">101-200</option>
//                     <option value="201-300">201-300</option>
//                     <option value="301-400">301-400</option>
//                     <option value="400+">Greater than 400</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Weather</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="weather"
//                     onChange={handleFilterChange}
//                   >
//                     <option value="">All Weather</option>
//                     <option value="Summers">Summers</option>
//                     <option value="Winter">Winter</option>
//                     <option value="Moderate">Moderate</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Test Score</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="testScore"
//                     placeholder="Enter Minimum Score"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Program</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="program"
//                     placeholder="Enter Program"
//                     onChange={handleFilterChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>

//           <Row className="university-cards">
//             {filteredUniversities.length > 0 ? (
//               filteredUniversities.map((uni) => (
//                 <Col md={12} key={uni.id} className="mb-4">
//                   <Card className="university-card horizontal-card">
//                     <Row className="no-gutters">
//                       <Col md={4}>
//                         <Card.Img
//                           src={uni.image}
//                           alt={uni.name}
//                           className="university-card-img"
//                         />
//                       </Col>
//                       <Col md={8}>
//                         <Card.Body>
//                           <Card.Title>{uni.name}</Card.Title>
//                           <Card.Text>Country: {uni.country}</Card.Text>
//                           <Card.Text>State: {uni.state}</Card.Text>
//                           <Card.Text>Ranking: {uni.ranking}</Card.Text>
//                           <Card.Text>Program: {uni.program}</Card.Text>
//                           <Card.Text>Weather: {uni.weather}</Card.Text>
//                           <Card.Text>Test Score: {uni.testScore}</Card.Text>
//                           <Button
//                             variant="primary"
//                             className="shortlist-btn"
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
//         </>
//       )}

//       {activeTab === "shortlisted" && (
//         <Row className="university-cards">
//           {shortlisted.length > 0 ? (
//             shortlisted.map((uni) => (
//               <Col md={12} key={uni.id} className="mb-4">
//                 <Card className="university-card horizontal-card">
//                   <Row className="no-gutters">
//                     <Col md={4}>
//                       <Card.Img
//                         src={uni.image}
//                         alt={uni.name}
//                         className="university-card-img"
//                       />
//                     </Col>
//                     <Col md={8}>
//                       <Card.Body>
//                         <Card.Title>{uni.name}</Card.Title>
//                         <Card.Text>Country: {uni.country}</Card.Text>
//                         <Card.Text>State: {uni.state}</Card.Text>
//                         <Card.Text>Ranking: {uni.ranking}</Card.Text>
//                         <Card.Text>Program: {uni.program}</Card.Text>
//                         <Card.Text>Weather: {uni.weather}</Card.Text>
//                         <Card.Text>Test Score: {uni.testScore}</Card.Text>
//                       </Card.Body>
//                     </Col>
//                   </Row>
//                 </Card>
//               </Col>
//             ))
//           ) : (
//             <p className="no-results">No shortlisted universities yet.</p>
//           )}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default UniversityList;

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
// import "../designsAndCss/UniversityList.css";

// const UniversityList = () => {
//   const [universities, setUniversities] = useState([]);
//   const [filters, setFilters] = useState({
//     country: "",
//     state: "",
//     testScore: "",
//     weather: "",
//     ranking: "",
//     program: "",
//   });

//   const fetchUniversities = async () => {
//     const mockData = [
//       {
//         id: 1,
//         name: "Harvard University",
//         country: "USA",
//         ranking: 1,
//         program: "Engineering",
//         image: "https://via.placeholder.com/150", // Replace with real image URLs
//       },
//       {
//         id: 2,
//         name: "University of Cambridge",
//         country: "UK",
//         ranking: 2,
//         program: "Law",
//         image: "https://via.placeholder.com/150", // Replace with real image URLs
//       },
//     ];
//     setUniversities(mockData);
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const filteredUniversities = universities.filter((uni) => {
//     return (
//       (!filters.country || uni.country.includes(filters.country)) &&
//       (!filters.program || uni.program.includes(filters.program)) &&
//       (!filters.ranking || uni.ranking <= parseInt(filters.ranking))
//     );
//   });

//   return (
//     <Container className="university-list-page">
//       <h1 className="page-title">Explore Top Universities Abroad</h1>
//       <Form className="filter-form">
//         <Row>
//           <Col md={2}>
//             <Form.Control
//               type="text"
//               name="country"
//               placeholder="Country"
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="text"
//               name="state"
//               placeholder="State"
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="text"
//               name="testScore"
//               placeholder="Test Score"
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="text"
//               name="weather"
//               placeholder="Weather"
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="number"
//               name="ranking"
//               placeholder="Ranking <= "
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="text"
//               name="program"
//               placeholder="Program"
//               onChange={handleFilterChange}
//             />
//           </Col>
//         </Row>
//       </Form>

//       <Row className="university-cards">
//         {filteredUniversities.length > 0 ? (
//           filteredUniversities.map((uni) => (
//             <Col md={12} key={uni.id} className="mb-4">
//               <Card className="university-card horizontal-card">
//                 <Row className="no-gutters">
//                   <Col md={4}>
//                     <Card.Img
//                       src={uni.image}
//                       alt={uni.name}
//                       className="university-card-img"
//                     />
//                   </Col>
//                   <Col md={8}>
//                     <Card.Body>
//                       <Card.Title>{uni.name}</Card.Title>
//                       <Card.Text>Country: {uni.country}</Card.Text>
//                       <Card.Text>Ranking: {uni.ranking}</Card.Text>
//                       <Card.Text>Program: {uni.program}</Card.Text>
//                       <Button variant="primary" className="shortlist-btn">
//                         Shortlist
//                       </Button>
//                     </Card.Body>
//                   </Col>
//                 </Row>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <p className="no-results">
//             No universities match your search criteria.
//           </p>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default UniversityList;
