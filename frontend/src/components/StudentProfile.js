// components/StudentProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/generalComponents/authContext";

const StudentProfile = () => {
  const { userId } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    fatherName: "",
    motherName: "",
    additionalDetails: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8111/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8111/api/profile",
        profile,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    }
  };

  if (!userId) return null;

  return (
    <div className="profile-section">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={profile.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profile.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={profile.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          value={profile.fatherName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="motherName"
          placeholder="Mother's Name"
          value={profile.motherName}
          onChange={handleChange}
          required
        />
        <textarea
          name="additionalDetails"
          placeholder="Additional Details"
          value={profile.additionalDetails}
          onChange={handleChange}
        />
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
      <style jsx>{`
        .profile-section {
          margin: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        h2 {
          margin-bottom: 15px;
        }

        input,
        textarea {
          display: block;
          width: 100%;
          margin-bottom: 10px;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
