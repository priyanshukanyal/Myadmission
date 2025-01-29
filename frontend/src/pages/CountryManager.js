import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:8111/api/countries"; // Adjust based on backend

const CountryManager = () => {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    country_name: "",
    official_language: "",
    language_instruction: "",
    work_opportunity: "",
    work_permit: "",
    visa_requirements: "",
    healthcare: "",
    cost_of_living: "",
    climate: "",
    gdp: "",
    tax_policy: "",
    cultural_support: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [costOfLivingError, setCostOfLivingError] = useState(""); // Error message state

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const res = await axios.get(API_URL);
      setCountries(res.data);
    } catch (error) {
      console.error("Error fetching countries", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cost_of_living") {
      if (value !== "" && Number(value) < 10) {
        setCostOfLivingError("Cost of Living cannot be less than $10");
      } else {
        setCostOfLivingError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Cost of Living is valid
    if (
      formData.cost_of_living !== "" &&
      Number(formData.cost_of_living) < 10
    ) {
      setCostOfLivingError("Cost of Living must be at least $10");
      toast.error("Please correct the errors before submitting.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        toast.success("Country updated successfully");
      } else {
        await axios.post(API_URL, formData);
        toast.success("Country created successfully");
      }
      setFormData({
        country_name: "",
        official_language: "",
        language_instruction: "",
        work_opportunity: "",
        work_permit: "",
        visa_requirements: "",
        healthcare: "",
        cost_of_living: "",
        climate: "",
        gdp: "",
        tax_policy: "",
        cultural_support: "",
      });
      setEditingId(null);
      fetchCountries();
    } catch (error) {
      toast.error("Error saving country");
      console.error(error);
    }
  };

  // Handle edit
  const handleEdit = (country) => {
    setFormData(country);
    setEditingId(country._id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Country deleted successfully");
      fetchCountries();
    } catch (error) {
      toast.error("Error deleting country");
      console.error(error);
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer />
      <h1 className="text-center fw-bold mb-4">🌍 Country Management</h1>

      {/* Country Form */}
      <div className="card shadow p-4">
        <h2 className="fw-semibold">
          {editingId ? "✏️ Edit Country" : "➕ Add Country"}
        </h2>
        <form onSubmit={handleSubmit} className="row g-3">
          {Object.keys(formData).map((key) => (
            <div className="col-md-6" key={key}>
              <label className="form-label">
                {key.replace(/_/g, " ").toUpperCase()}
              </label>

              {key === "cost_of_living" ? (
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name={key}
                    placeholder="Enter Cost of Living"
                    value={formData[key]}
                    onChange={handleChange}
                    className="form-control"
                    min="10"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  name={key}
                  placeholder={`Enter ${key.replace(/_/g, " ")}`}
                  value={formData[key]}
                  onChange={handleChange}
                  className="form-control"
                />
              )}

              {/* Show error message */}
              {key === "cost_of_living" && costOfLivingError && (
                <small className="text-danger">{costOfLivingError}</small>
              )}
            </div>
          ))}

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Update Country" : "Add Country"}
            </button>
          </div>
        </form>
      </div>

      {/* Country List */}
      <div className="card shadow mt-4 p-4">
        <h2 className="fw-semibold">📋 Countries List</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>Country Name</th>
                <th>Language</th>
                <th>Climate</th>
                <th>Cost of Living</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country._id}>
                  <td>{country.country_name}</td>
                  <td>{country.official_language.join(", ")}</td>
                  <td>{country.climate}</td>
                  <td>${country.cost_of_living}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(country)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(country._id)}
                    >
                      🗑️ Delete
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

export default CountryManager;
