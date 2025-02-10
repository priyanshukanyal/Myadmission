import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Button } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import useShortlist from "../hooks/useShortlist.js";
import { useAuth } from "../components/generalComponents/authContext.js";

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [semesterData, setSemesterData] = useState(null);
  const [countryData, setCountryData] = useState(null); // New State for Country Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { shortlisted, addShortlist } = useShortlist();
  const { state } = useAuth();
  const { token } = state;

  const handleShortlist = async (university) => {
    try {
      await axios.post(
        "http://localhost:8111/api/universities/shortlist",
        { universityId: university._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addShortlist(university); // Update UI instantly
    } catch (error) {
      console.error("Error shortlisting university:", error);
    }
  };

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/universities/${id}`
        );
        setUniversity(response.data);
        if (response.data.country) {
          fetchCountryData(response.data.country);
        }
      } catch (error) {
        setError("Error fetching university details.");
        console.error(error.message);
      }
    };

    const fetchSemesterData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/admin-module/semester-dates/${id}`
        );
        setSemesterData(response.data);
      } catch (error) {
        setSemesterData(null);
        console.error("Error fetching semester application data:", error);
      }
    };

    const handleShortlist = async (university) => {
      try {
        await axios.post(
          "http://localhost:8111/api/universities/shortlist",
          { universityId: university._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        addShortlist(university); // Update UI instantly
      } catch (error) {
        console.error("Error shortlisting university:", error);
      }
    };
    const fetchCountryData = async (countryName) => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/countries/name/${countryName}`
        );
        setCountryData(response.data);
      } catch (error) {
        setCountryData(null);
        console.error("Error fetching country data:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUniversity(), fetchSemesterData()]);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">Loading university details...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  // Extract university fields for display
  const fieldsToShowInitially = 10;
  const universityFields = [
    { label: "Location", value: university.location },
    { label: "Country", value: university.country },
    { label: "Ranking", value: university.ranking },
    { label: "Fees", value: `$${university.fees}` },
    { label: "Placement Rate", value: `${university.placement}%` },
    { label: "Is Ivy League", value: university.isIvy ? "Yes" : "No" },
    { label: "Total Enrollment", value: university.totalEnrollment },
    { label: "Undergraduates", value: university.undergraduates },
    { label: "Male Students", value: `${university.male}%` },
    { label: "Female Students", value: `${university.female}%` },
    {
      label: "SAT ERW (Min - Max)",
      value: `${university.satErwMin} - ${university.satErwMax}`,
    },
    {
      label: "SAT Math (Min - Max)",
      value: `${university.satMathMin} - ${university.satMathMax}`,
    },
    {
      label: "ACT (Min - Max)",
      value: `${university.actMin} - ${university.actMax}`,
    },
    { label: "Financial Aid", value: `${university.financialAid}%` },
    { label: "Pell Grant", value: `${university.pellGrant}%` },
    {
      label: "Expense Range",
      value: `$${university.expenseMin} - $${university.expenseMax}`,
    },
    { label: "Students with Loans", value: `${university.studentLoans}%` },
    { label: "Average Debt", value: `$${university.averageDebt}` },
    { label: "Applicants", value: university.applicants },
    { label: "Accepted", value: `${university.accepted}%` },
    { label: "Enrolled", value: `${university.enrolled}%` },
    { label: "Graduation in 6 Years", value: `${university.gradIn6Years}%` },
    { label: "Returning Freshmen", value: `${university.returningFreshmen}%` },
    { label: "Academics", value: `${university.academics}/5` },
    { label: "Social", value: `${university.social}/5` },
    { label: "Quality of Life", value: `${university.qualityOfLife}/5` },
    { label: "Admissions Phone", value: university.admissionsPhone },
    { label: "Email Address", value: university.emailAddress },
    {
      label: "Website",
      value: (
        <a
          href={
            university.website.startsWith("http")
              ? university.website
              : `https://${university.website}`
          }
          target="_blank"
          rel="noreferrer"
        >
          {university.website}
        </a>
      ),
    },
  ];

  const visibleFields = showAll
    ? universityFields
    : universityFields.slice(0, fieldsToShowInitially);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Go Back Button */}
        <button
          className="btn btn-secondary d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-pill"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left fs-5"></i>
          <span className="fw-bold">Go Back</span>
        </button>

        {/* Shortlist Button */}
        <button
          className={`btn d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-pill 
      ${
        shortlisted.some((item) => item._id === university._id)
          ? "btn-success"
          : "btn-outline-primary"
      }`}
          onClick={() => handleShortlist(university)}
        >
          <i
            className={`fs-5 
      ${
        shortlisted.some((item) => item._id === university._id)
          ? "bi bi-check-circle-fill"
          : "bi bi-plus-circle"
      }`}
          ></i>
          <span className="fw-bold">
            {shortlisted.some((item) => item._id === university._id)
              ? "Shortlisted"
              : "Add to Shortlist"}
          </span>
        </button>
      </div>

      {/* University Details Card */}
      <div className="card shadow-lg mb-4">
        <div className="card-header bg-primary text-white">
          <h1 className="card-title text-center">
            {university.universityName}
          </h1>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              {visibleFields
                .slice(0, Math.ceil(visibleFields.length / 2))
                .map((field, index) => (
                  <p key={index}>
                    <strong>{field.label}:</strong> {field.value}
                  </p>
                ))}
            </div>
            <div className="col-md-6">
              {visibleFields
                .slice(Math.ceil(visibleFields.length / 2))
                .map((field, index) => (
                  <p key={index}>
                    <strong>{field.label}:</strong> {field.value}
                  </p>
                ))}
            </div>
          </div>
          {universityFields.length > fieldsToShowInitially && (
            <div className="text-center">
              <button
                className="btn btn-link"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "View More"}
              </button>
            </div>
          )}
          <hr />
          <h5>Special Course:</h5>
          <p>{university.specialCourses.join(", ")}</p>
          <h5>Programs Offered:</h5>
          <p>
            {Object.keys(university.programs)
              .filter((program) => university.programs[program] === true)
              .join(", ")}
          </p>
        </div>
      </div>

      {/* Semester Application Dates Card */}
      <div className="card shadow-lg">
        <div className="card-header bg-secondary text-white">
          <h2 className="card-title text-center">Semester Application Dates</h2>
        </div>
        <div className="card-body">
          {semesterData ? (
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Fall Semester:</strong>{" "}
                  {new Date(semesterData.fallStartDate).toLocaleDateString()} -{" "}
                  {new Date(semesterData.fallEndDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Spring Semester:</strong>{" "}
                  {new Date(semesterData.springStartDate).toLocaleDateString()}{" "}
                  - {new Date(semesterData.springEndDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fall academic Date:</strong>{" "}
                  {semesterData.fallAcademicSemesterStart
                    ? `${new Date(
                        semesterData.fallAcademicSemesterStart
                      ).toLocaleDateString()} - ${new Date(
                        semesterData.fallAcademicSemesterEnd
                      ).toLocaleDateString()}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Spring academic Date:</strong>{" "}
                  {semesterData.springAcademicSemesterStart
                    ? `${new Date(
                        semesterData.springAcademicSemesterStart
                      ).toLocaleDateString()} - ${new Date(
                        semesterData.springAcademicSemesterEnd
                      ).toLocaleDateString()}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Spring Application Date:</strong>{" "}
                  {semesterData.springApplicationStartDate
                    ? `${new Date(
                        semesterData.springApplicationStartDate
                      ).toLocaleDateString()} - ${new Date(
                        semesterData.springApplicationEndDate
                      ).toLocaleDateString()}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Fall Application Date:</strong>{" "}
                  {semesterData.fallApplicationStartDate
                    ? `${new Date(
                        semesterData.fallApplicationStartDate
                      ).toLocaleDateString()} - ${new Date(
                        semesterData.fallApplicationEndDate
                      ).toLocaleDateString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Fall Orientation Week:</strong>{" "}
                  {semesterData.fallOrientationWeekStart
                    ? `${new Date(
                        semesterData.fallOrientationWeekStart
                      ).toLocaleDateString()} - ${new Date(
                        semesterData.fallOrientationWeekEnd
                      ).toLocaleDateString()}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Spring Orientation Week:</strong>{" "}
                  {semesterData.springOrientationWeekStart
                    ? `${new Date(
                        semesterData.springOrientationWeekStart
                      ).toLocaleDateString()} - ${new Date(
                        semesterData.springOrientationWeekEnd
                      ).toLocaleDateString()}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Visa Information:</strong>{" "}
                  {semesterData.visa || "N/A"}
                </p>
                <p>
                  <strong>Weather:</strong> {semesterData.weather || "N/A"}
                </p>
                <p>
                  <strong>Security:</strong> {semesterData.security || "N/A"}
                </p>
                <p>
                  <strong>Placement:</strong> {semesterData.placement || "N/A"}
                </p>
              </div>
              <p>
                <strong>Placement:</strong> {semesterData.placement || "N/A"}
              </p>
            </div>
          ) : (
            <p>No semester application data available for this university.</p>
          )}
        </div>
      </div>
      {/* Country Details Card */}
      {countryData && (
        <div className="card shadow-lg mb-4">
          <div className="card-header bg-success text-white">
            <h2 className="card-title text-center">
              Country Information: {countryData.country_name}
            </h2>
          </div>
          <div className="card-body">
            <p>
              <strong>Official Language:</strong>{" "}
              {countryData.official_language}
            </p>
            <p>
              <strong>Language of Instruction:</strong>{" "}
              {countryData.language_instruction}
            </p>
            <p>
              <strong>Work Opportunity:</strong> {countryData.work_opportunity}
            </p>
            <p>
              <strong>Visa Requirements:</strong>{" "}
              {countryData.visa_requirements}
            </p>
            <p>
              <strong>Healthcare:</strong> {countryData.healthcare}
            </p>
            <p>
              <strong>Cost of Living:</strong> ${countryData.cost_of_living}
            </p>
            <p>
              <strong>Climate:</strong> {countryData.climate}
            </p>
            <p>
              <strong>GDP:</strong> {countryData.gdp}
            </p>
            <p>
              <strong>Tax Policy:</strong> {countryData.tax_policy}
            </p>
            <p>
              <strong>Cultural Support:</strong> {countryData.cultural_support}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityDetail;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const UniversityDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [university, setUniversity] = useState(null);
//   const [semesterData, setSemesterData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch university details
//     const fetchUniversity = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8111/api/universities/${id}`
//         );
//         setUniversity(response.data);
//       } catch (error) {
//         setError("Error fetching university details.");
//         console.error(error.message);
//       }
//     };

//     // Fetch semester application data for the university
//     const fetchSemesterData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8111/api/admin-module/semester-dates/${id}`
//         );
//         setSemesterData(response.data);
//       } catch (error) {
//         setSemesterData(null);
//         console.error("Error fetching semester application data:", error);
//       }
//     };

//     // Fetch data concurrently
//     const fetchData = async () => {
//       setLoading(true);
//       await Promise.all([fetchUniversity(), fetchSemesterData()]);
//       setLoading(false);
//     };

//     fetchData();
//   }, [id]);

//   if (loading) {
//     return <div>Loading university details...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="university-detail">
//       <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
//         Go Back
//       </button>

//       <h1>{university.universityName}</h1>

//       <div className="university-info">
//         <p>
//           <strong>Location:</strong> {university.location}
//         </p>
//         <p>
//           <strong>Country:</strong> {university.country}
//         </p>
//         <p>
//           <strong>Ranking:</strong> {university.ranking}
//         </p>
//         <p>
//           <strong>Fees:</strong> ${university.fees}
//         </p>
//         <p>
//           <strong>Placement Rate:</strong> {university.placement}%
//         </p>
//         <p>
//           <strong>Is Ivy League:</strong> {university.isIvy ? "Yes" : "No"}
//         </p>
//         <p>
//           <strong>Total Enrollment:</strong> {university.totalEnrollment}
//         </p>
//         <p>
//           <strong>Undergraduates:</strong> {university.undergraduates}
//         </p>
//         <p>
//           <strong>Male Students:</strong> {university.male}%
//         </p>
//         <p>
//           <strong>Female Students:</strong> {university.female}%
//         </p>
//         <p>
//           <strong>SAT ERW (Min - Max):</strong> {university.satErwMin} -{" "}
//           {university.satErwMax}
//         </p>
//         <p>
//           <strong>SAT Math (Min - Max):</strong> {university.satMathMin} -{" "}
//           {university.satMathMax}
//         </p>
//         <p>
//           <strong>ACT (Min - Max):</strong> {university.actMin} -{" "}
//           {university.actMax}
//         </p>
//         <p>
//           <strong>Financial Aid:</strong> {university.financialAid}%
//         </p>
//         <p>
//           <strong>Pell Grant:</strong> {university.pellGrant}%
//         </p>
//         <p>
//           <strong>Expense Range:</strong> ${university.expenseMin} - $
//           {university.expenseMax}
//         </p>
//         <p>
//           <strong>Students with Loans:</strong> {university.studentLoans}%
//         </p>
//         <p>
//           <strong>Average Debt:</strong> ${university.averageDebt}
//         </p>
//         <p>
//           <strong>Applicants:</strong> {university.applicants}
//         </p>
//         <p>
//           <strong>Accepted:</strong> {university.accepted}%
//         </p>
//         <p>
//           <strong>Enrolled:</strong> {university.enrolled}%
//         </p>
//         <p>
//           <strong>Graduation in 6 Years:</strong> {university.gradIn6Years}%
//         </p>
//         <p>
//           <strong>Returning Freshmen:</strong> {university.returningFreshmen}%
//         </p>
//         <p>
//           <strong>Academics:</strong> {university.academics}/5
//         </p>
//         <p>
//           <strong>Social:</strong> {university.social}/5
//         </p>
//         <p>
//           <strong>Quality of Life:</strong> {university.qualityOfLife}/5
//         </p>
//         <p>
//           <strong>Admissions Phone:</strong> {university.admissionsPhone}
//         </p>
//         <p>
//           <strong>Email Address:</strong> {university.emailAddress}
//         </p>
//         <p>
//           <strong>Website:</strong>{" "}
//           <a href={university.website} target="_blank" rel="noreferrer">
//             {university.website}
//           </a>
//         </p>
//         <p>
//           <strong>Special Courses:</strong>{" "}
//           {university.specialCourses.join(", ")}
//         </p>
//         <p>
//           <strong>Programs:</strong>{" "}
//           {Object.keys(university.programs)
//             .filter((program) => university.programs[program] === true)
//             .join(", ")}
//         </p>
//       </div>

//       <h2 className="mt-4">Semester Application Dates</h2>

//       {semesterData ? (
//         <div className="semester-data">
//           <p>
//             <strong>Fall Semester:</strong>{" "}
//             {new Date(semesterData.fallStartDate).toLocaleDateString()} -{" "}
//             {new Date(semesterData.fallEndDate).toLocaleDateString()}
//           </p>
//           <p>
//             <strong>Spring Semester:</strong>{" "}
//             {new Date(semesterData.springStartDate).toLocaleDateString()} -{" "}
//             {new Date(semesterData.springEndDate).toLocaleDateString()}
//           </p>
//           <p>
//             <strong>Fall Orientation Week:</strong>{" "}
//             {semesterData.fallOrientationWeekStart
//               ? `${new Date(
//                   semesterData.fallOrientationWeekStart
//                 ).toLocaleDateString()} - ${new Date(
//                   semesterData.fallOrientationWeekEnd
//                 ).toLocaleDateString()}`
//               : "N/A"}
//           </p>
//           <p>
//             <strong>Spring Orientation Week:</strong>{" "}
//             {semesterData.springOrientationWeekStart
//               ? `${new Date(
//                   semesterData.springOrientationWeekStart
//                 ).toLocaleDateString()} - ${new Date(
//                   semesterData.springOrientationWeekEnd
//                 ).toLocaleDateString()}`
//               : "N/A"}
//           </p>
//           <p>
//             <strong>Visa Information:</strong> {semesterData.visa || "N/A"}
//           </p>
//           <p>
//             <strong>Weather:</strong> {semesterData.weather || "N/A"}
//           </p>
//           <p>
//             <strong>Security:</strong> {semesterData.security || "N/A"}
//           </p>
//           <p>
//             <strong>Placement:</strong> {semesterData.placement || "N/A"}
//           </p>
//         </div>
//       ) : (
//         <p>No semester application data available for this university.</p>
//       )}
//     </div>
//   );
// };

// export default UniversityDetail;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
// import axios from "axios";

// const UniversityDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [university, setUniversity] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUniversity = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `http://localhost:8111/api/universities/${id}`
//         );
//         setUniversity(response.data);
//       } catch (error) {
//         setError("Error fetching university details.");
//         console.error("Error fetching university details:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUniversity();
//   }, [id]);

//   if (loading) {
//     return <div>Loading university details...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="university-detail">
//       <button
//         className="btn btn-secondary mb-3"
//         onClick={() => navigate(-1)} // Use navigate(-1) to go back
//       >
//         Go Back
//       </button>

//       <h1>{university.universityName}</h1>

//       <div className="university-info">
//         <p>
//           <strong>Location:</strong> {university.location}
//         </p>
//         <p>
//           <strong>Country:</strong> {university.country}
//         </p>
//         <p>
//           <strong>Ranking:</strong> {university.ranking}
//         </p>
//         <p>
//           <strong>Fees:</strong> ${university.fees}
//         </p>
//         <p>
//           <strong>Placement Rate:</strong> {university.placement}%
//         </p>
//         <p>
//           <strong>Is Ivy League:</strong> {university.isIvy ? "Yes" : "No"}
//         </p>

//         <p>
//           <strong>Website:</strong>{" "}
//           <a href={university.website} target="_blank" rel="noreferrer">
//             {university.website}
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UniversityDetail;

// / import { useParams } from "react-router-dom";
// import axios from "axios";

// const UniversityDetail = () => {
//   const { id } = useParams();
//   const [university, setUniversity] = useState(null);

//   useEffect(() => {
//     const fetchUniversity = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8111/api/universities/${id}`
//         );
//         setUniversity(response.data);
//       } catch (error) {
//         console.error("Error fetching university details:", error.message);
//       }
//     };

//     fetchUniversity();
//   }, [id]);

//   if (!university) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="university-detail">
//       <h1>{university.universityName}</h1>
//       <p>
//         <strong>Location:</strong> {university.location}
//       </p>
//       <p>
//         <strong>Country:</strong> {university.country}
//       </p>
//       <p>
//         <strong>Website:</strong>{" "}
//         <a href={university.website} target="_blank" rel="noreferrer">
//           {university.website}
//         </a>
//       </p>
//       {/* Add more details as needed */}
//     </div>
//   );
// };

// export default UniversityDetail
