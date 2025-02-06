import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Convert exp to milliseconds
    } catch (error) {
      return true; // Treat any decoding error as expired token
    }
  };

  // Auto logout if token is expired
  useEffect(() => {
    if (state.token) {
      if (isTokenExpired(state.token)) {
        logout();
      } else {
        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    }
  }, [state.token, state.user]);

  const login = (token, user) => {
    console.log("Setting token & user in context:", { token, user }); // Debugging
    setState({ token, user });
  };

  // Logout function
  const logout = () => {
    setState({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Axios instance with Authorization header
  const axiosAuth = axios.create({
    baseURL: "http://localhost:5000/api", // Change this to your API base URL
  });

  axiosAuth.interceptors.request.use(
    (config) => {
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return (
    <AuthContext.Provider value={{ state, login, logout, axiosAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook to access auth state
export const useAuth = () => useContext(AuthContext);
