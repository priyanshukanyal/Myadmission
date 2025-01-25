import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [semesterData, setSemesterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch university details
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

    // Fetch semester application data for the university
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

    // Fetch data concurrently
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUniversity(), fetchSemesterData()]);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading university details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="university-detail">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Go Back
      </button>

      <h1>{university.universityName}</h1>

      <div className="university-info">
        <p>
          <strong>Location:</strong> {university.location}
        </p>
        <p>
          <strong>Country:</strong> {university.country}
        </p>
        <p>
          <strong>Ranking:</strong> {university.ranking}
        </p>
        <p>
          <strong>Fees:</strong> ${university.fees}
        </p>
        <p>
          <strong>Placement Rate:</strong> {university.placement}%
        </p>
        <p>
          <strong>Is Ivy League:</strong> {university.isIvy ? "Yes" : "No"}
        </p>
        <p>
          <strong>Website:</strong>{" "}
          <a href={university.website} target="_blank" rel="noreferrer">
            {university.website}
          </a>
        </p>
      </div>

      <h2 className="mt-4">Semester Application Dates</h2>

      {semesterData ? (
        <div className="semester-data">
          <p>
            <strong>Fall Semester:</strong>{" "}
            {new Date(semesterData.fallStartDate).toLocaleDateString()} -{" "}
            {new Date(semesterData.fallEndDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Spring Semester:</strong>{" "}
            {new Date(semesterData.springStartDate).toLocaleDateString()} -{" "}
            {new Date(semesterData.springEndDate).toLocaleDateString()}
          </p>
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
            <strong>Visa Information:</strong> {semesterData.visa || "N/A"}
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
      ) : (
        <p>No semester application data available for this university.</p>
      )}
    </div>
  );
};

export default UniversityDetail;

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
