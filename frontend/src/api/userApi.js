import axios from "axios";

// Base URL for API requests
const API_URL = "http://localhost:8111/api";

// 1. Login User
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/users/login`, {
    email,
    password,
  });
  return response.data;
};

// 2. Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
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
