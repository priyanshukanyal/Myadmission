import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UniversityCRUD = () => {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState({
    universityName: "",
    location: "",
    ranking: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Retrieve the auth token
      const { data } = await axios.get(
        "http://localhost:8111/api/universities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUniversities(data);
    } catch (err) {
      setError("Error fetching universities. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    console.log("Auth Token:", token); // Debugging line

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(
          `http://localhost:8111/api/universities/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:8111/api/universities", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setEditingId(null);
      setForm({ universityName: "", location: "", ranking: "" });
      fetchUniversities();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Error saving university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (university) => {
    setForm({
      universityName: university.universityName,
      location: university.location,
      ranking: university.ranking,
    });
    setEditingId(university._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken"); // Retrieve the auth token
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8111/api/universities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUniversities();
    } catch (err) {
      setError("Error deleting university. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">University CRUD</h1>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="universityName"
              value={form.universityName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={form.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Ranking</label>
            <input
              type="number"
              className="form-control"
              name="ranking"
              value={form.ranking}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update" : "Add"} University
          </button>
        </form>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Ranking</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr key={university._id}>
              <td>{university.universityName}</td>
              <td>{university.location}</td>
              <td>{university.ranking}</td>
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
  );
};

export default UniversityCRUD;
