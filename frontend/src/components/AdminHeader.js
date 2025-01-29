import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./generalComponents/authContext";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.role === "Admin" || user?.role === "admin") {
      setIsAdmin(true);
      localStorage.setItem("adminLoggedIn", "true");
    } else {
      setIsAdmin(false);
      localStorage.removeItem("adminLoggedIn");
    }
  }, [user]);

  const handleLogout = () => {
    logout(); // Clear authentication state
    localStorage.removeItem("adminLoggedIn"); // Remove login flag
    navigate("/"); // Redirect to home page
  };

  const handleLoginRedirect = () => {
    navigate("/admin-module/login"); // Redirect to admin login page
  };

  const linkStyle = {
    marginRight: "15px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
  };

  const activeStyle = {
    textDecoration: "underline",
  };

  return (
    <header
      style={{
        background: "darkblue",
        color: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link
          to="/admin-module/University-CRUD"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h1>Admin Dashboard</h1>
        </Link>
        <nav>
          <NavLink
            to="/admin-module/semester-application-dates"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            View
          </NavLink>
          <NavLink
            to="/admin-module"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Add/Update
          </NavLink>
          <NavLink
            to="/admin-module/country-management"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Country Management
          </NavLink>
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {isAdmin ? (
          <>
            <span style={{ marginRight: "15px", fontWeight: "bold" }}>
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginRedirect}
            style={{
              background: "green",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
