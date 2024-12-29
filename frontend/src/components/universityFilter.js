import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "../designsAndCss/UniversityFilter.css";

const UniversityFilter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    SATENG: "",
    SATMATH: "",
    ACT: "",
    country: "",
    city: "",
    university: "",
    program: "",
    expense: "",
    universityType: "",
  });

  const [testType, setTestType] = useState("");
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch universities and cities when the component mounts
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8111/api/universities"
        );
        setUniversities(response.data); // Assuming API returns an array of universities
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  // Update filters state when a filter value changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters({ ...filters, [name]: checked });
  };

  // Trigger the filter application callback
  const applyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <Form className="filter-form">
      <h4>Filters</h4>

      {/* Test Type */}
      <Form.Group className="mb-3">
        <Form.Label>Test Type</Form.Label>
        <Form.Select
          name="testType"
          onChange={(e) => {
            setTestType(e.target.value);
            // Reset scores when test type changes
            setFilters((prevFilters) => ({
              ...prevFilters,
              satEnglishScore: "",
              satMathScore: "",
              actScore: "",
            }));
          }}
        >
          <option value="">Select Test Type</option>
          <option value="SAT">SAT</option>
          <option value="ACT">ACT</option>
        </Form.Select>
      </Form.Group>

      {/* Dynamic Score Input */}
      {testType === "SAT" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Enter English Score</Form.Label>
            <Form.Control
              type="number"
              name="SATENG"
              placeholder="Enter English Score"
              onChange={handleFilterChange}
              value={filters.sATERWMin}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Enter Math Score</Form.Label>
            <Form.Control
              type="number"
              name="SATMATH"
              placeholder="Enter Math Score"
              onChange={handleFilterChange}
              value={filters.sATMMin}
            />
          </Form.Group>
          <Button variant="primary" className="mb-3" onClick={applyFilters}>
            Submit SAT Scores
          </Button>
        </>
      )}
      {testType === "ACT" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Enter Score</Form.Label>
            <Form.Control
              type="number"
              name="ACT"
              placeholder="Enter ACT Score"
              onChange={handleFilterChange}
              value={filters.aCTMin}
            />
          </Form.Group>
          <Button variant="primary" className="mb-3" onClick={applyFilters}>
            Submit ACT Score
          </Button>
        </>
      )}

      {/* Country */}
      <Form.Group className="mb-3">
        <Form.Label>Country</Form.Label>
        <Form.Select name="country" onChange={handleFilterChange}>
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
        </Form.Select>
      </Form.Group>

      {/* City */}
      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Form.Select name="city" onChange={handleFilterChange}>
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* University */}
      <Form.Group className="mb-3">
        <Form.Label>University</Form.Label>
        <Form.Select name="university" onChange={handleFilterChange}>
          <option value="">Select University</option>
          {universities.map((uni) => (
            <option key={uni._id} value={uni.universityName}>
              {uni.universityName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Program */}
      <Form.Group className="mb-3">
        <Form.Label>Program</Form.Label>
        <Form.Select name="program" onChange={handleFilterChange}>
          <option value="">Select Program</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
          <option value="Medicine">Medicine</option>
        </Form.Select>
      </Form.Group>

      {/* Expense */}
      <Form.Group className="mb-3">
        <Form.Label>Expense</Form.Label>
        <Form.Select name="expense" onChange={handleFilterChange}>
          <option value="">Select Expense</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Form.Select>
      </Form.Group>

      {/* University Type */}
      <Form.Group className="mb-3">
        <Form.Label>University Type</Form.Label>
        <Form.Select name="universityType" onChange={handleFilterChange}>
          <option value="">Select University Type</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </Form.Select>
      </Form.Group>

      {/* Checkboxes */}
      {/* <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="includeIvyLeagues"
          label="Include Ivy Leagues"
          onChange={handleCheckboxChange}
        />
        <Form.Check
          type="checkbox"
          name="hasSTEMCourse"
          label="Has STEM Course"
          onChange={handleCheckboxChange}
        />
      </Form.Group> */}

      {/* Search Buttons */}
      <Button variant="primary" className="me-2" onClick={applyFilters}>
        Search
      </Button>
      <Button variant="secondary">My Lists</Button>
    </Form>
  );
};

export default UniversityFilter;

// import React, { useState, useEffect } from "react";
// import { Form, Button } from "react-bootstrap";
// import axios from "axios";
// import "../designsAndCss/UniversityFilter.css";

// const UniversityFilter = ({ onApplyFilters }) => {
//   const [filters, setFilters] = useState({
//     testType: "",
//     score: "",
//     country: "",
//     city: "",
//     university: "",
//     program: "",
//     expense: "",
//     universityType: "",
//     includeIvyLeagues: false,
//     hasSTEMCourse: false,
//   });

//   const [universities, setUniversities] = useState([]);
//   const [cities, setCities] = useState([]);

//   // Fetch universities and cities when the component mounts
//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8111/api/universities"
//         );
//         setUniversities(response.data); // Assuming API returns an array of universities
//       } catch (error) {
//         console.error("Error fetching universities:", error);
//       }
//     };

//     // const fetchCities = async () => {
//     //   try {
//     //     const response = await axios.get("/api/cities");
//     //     setCities(response.data); // Assuming API returns an array of cities
//     //   } catch (error) {
//     //     console.error("Error fetching cities:", error);
//     //   }
//     // };

//     fetchUniversities();
//     // fetchCities();
//   }, []);

//   // Update filters state when a filter value changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFilters({ ...filters, [name]: checked });
//   };

//   // Trigger the filter application callback
//   const applyFilters = () => {
//     onApplyFilters(filters);
//   };

//   return (
//     <Form className="filter-form">
//       <h4>Filters</h4>

//       {/* Test Type and Score */}
//       <Form.Group className="mb-3">
//         <Form.Label>Test Type</Form.Label>
//         <Form.Select name="testType" onChange={handleFilterChange}>
//           <option value="">Select Test Type</option>
//           <option value="SAT">SAT</option>
//           <option value="ACT">ACT</option>
//         </Form.Select>
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Score</Form.Label>
//         <Form.Control
//           type="number"
//           name="score"
//           placeholder="Enter Score"
//           onChange={handleFilterChange}
//         />
//       </Form.Group>
//       <Button variant="primary" className="mb-3" onClick={applyFilters}>
//         Submit Score
//       </Button>

//       {/* Country */}
//       <Form.Group className="mb-3">
//         <Form.Label>Country</Form.Label>
//         <Form.Select name="country" onChange={handleFilterChange}>
//           <option value="">Select Country</option>
//           <option value="USA">USA</option>
//           <option value="Canada">Canada</option>
//           <option value="UK">UK</option>
//         </Form.Select>
//       </Form.Group>

//       {/* City */}
//       <Form.Group className="mb-3">
//         <Form.Label>City</Form.Label>
//         <Form.Select name="city" onChange={handleFilterChange}>
//           <option value="">Select City</option>
//           {cities.map((city, index) => (
//             <option key={index} value={city}>
//               {city}
//             </option>
//           ))}
//         </Form.Select>
//       </Form.Group>

//       {/* University */}
//       <Form.Group className="mb-3">
//         <Form.Label>University</Form.Label>
//         <Form.Select name="university" onChange={handleFilterChange}>
//           <option value="">Select University</option>
//           {universities.map((uni) => (
//             <option key={uni._id} value={uni.universityName}>
//               {uni.universityName}
//             </option>
//           ))}
//         </Form.Select>
//       </Form.Group>

//       {/* Program */}
//       <Form.Group className="mb-3">
//         <Form.Label>Program</Form.Label>
//         <Form.Select name="program" onChange={handleFilterChange}>
//           <option value="">Select Program</option>
//           <option value="Engineering">Engineering</option>
//           <option value="Business">Business</option>
//           <option value="Medicine">Medicine</option>
//         </Form.Select>
//       </Form.Group>

//       {/* Expense */}
//       <Form.Group className="mb-3">
//         <Form.Label>Expense</Form.Label>
//         <Form.Select name="expense" onChange={handleFilterChange}>
//           <option value="">Select Expense</option>
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </Form.Select>
//       </Form.Group>

//       {/* University Type */}
//       <Form.Group className="mb-3">
//         <Form.Label>University Type</Form.Label>
//         <Form.Select name="universityType" onChange={handleFilterChange}>
//           <option value="">Select University Type</option>
//           <option value="Public">Public</option>
//           <option value="Private">Private</option>
//         </Form.Select>
//       </Form.Group>

//       {/* Checkboxes */}
//       <Form.Group className="mb-3">
//         <Form.Check
//           type="checkbox"
//           name="includeIvyLeagues"
//           label="Include Ivy Leagues"
//           onChange={handleCheckboxChange}
//         />
//         <Form.Check
//           type="checkbox"
//           name="hasSTEMCourse"
//           label="Has STEM Course"
//           onChange={handleCheckboxChange}
//         />
//       </Form.Group>

//       {/* Search Buttons */}
//       <Button variant="primary" className="me-2" onClick={applyFilters}>
//         Search
//       </Button>
//       <Button variant="secondary">My Lists</Button>
//     </Form>
//   );
// };

// export default UniversityFilter;
