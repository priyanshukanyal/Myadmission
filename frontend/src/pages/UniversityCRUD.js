import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const initialPrograms = {
  Accounting: false,
  AerospaceEngineering: false,
  Agriculture: false,
  AnimalScience: false,
  Anthropology: false,
  Architecture: false,
  AreaStudies: false,
  Art: false,
  ArtsAndEngineering: false,
  AsianStudies: false,
  Astronomy: false,
  AtmosphericSciences: false,
  Aviation: false,
  BiblicalStudies: false,
  BiblicalAndTheological: false,
  BiologyLifeSciences: false,
  BiomedicalEngineering: false,
  BusinessAdministration: false,
  BusinessAndEnterprise: false,
  CeramicEngineering: false,
  ChemicalEngineering: false,
  Chemistry: false,
  Commerce: false,
  CommunicationStudies: false,
  CommunicationAndMedia: false,
  CommunityAndJusticeStudies: false,
  ComputerScience: false,
  ComputerAndDigitalForensics: false,
  CreativeWriting: false,
  Dance: false,
  Drama: false,
  Economics: false,
  EconomicsAndManagement: false,
  Education: false,
  ElectricalEngineering: false,
  ElementaryEducation: false,
  Engineering: false,
  EnglishLiterature: false,
  EnglishAndCreativeWriting: false,
  Entrepreneurship: false,
  EnvironmentalStudies: false,
  EquestrianStudies: false,
  ExerciseAndHealthScience: false,
  FilmAndTelevisionProduction: false,
  FilmVideoAndPhotography: false,
  Finance: false,
  Geology: false,
  GeophysicalEngineering: false,
  GlobalBusinessLeadership: false,
  HealthScience: false,
  HistoricPreservation: false,
  History: false,
  HospitalityBusiness: false,
  HumanEcology: false,
  HumanRightsStudies: false,
  Humanities: false,
  Illustration: false,
  IndustrialEngineering: false,
  IntegrativePhysiology: false,
  InternationalBusiness: false,
  InternationalRelations: false,
  Journalism: false,
  Kinesiology: false,
  LatinAmericanStudies: false,
  Literature: false,
  Management: false,
  MarineBiology: false,
  MarineScience: false,
  Marketing: false,
  Mathematics: false,
  MechanicalEngineering: false,
  Medicine: false,
  Meteorology: false,
  MotionPictureArts: false,
  Music: false,
  NaturalSciences: false,
  Neuroscience: false,
  Nursing: false,
  PerformingArts: false,
  PetroleumEngineering: false,
  Philosophy: false,
  Physics: false,
  PlantBiology: false,
  PoliticalScience: false,
  ProfessionalFlightTechnology: false,
  Psychology: false,
  PublicHealthStudies: false,
  PublicPolicy: false,
  PublicPolicyLeadership: false,
  PublicPolicyAndManagement: false,
  Rhetoric: false,
  Sciences: false,
  SocialWelfareAndJustice: false,
  SocialWork: false,
  SociologyAndAnthropology: false,
  SpeechLanguageAndHearingSciences: false,
  StudioArt: false,
  TheGreatBooksProgram: false,
  Theater: false,
  VeterinaryMedicine: false,
  VisualArt: false,
  VisualAndPerformingArts: false,
  WomenStudies: false,
  WorkshopPhysics: false,
  WorldLanguages: false,
  Writing: false,
};

const initialFormState = {
  universityName: "",
  website: "",
  location: "",
  country: "",
  totalEnrollment: "",
  undergraduates: "",
  male: "",
  female: "",
  satErwMin: "",
  satErwMax: "",
  satMathMin: "",
  satMathMax: "",
  actMin: "",
  actMax: "",
  financialAid: "",
  pellGrant: "",
  expenseMin: "",
  expenseMax: "",
  studentLoans: "",
  averageDebt: "",
  applicants: "",
  accepted: "",
  enrolled: "",
  gradIn6Years: "",
  returningFreshmen: "",
  academics: "",
  social: "",
  qualityOfLife: "",
  admissionsPhone: "",
  emailAddress: "",
  isIvy: "",
  placement: "",
  ranking: "",
  fees: "",
  programs: { ...initialPrograms }, // Ensure programs are initialized
};

