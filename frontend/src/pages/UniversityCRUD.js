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
              ) : field === "country" ? (
                <div className="mb-3 col-md-4" key={field}>
                  <label className="form-label fw-bold">Country</label>
                  <select
                    className="form-control"
                    name={field}
                    value={form[field]}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a country</option>
                    {[
                      "United States",
                      "Canada",
                      "United Kingdom",
                      "Australia",
                      "Germany",
                      "New Zealand",
                      "Ireland",
                      "United Arab Emirates",
                      "Singapore",
                      "France",
                    ].map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              ) : field === "isIvy" ? (
                <div className="mb-3 col-md-4" key={field}>
                  <label className="form-label fw-bold">Is Ivy League?</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={field}
                        value="Yes"
                        checked={form[field] === "Yes"}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={field}
                        value="No"
                        checked={form[field] === "No"}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">No</label>
                    </div>
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
                    onChange={(e) => {
                      const value = e.target.value;
                      const numberFields = [
                        "satErwMax",
                        "satErwMin",
                        "satMathMax",
                        "satMathMin",
                        "actMax",
                        "actMin",
                        "academics",
                        "social",
                        "qualityOfLife",
                        "placement",
                        "male",
                        "female",
                        "financialAid",
                        "pellGrant",
                        "studentLoans",
                        "accepted",
                        "enrolled",
                        "gradIn6Years",
                        "returningFreshmen",
                      ];
                      if (numberFields.includes(field)) {
                        if (field === "satErwMax" && value > 800) return;
                        if (field === "satErwMin" && value > 800) return;
                        if (field === "satMathMax" && value > 800) return;
                        if (field === "satMathMin" && value > 800) return;
                        if (field === "actMax" && value > 36) return;
                        if (field === "actMin" && value > 36) return;
                        if (
                          [
                            "placement",
                            "male",
                            "female",
                            "financialAid",
                            "pellGrant",
                            "studentLoans",
                            "accepted",
                            "enrolled",
                            "gradIn6Years",
                            "returningFreshmen",
                          ].includes(field) &&
                          value > 100
                        )
                          return;
                        if (
                          ["academics", "social", "qualityOfLife"].includes(
                            field
                          ) &&
                          value > 5
                        )
                          return;
                      }
                      handleInputChange(e);
                    }}
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
