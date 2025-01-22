import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8111/api/universities/${id}`
        );
        setUniversity(response.data);
      } catch (error) {
        setError("Error fetching university details.");
        console.error("Error fetching university details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id]);

  if (loading) {
    return <div>Loading university details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="university-detail">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)} // Use navigate(-1) to go back
      >
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
    </div>
  );
};

export default UniversityDetail;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
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

// export default UniversityDetail;
