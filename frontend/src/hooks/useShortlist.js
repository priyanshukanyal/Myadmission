import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext.js";

const useShortlist = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const { state } = useAuth();
  const { token } = state;

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8111/api/universities/shortlisted",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShortlisted(response.data);
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

  const addShortlist = async (university) => {
    try {
      const response = await axios.post(
        "http://localhost:8111/api/universities/shortlist",
        { universityId: university._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShortlisted((prev) => [...prev, university]);
    } catch (error) {
      console.error("Error adding to shortlist:", error.message);
    }
  };

  return { shortlisted, addShortlist };
};

export default useShortlist;