const UniversityCRUD = () => {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        "http://localhost:8111/api/universities",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUniversities(data);
    } catch (err) {
      setError("Error fetching universities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm({
      ...form,
      programs: { ...form.programs, [name]: checked },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      setLoading(true);
      const payload = {
        ...form,
        programs: Object.fromEntries(
          Object.entries(form.programs).map(([key, value]) => [key, !!value])
        ),
      };

      if (editingId) {
        await axios.put(
          `http://localhost:8111/api/universities/${editingId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:8111/api/universities", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setEditingId(null);
      setForm(initialFormState);
      fetchUniversities();
    } catch (err) {
      setError("Error saving university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (university) => {
    setForm({
      ...university,
      programs: university.programs
        ? { ...initialPrograms, ...university.programs }
        : { ...initialPrograms },
    });

    setEditingId(university._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8111/api/universities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUniversities();
    } catch (err) {
      setError("Error deleting university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">University Management</h1>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* University Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">
          {editingId ? "Edit University" : "Add New University"}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {Object.keys(form).map((field) =>
              field === "programs" ? (
                <div className="mb-3 col-12" key={field}>
                  <label className="form-label fw-bold">Programs</label>
                  <div className="d-flex flex-wrap border rounded p-3">
                    {Object.keys(initialPrograms).map((program) => (
                      <div key={program} className="form-check me-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={program}
                          name={program}
                          checked={!!form.programs?.[program]}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor={program}>
                          {program}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-3 col-md-4" key={field}>
                  <label className="form-label fw-bold">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type={typeof form[field] === "number" ? "number" : "text"}
                    className="form-control"
                    name={field}
                    value={form[field]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {editingId ? "Update" : "Add"} University
          </button>
        </form>
      </div>

      {/* University Table */}
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">University List</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                {Object.keys(form).map((field) => (
                  <th key={field}>{field.replace(/([A-Z])/g, " $1").trim()}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((university) => (
                <tr key={university._id}>
                  {Object.keys(form).map((field) => (
                    <td key={field}>
                      {field === "programs"
                        ? Object.entries(university.programs || {})
                            .filter(([_, value]) => value)
                            .map(([key]) => key)
                            .join(", ")
                        : university[field]}
                    </td>
                  ))}
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(university)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(university._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UniversityCRUD;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const UniversityCRUD = () => {
//   const [universities, setUniversities] = useState([]);
//   const [form, setForm] = useState({
//     universityName: "",
//     location: "",
//     ranking: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const fetchUniversities = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken"); // Retrieve the auth token
//       const { data } = await axios.get(
//         "http://localhost:8111/api/universities",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setUniversities(data);
//     } catch (err) {
//       setError("Error fetching universities. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("authToken");
//     console.log("Auth Token:", token); // Debugging line

//     try {
//       setLoading(true);
//       if (editingId) {
//         await axios.put(
//           `http://localhost:8111/api/universities/${editingId}`,
//           form,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } else {
//         await axios.post("http://localhost:8111/api/universities", form, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
//       setEditingId(null);
//       setForm({ universityName: "", location: "", ranking: "" });
//       fetchUniversities();
//     } catch (err) {
//       console.error("Error:", err.response?.data || err.message);
//       setError("Error saving university. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (university) => {
//     setForm({
//       universityName: university.universityName,
//       location: university.location,
//       ranking: university.ranking,
//     });
//     setEditingId(university._id);
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("authToken"); // Retrieve the auth token
//     try {
//       setLoading(true);
//       await axios.delete(`http://localhost:8111/api/universities/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchUniversities();
//     } catch (err) {
//       setError("Error deleting university. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h1 className="text-center mb-4">University CRUD</h1>

//       {loading && <div className="alert alert-info">Loading...</div>}
//       {error && <div className="alert alert-danger">{error}</div>}

//       <div className="card p-4 mb-4">
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Name</label>
//             <input
//               type="text"
//               className="form-control"
//               name="universityName"
//               value={form.universityName}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Location</label>
//             <input
//               type="text"
//               className="form-control"
//               name="location"
//               value={form.location}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Ranking</label>
//             <input
//               type="number"
//               className="form-control"
//               name="ranking"
//               value={form.ranking}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">
//             {editingId ? "Update" : "Add"} University
//           </button>
//         </form>
//       </div>

//       <table className="table table-bordered">
//         <thead className="table-light">
//           <tr>
//             <th>Name</th>
//             <th>Location</th>
//             <th>Ranking</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {universities.map((university) => (
//             <tr key={university._id}>
//               <td>{university.universityName}</td>
//               <td>{university.location}</td>
//               <td>{university.ranking}</td>
//               <td>
//                 <button
//                   className="btn btn-warning btn-sm me-2"
//                   onClick={() => handleEdit(university)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-danger btn-sm"
//                   onClick={() => handleDelete(university._id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UniversityCRUD;
