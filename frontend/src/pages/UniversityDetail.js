import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [semesterData, setSemesterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/universities/${id}`
        );
        setUniversity(response.data);
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
        <a href={university.website} target="_blank" rel="noreferrer">
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
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Go Back
      </button>

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
            </div>
          ) : (
            <p>No semester application data available for this university.</p>
          )}
        </div>
      </div>
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
