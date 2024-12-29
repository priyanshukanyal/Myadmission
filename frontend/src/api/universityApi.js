import axios from "axios";

// Base URL for API requests
const API_URL = "http://localhost:8111/api";
useEffect(() => {
  const fetchAllUniversities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8111/api/universities"
      );
      console.log(response.data); // Inspect the data to see if the fields exist
      setUniversities(response.data);
    } catch (error) {
      console.error("Error fetching universities:", error.message);
    }
  };

  fetchAllUniversities();
}, []);
