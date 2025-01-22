import React, { createContext, useReducer, useContext } from "react";

// Safe function to parse JSON from localStorage
const getUserFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch (error) {
    console.error("Invalid user data in localStorage. Clearing storage...");
    localStorage.removeItem("user");
    return null;
  }
};

// Initial state
const initialState = {
  token: localStorage.getItem("token") || null,
  user: getUserFromLocalStorage(),
  isLoggedIn: !!localStorage.getItem("token"),
};

// Action types
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isLoggedIn: true,
      };
    case LOGOUT:
      return { ...state, token: null, user: null, isLoggedIn: false };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: LOGIN, payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: LOGOUT });
  };

  // Role-based access control
  const userRole = state.user?.role || "Guest";
  const isAdmin = userRole === "Admin" || userRole === "Super Admin";

  // Function to check if a user has a specific role
  const hasRole = (roles) => roles.includes(userRole);

  return (
    <AuthContext.Provider value={{ state, login, logout, isAdmin, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
