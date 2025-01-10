import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UniversityDetail = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/universities/${id}`
        );
        setUniversity(response.data);
      } catch (error) {
        console.error("Error fetching university details:", error.message);
      }
    };

    fetchUniversity();
  }, [id]);

  if (!university) {
    return <p>Loading...</p>;
  }

  return (
    <div className="university-detail">
      <h1>{university.universityName}</h1>
      <p>
        <strong>Location:</strong> {university.location}
      </p>
      <p>
        <strong>Country:</strong> {university.country}
      </p>
      <p>
        <strong>Website:</strong>{" "}
        <a href={university.website} target="_blank" rel="noreferrer">
          {university.website}
        </a>
      </p>
      {/* Add more details as needed */}
    </div>
  );
};

export default UniversityDetail;
