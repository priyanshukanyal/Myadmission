import React from "react";
import { NavLink } from "react-router-dom";

const AdminHeader = () => {
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
    <header style={{ background: "darkblue", color: "white", padding: "10px" }}>
      <h1>Admin Dashboard</h1>
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
      </nav>
    </header>
  );
};

export default AdminHeader;
