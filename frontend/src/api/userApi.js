import axios from "axios";

// Base URL for API requests
const API_URL = "http://localhost:8111/api";

// 1. Login User
export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:8111/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// 2. Register User with a default role (if not provided)
export const registerUser = async (userData) => {
  // Add default role if not provided
  const userWithRole = { ...userData, role: userData.role || "Guest" };

  const response = await axios.post(`${API_URL}/users/register`, userWithRole, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// 3. Get User Profile
export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 4. Update User Profile
export const updateUserProfile = async (token, updatedData) => {
  const response = await axios.put(`${API_URL}/users/profile`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 5. Delete User
export const deleteUser = async (token) => {
  const response = await axios.delete(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
