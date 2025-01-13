import React, { useState } from "react";
import axios from "axios";

const UniversityComparison = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [universityList, setUniversityList] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [setLoading] = useState(false);

  // Fetch university names based on search query
  const fetchUniversities = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8111/api/universities/names?search=${query}`
      );
      setUniversityList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching universities:", error);
      setLoading(false);
    }
  };

  // Handle search query change and debounce API call
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== "") {
      setTimeout(() => fetchUniversities(e.target.value), 300);
    } else {
      setUniversityList([]);
    }
  };

  // Handle university selection
  const handleUniversitySelect = (university) => {
    if (selectedUniversities.length >= 4) {
      alert("You can only compare up to 4 universities.");
      return;
    }

    if (!selectedUniversities.some((uni) => uni._id === university._id)) {
      setSelectedUniversities([...selectedUniversities, university]);
    }
    setSearchQuery("");
    setUniversityList([]);
  };

  // Remove a university from the comparison
  const handleRemoveUniversity = (universityId) => {
    setSelectedUniversities((prev) =>
      prev.filter((uni) => uni._id !== universityId)
    );
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Compare Universities</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a university..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />

      {/* Dropdown List */}
      {universityList.length > 0 && (
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          {universityList.map((university) => (
            <div
              key={university._id}
              onClick={() => handleUniversitySelect(university)}
              style={{
                cursor: "pointer",
                padding: "5px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              {university.universityName}
            </div>
          ))}
        </div>
      )}

      {/* Selected Universities */}
      <div style={{ marginTop: "20px" }}>
        <h3>Selected Universities</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {selectedUniversities.map((uni) => (
            <div
              key={uni._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <span>{uni.universityName}</span>
              <button
                onClick={() => handleRemoveUniversity(uni._id)}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#f00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedUniversities.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Category</th>
              {selectedUniversities.map((uni) => (
                <th key={uni._id}>{uni.universityName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Location</td>
              {selectedUniversities.map((uni) => (
                <td key={uni._id}>{uni.location}</td>
              ))}
            </tr>
            <tr>
              <td>Expense</td>
              {selectedUniversities.map((uni) => (
                <td key={uni._id}>{uni.expenseMax}</td>
              ))}
            </tr>
            <tr>
              <td>Popular Courses</td>
              {selectedUniversities.map((uni) => (
                <td key={uni._id}>
                  {Array.isArray(uni.specialCourses)
                    ? uni.specialCourses.join(", ")
                    : "N/A"}
                </td>
              ))}
            </tr>

            <tr>
              <td>Acceptance Rate</td>
              {selectedUniversities.map((uni) => (
                <td key={uni._id}>{uni.accepted}%</td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UniversityComparison;

// import React, { useState, useEffect } from "react";

// const UniversityComparison = () => {
//   const [universities, setUniversities] = useState([]); // All universities from backend
//   const [selectedUniversities, setSelectedUniversities] = useState([]); // Universities selected for comparison
//   const [compareData, setCompareData] = useState([]); // Data of selected universities

//   // Fetch universities from backend
//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const response = await fetch("http://localhost:8111/api/universities"); // Replace with your API endpoint
//         const data = await response.json();
//         setUniversities(data); // Assuming API returns an array of universities
//       } catch (error) {
//         console.error("Error fetching universities:", error);
//       }
//     };
//     fetchUniversities();
//   }, []);

//   // Handle university selection
//   const handleUniversitySelect = async (event) => {
//     const universityId = event.target.value;

//     // Avoid duplicates
//     if (selectedUniversities.includes(universityId)) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8111/api/universities/${universityId}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setCompareData((prevData) => [...prevData, data]);
//         setSelectedUniversities((prevIds) => [...prevIds, universityId]);
//       } else {
//         console.error(
//           "Failed to fetch university details. Status:",
//           response.status
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching university details:", error);
//     }
//   };

//   // Remove a university from comparison
//   const handleRemoveUniversity = (universityId) => {
//     setSelectedUniversities((prevIds) =>
//       prevIds.filter((id) => id !== universityId)
//     );
//     setCompareData((prevData) =>
//       prevData.filter((uni) => uni._id !== universityId)
//     );
//   };

//   return (
//     <div className="comparison-container">
//       <h1>University Comparison</h1>

//       {/* Dropdown for selecting universities */}
//       <div className="university-selector">
//         <select onChange={handleUniversitySelect} value="">
//           <option value="" disabled>
//             Select a university to compare
//           </option>
//           {universities.map((uni) => (
//             <option key={uni._id} value={uni._id}>
//               {uni.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Display selected universities */}
//       <div className="selected-universities">
//         {compareData.map((uni) => (
//           <div key={uni._id} className="selected-university">
//             <span>{uni.name}</span>
//             <button onClick={() => handleRemoveUniversity(uni._id)}>
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Comparison Table */}
//       {compareData.length > 0 && (
//         <table className="comparison-table">
//           <thead>
//             <tr>
//               <th>Category</th>
//               {compareData.map((uni) => (
//                 <th key={uni._id}>{uni.universityName}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>Location</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.location}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>Expense</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.expenseMax}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>Scholarships</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.returningFreshmen}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>Popular Courses</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.specialCourses}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>Social Rating</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.social}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>academic Rating</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.academics}</td>
//               ))}
//             </tr>
//             <tr>
//               <td> Quality Of Life Rating</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.qualityOfLife}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>SAT Eng</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.satErwMin}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>SAT Math</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.satMathMin}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>ACT</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.actMin}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>Pell Grant</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.pellGrant}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>Financial</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.financialAid}</td>
//               ))}
//             </tr>
//             <tr>
//               <td>Acceptance</td>
//               {compareData.map((uni) => (
//                 <td key={uni._id}>{uni.accepted}</td>
//               ))}
//             </tr>
//           </tbody>
//         </table>
//       )}

//       <style jsx>{`
//         .comparison-container {
//           max-width: 800px;
//           margin: 0 auto;
//           padding: 20px;
//           font-family: Arial, sans-serif;
//         }

//         h1 {
//           text-align: center;
//           margin-bottom: 20px;
//         }

//         .university-selector {
//           margin-bottom: 20px;
//           text-align: center;
//         }

//         .selected-universities {
//           display: flex;
//           justify-content: center;
//           gap: 10px;
//           margin-bottom: 20px;
//         }

//         .selected-university {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//         }

//         .comparison-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 20px;
//         }

//         th,
//         td {
//           border: 1px solid #ddd;
//           padding: 8px;
//           text-align: center;
//         }

//         th {
//           background-color: #f4f4f4;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UniversityComparison;
