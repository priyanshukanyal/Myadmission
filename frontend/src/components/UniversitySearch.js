import React, { useState, useEffect } from "react";
import axios from "axios";

const UniversitySearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universityList, setUniversityList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUniversityNames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8111/api/universities/names?search=${searchQuery}`
      );

      console.log("API Response:", response.data); // Log raw data

      const validatedData = response.data.filter(
        (item) => item && typeof item.universityName === "string"
      );

      console.log("Validated Data:", validatedData); // Log cleaned-up data

      setUniversityList(validatedData);
    } catch (error) {
      console.error("Error fetching university names:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery && !selectedUniversity) fetchUniversityNames();
      else setUniversityList([]);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, selectedUniversity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(selectedUniversity || { universityName: searchQuery, _id: null });
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Search for Universities</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a university name..."
          value={searchQuery}
          onChange={(e) => {
            setSelectedUniversity(null);
            setSearchQuery(e.target.value);
          }}
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", marginLeft: "5px" }}
        >
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      <div>
        {universityList
          .filter((item) => {
            console.log("Filtering Item:", item); // Debugging: Check each item
            return item && typeof item.universityName === "string"
              ? item.universityName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              : false;
          })
          .map((university) => (
            <div
              key={university._id || Math.random()} // Ensure unique keys
              style={{ cursor: "pointer", marginBottom: "5px" }}
              onClick={() => {
                setSelectedUniversity(university);
                setSearchQuery(university.universityName);
                setUniversityList([]);
              }}
            >
              {university.universityName}
            </div>
          ))}
      </div>
    </div>
  );
};

export default UniversitySearch;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UniversitySearch = ({ onSearch }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUniversity, setSelectedUniversity] = useState(null);
//   const [universityList, setUniversityList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch university names based on search query
//   const fetchUniversityNames = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:8111/api/universities/names?search=${searchQuery}`
//       );
//       setUniversityList(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching university names:", error);
//       setLoading(false);
//     }
//   };

//   // Update results when search query changes
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       if (searchQuery && !selectedUniversity) fetchUniversityNames();
//       else setUniversityList([]); // Clear results when search is empty or a university is selected
//     }, 300);

//     return () => clearTimeout(debounce); // Cleanup debounce
//   }, [searchQuery, selectedUniversity]);

//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent page reload
//     // Send the selected university object (with ID) back to the parent component
//     onSearch(selectedUniversity || { universityName: searchQuery, _id: null });
//   };

//   return (
//     <div style={{ margin: "20px" }}>
//       <h2>Search for Universities</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Type a university name..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSelectedUniversity(null); // Clear selected university if user types again
//             setSearchQuery(e.target.value);
//           }}
//           style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
//         />
//         <button
//           type="submit"
//           style={{ padding: "10px 20px", marginLeft: "5px" }}
//         >
//           Search
//         </button>
//       </form>
//       {loading && <p>Loading...</p>}
//       <div>
//         {universityList.map((university) => (
//           <div
//             key={university._id}
//             style={{ cursor: "pointer", marginBottom: "5px" }}
//             onClick={() => {
//               setSelectedUniversity(university); // Store the full university object
//               setSearchQuery(university.universityName); // Fill input with selected name
//               setUniversityList([]); // Clear dropdown suggestions
//             }}
//           >
//             {university.universityName}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UniversitySearch;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UniversitySearch = ({ onSearch }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUniversity, setSelectedUniversity] = useState(null);
//   const [universityList, setUniversityList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch university names based on search query
//   const fetchUniversityNames = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:8111/api/universities/names?search=${searchQuery}`
//       );
//       setUniversityList(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching university names:", error);
//       setLoading(false);
//     }
//   };

//   // Update results when search query changes
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       if (searchQuery && !selectedUniversity) fetchUniversityNames();
//       else setUniversityList([]); // Clear results when search is empty or a university is selected
//     }, 300);

//     return () => clearTimeout(debounce); // Cleanup debounce
//   }, [searchQuery, selectedUniversity]);

//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent page reload
//     console.log("Submitted University:", selectedUniversity || searchQuery);
//     onSearch(selectedUniversity || searchQuery); // Trigger the callback with the selected or typed value
//   };

//   return (
//     <div style={{ margin: "20px" }}>
//       <h2>Search for Universities</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Type a university name..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSelectedUniversity(null); // Clear selected university if user types again
//             setSearchQuery(e.target.value);
//           }}
//           style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
//         />
//         <button
//           type="submit"
//           style={{ padding: "10px 20px", marginLeft: "5px" }}
//         >
//           Search
//         </button>
//       </form>
//       {loading && <p>Loading...</p>}
//       <div>
//         {universityList.map((university) => (
//           <div
//             key={university._id}
//             style={{ cursor: "pointer", marginBottom: "5px" }}
//             onClick={() => {
//               setSelectedUniversity(university.universityName);
//               setSearchQuery(university.universityName); // Fill input with selected name
//               setUniversityList([]); // Clear dropdown suggestions
//             }}
//           >
//             {university.universityName}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UniversitySearch;
