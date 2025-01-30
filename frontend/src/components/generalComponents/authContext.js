import React, { createContext, useState, useEffect, useContext } from "react";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  }, [state.token, state.user]);

  const login = (token, user) => {
    setState({ token, user });
  };

  const logout = () => {
    setState({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook to access auth state
export const useAuth = () => useContext(AuthContext);
