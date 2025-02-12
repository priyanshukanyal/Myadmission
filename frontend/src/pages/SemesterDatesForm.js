import React, { useState, useEffect, navigate } from "react";
import axios from "axios";
import UniversitySearch from "../components/UniversitySearch"; // Import your search component

const SemesterDatesForm = () => {
  const [formData, setFormData] = useState({
    fallApplicationStartDate: "",
    fallApplicationEndDate: "",
    springApplicationStartDate: "",
    springApplicationEndDate: "",
    fallStartDate: "",
    fallEndDate: "",
    springStartDate: "",
    springEndDate: "",
    fallOrientationWeekStart: "",
    fallOrientationWeekEnd: "",
    fallAcademicSemesterStart: "",
    fallAcademicSemesterEnd: "",
    springOrientationWeekStart: "",
    springOrientationWeekEnd: "",
    springAcademicSemesterStart: "",
    springAcademicSemesterEnd: "",
    aboutUniversity: "",
    visa: "",
    weather: "",
    security: "",
    placement: "",
  });

  const [universityId, setUniversityId] = useState(""); // Store university ID here
  const [universityName, setUniversityName] = useState(""); // Optionally store the university name
  const [semesterDates, setSemesterDates] = useState(null); // Store existing semester dates
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes

  // Fetch existing semester dates if available
  useEffect(() => {
    if (!universityId) return; // Skip fetch if no university is selected

    const fetchSemesterDates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8111/api/admin-module/semester-dates/${universityId}`
        );
        setSemesterDates(response.data);
        setFormData({
          fallStartDate: response.data.fallStartDate?.slice(0, 10) || "",
          fallApplicationStartDate:
            response.data.fallStartDate?.slice(0, 10) || "",
          fallEndDate: response.data.fallEndDate?.slice(0, 10) || "",
          fallApplicationEndDate: response.data.fallEndDate?.slice(0, 10) || "",
          springStartDate: response.data.springStartDate?.slice(0, 10) || "",
          springApplicationStartDate:
            response.data.springStartDate?.slice(0, 10) || "",
          springEndDate: response.data.springEndDate?.slice(0, 10) || "",
          springApplicationEndDate:
            response.data.springEndDate?.slice(0, 10) || "",
          fallOrientationWeekStart:
            response.data.fallOrientationWeekStart?.slice(0, 10) || "",
          fallOrientationWeekEnd:
            response.data.fallOrientationWeekEnd?.slice(0, 10) || "",
          fallAcademicSemesterStart:
            response.data.fallAcademicSemesterStart?.slice(0, 10) || "",
          fallAcademicSemesterEnd:
            response.data.fallAcademicSemesterEnd?.slice(0, 10) || "",
          springOrientationWeekStart:
            response.data.springOrientationWeekStart?.slice(0, 10) || "",
          springOrientationWeekEnd:
            response.data.springOrientationWeekEnd?.slice(0, 10) || "",
          springAcademicSemesterStart:
            response.data.springAcademicSemesterStart?.slice(0, 10) || "",
          springAcademicSemesterEnd:
            response.data.springAcademicSemesterEnd?.slice(0, 10) || "",
          aboutUniversity: response.data.aboutUniversity || "",
          visa: response.data.visa || "",
          weather: response.data.weather || "",
          security: response.data.security || "",
          placement: response.data.placement || "",
        });
        setIsEditing(false); // Show the view mode initially when data is available
      } catch (error) {
        setSemesterDates(null); // No existing data
        setFormData({
          fallApplicationStartDate: "",
          fallApplicationEndDate: "",
          springApplicationStartDate: "",
          springApplicationEndDate: "",
          fallStartDate: "",
          fallEndDate: "",
          springStartDate: "",
          springEndDate: "",
          fallOrientationWeekStart: "",
          fallOrientationWeekEnd: "",
          fallAcademicSemesterStart: "",
          fallAcademicSemesterEnd: "",
          springOrientationWeekStart: "",
          springOrientationWeekEnd: "",
          springAcademicSemesterStart: "",
          springAcademicSemesterEnd: "",
          aboutUniversity: "",
          visa: "",
          weather: "",
          security: "",
          placement: "",
        });
        setIsEditing(true); // Enable editing if no data exists
      }
    };

    fetchSemesterDates();
  }, [universityId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!universityId) {
      setMessage("Please select a university before submitting.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8111/api/admin-module/semester-dates",
        {
          universityId,
          ...formData,
        }
      );
      setMessage("Semester dates saved successfully!");
      setSemesterDates(formData); // Update semester dates locally
      setIsEditing(false); // Switch to view mode after saving
    } catch (error) {
      setMessage("Error saving semester dates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* University Search Component */}
      <UniversitySearch
        onSearch={(university) => {
          setUniversityId(university._id);
          setUniversityName(university.universityName);
          setMessage("");
        }}
      />

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "20px",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>
          {isEditing
            ? `Edit Semester Application Dates for ${universityName}`
            : `Enter Semester Application Dates for ${universityName}`}
        </h2>

        {/* Grouped Fields for Start & End Dates in Rows */}
        {[
          ["fallStartDate", "fallEndDate"],
          ["fallApplicationStartDate", "fallApplicationEndDate"],
          ["springStartDate", "springEndDate"],
          ["springApplicationStartDate", "springApplicationEndDate"],
          ["fallOrientationWeekStart", "fallOrientationWeekEnd"],
          ["fallAcademicSemesterStart", "fallAcademicSemesterEnd"],
          ["springOrientationWeekStart", "springOrientationWeekEnd"],
          ["springAcademicSemesterStart", "springAcademicSemesterEnd"],
        ].map(([startField, endField], index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "20px", marginBottom: "15px" }}
          >
            {/* Start Date */}
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "bold" }}>
                {startField
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="date"
                name={startField}
                value={formData[startField]}
                onChange={handleChange}
                required
                style={{
                  padding: "10px",
                  width: "100%",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* End Date */}
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: "bold" }}>
                {endField
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="date"
                name={endField}
                value={formData[endField]}
                onChange={handleChange}
                required
                style={{
                  padding: "10px",
                  width: "100%",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>
        ))}

        {/* Additional Fields */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            About University
          </label>
          <textarea
            name="aboutUniversity"
            value={formData.aboutUniversity}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Hostel Availablity in University and Cost
          </label>
          <input
            type="text"
            name="security"
            value={formData.security}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Weather in that city
          </label>
          <input
            type="text"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Placement previous year
          </label>
          <input
            type="text"
            name="placement"
            value={formData.placement}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>Visa</label>
          <input
            type="text"
            name="visa"
            value={formData.visa}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default SemesterDatesForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import UniversitySearch from "../components/UniversitySearch"; // Import your search component

// const SemesterDatesForm = () => {
//   const [formData, setFormData] = useState({
//     fallStartDate: "",
//     fallEndDate: "",
//     springStartDate: "",
//     springEndDate: "",
//   });

//   const [universityId, setUniversityId] = useState(""); // Store university ID here
//   const [universityName, setUniversityName] = useState(""); // Optionally store the university name
//   const [semesterDates, setSemesterDates] = useState(null); // Store existing semester dates
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes

//   // Fetch existing semester dates if available
//   useEffect(() => {
//     if (!universityId) return; // Skip fetch if no university is selected

//     const fetchSemesterDates = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8111/api/admin-module/semester-dates/${universityId}`
//         );
//         setSemesterDates(response.data);
//         setFormData({
//           fallStartDate: response.data.fallStartDate.slice(0, 10),
//           fallEndDate: response.data.fallEndDate.slice(0, 10),
//           springStartDate: response.data.springStartDate.slice(0, 10),
//           springEndDate: response.data.springEndDate.slice(0, 10),
//         });
//         setIsEditing(false); // Show the view mode initially when data is available
//       } catch (error) {
//         setSemesterDates(null); // No existing data
//         setFormData({
//           fallStartDate: "",
//           fallEndDate: "",
//           springStartDate: "",
//           springEndDate: "",
//         });
//         setIsEditing(true); // Enable editing if no data exists
//       }
//     };

//     fetchSemesterDates();
//   }, [universityId]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!universityId) {
//       setMessage("Please select a university before submitting.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         "http://localhost:8111/api/admin-module/semester-dates",
//         {
//           universityId,
//           ...formData,
//         }
//       );
//       setMessage("Semester dates saved successfully!");
//       setSemesterDates(formData); // Update semester dates locally
//       setIsEditing(false); // Switch to view mode after saving
//     } catch (error) {
//       setMessage("Error saving semester dates.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//       {/* University Search Component */}
//       <UniversitySearch
//         onSearch={(university) => {
//           setUniversityId(university._id); // Set the university ID
//           setUniversityName(university.universityName); // Optionally set the university name
//           setMessage(""); // Clear any error message if a valid university is selected
//         }}
//       />

//       <div style={{ marginTop: "20px" }}>
//         {/* Display selected university and their semester dates */}
//         {semesterDates && universityId && !isEditing && (
//           <div>
//             <h3>Current Semester Dates for {universityName}</h3>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 padding: "10px",
//                 border: "1px solid #ddd",
//                 marginBottom: "20px",
//               }}
//             >
//               <div>
//                 <strong>Fall Semester:</strong>
//                 <p>Start Date: {semesterDates.fallStartDate.slice(0, 10)}</p>
//                 <p>End Date: {semesterDates.fallEndDate.slice(0, 10)}</p>
//               </div>
//               <div>
//                 <strong>Spring Semester:</strong>
//                 <p>Start Date: {semesterDates.springStartDate.slice(0, 10)}</p>
//                 <p>End Date: {semesterDates.springEndDate.slice(0, 10)}</p>
//               </div>
//             </div>
//             <div>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 style={{
//                   padding: "10px 20px",
//                   fontSize: "16px",
//                   backgroundColor: "#007BFF",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Edit Semester Dates
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Form for inputting or updating semester dates */}
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           marginTop: "20px",
//           backgroundColor: "#f9f9f9",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h2>
//           {isEditing
//             ? `Edit Semester Application Dates for ${universityName}`
//             : `Enter Semester Application Dates for ${universityName}`}
//         </h2>

//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", fontWeight: "bold" }}>
//             Fall Semester Application Start Date:
//           </label>
//           <input
//             type="date"
//             name="fallStartDate"
//             value={formData.fallStartDate}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "10px",
//               width: "100%",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", fontWeight: "bold" }}>
//             Fall Semester Application End Date:
//           </label>
//           <input
//             type="date"
//             name="fallEndDate"
//             value={formData.fallEndDate}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "10px",
//               width: "100%",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", fontWeight: "bold" }}>
//             Spring Semester Application Start Date:
//           </label>
//           <input
//             type="date"
//             name="springStartDate"
//             value={formData.springStartDate}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "10px",
//               width: "100%",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", fontWeight: "bold" }}>
//             Spring Semester Application End Date:
//           </label>
//           <input
//             type="date"
//             name="springEndDate"
//             value={formData.springEndDate}
//             onChange={handleChange}
//             required
//             style={{
//               padding: "10px",
//               width: "100%",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>

//         {isEditing && (
//           <button
//             type="button"
//             onClick={() => setIsEditing(false)}
//             style={{
//               padding: "10px 20px",
//               marginLeft: "10px",
//               fontSize: "16px",
//               backgroundColor: "#DC3545",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>
//         )}

//         {message && (
//           <p
//             style={{
//               marginTop: "20px",
//               color: message.includes("Error") ? "red" : "green",
//             }}
//           >
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default SemesterDatesForm;
