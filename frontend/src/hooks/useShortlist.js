import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext.js";

const API_BASE_URL = "http://localhost:8111/api/universities"; // Centralized API base URL

const useShortlist = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const { state } = useAuth();
  const { token, user } = state; // Ensure `user` contains `_id`

  // Fetch shortlisted universities for the logged-in user
  useEffect(() => {
    const fetchShortlisted = async () => {
      if (!token || !user?._id) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/shortlisted/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Shortlisted API Response:", response.data); // Debugging

        if (Array.isArray(response.data.shortlistedUniversities)) {
          setShortlisted(response.data.shortlistedUniversities);
        } else {
          console.warn("Unexpected response format:", response.data);
          setShortlisted([]);
        }
      } catch (error) {
        console.error(
          "Error fetching shortlisted universities:",
          error.response?.data || error.message
        );
        setShortlisted([]); // Fallback to empty array
      }
    };

    fetchShortlisted();
  }, [token, user?._id]);

  // Add university to shortlist
  const addShortlist = useCallback(
    async (university) => {
      if (!token || !user?._id || !university?._id) {
        console.error("Invalid university data before API call:", university);
        return;
      }

      try {
        console.log("Sending to API:", {
          userId: user._id,
          universityId: university._id,
        });

        const response = await axios.post(
          `${API_BASE_URL}/shortlist`,
          {
            userId: user._id,
            universityId: university._id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Added to shortlist:", response.data);

        if (response.data.shortlist) {
          setShortlisted(
            (prev) =>
              prev.some((item) => item.university._id === university._id)
                ? prev
                : [...prev, response.data.shortlist] // Store correct `university` object
          );
        }
      } catch (error) {
        console.error(
          "Error adding to shortlist:",
          error.response?.data || error.message
        );
      }
    },
    [token, user?._id]
  );

  // Remove university from shortlist
  // Remove university from shortlist
  const removeShortlist = useCallback(
    async (shortlistId) => {
      if (!token || !user?._id || !shortlistId) {
        console.error("Invalid shortlistId:", shortlistId);
        return;
      }

      try {
        // Make sure to use correct endpoint (with both userId and shortlistId)
        await axios.delete(
          `${API_BASE_URL}/shortlist/${user._id}/${shortlistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Successfully removed from shortlist:", shortlistId);

        // Update state to reflect the change
        setShortlisted((prev) =>
          prev.filter((item) => item._id !== shortlistId)
        );
      } catch (error) {
        console.error(
          "Error removing from shortlist:",
          error.response?.data || error.message
        );
      }
    },
    [token, user?._id]
  );

  return { shortlisted, addShortlist, removeShortlist };
};

export default useShortlist;
