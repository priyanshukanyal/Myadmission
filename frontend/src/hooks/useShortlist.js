import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext.js";

const useShortlist = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const { state } = useAuth();
  const { token } = state;

  // Fetch shortlisted universities
  useEffect(() => {
    const fetchShortlisted = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:8111/api/universities/shortlisted",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Shortlisted API Response:", response.data); // Debugging

        if (Array.isArray(response.data)) {
          setShortlisted(response.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          setShortlisted([]);
        }
      } catch (error) {
        console.error("Error fetching shortlisted universities:", error);
        setShortlisted([]); // Fallback to empty array
      }
    };

    fetchShortlisted();
  }, [token]);

  // Add university to shortlist
  const addShortlist = useCallback(
    async (university) => {
      if (!token || !university?._id) return;

      try {
        const response = await axios.post(
          "http://localhost:8111/api/universities/shortlist",
          { universityId: university._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Added to shortlist:", response.data); // Debugging

        // Avoid duplicates before adding
        setShortlisted((prev) =>
          prev.some((item) => item._id === university._id)
            ? prev
            : [...prev, university]
        );
      } catch (error) {
        console.error("Error adding to shortlist:", error);
      }
    },
    [token]
  );

  return { shortlisted, addShortlist };
};

export default useShortlist;
