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
    color: "#fff",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  };

  const activeStyle = {
    textDecoration: "underline",
    color: "#f5a623", // Active color
  };

  // Show dropdown options when hovering over Semester Dates button
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header
      style={{
        background: "#2c3e50", // Dark blue-gray
        color: "#ecf0f1", // Light gray text
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #34495e", // Subtle border
      }}
    >
      <div>
        <Link
          to="/admin-module"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontSize: "1.8rem",
            fontWeight: "700",
          }}
        >
          <h1>Admin Dashboard</h1>
        </Link>
        <nav style={{ display: "flex", alignItems: "center" }}>
          {/* Hoverable Semester Dates Dropdown */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
            onMouseEnter={() => setShowDropdown(true)} // Show options on hover
            onMouseLeave={() => setShowDropdown(false)} // Hide options when mouse leaves
          >
            <NavLink
              to="#"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...activeStyle } : linkStyle
              }
            >
              Semester Dates
            </NavLink>

            {/* Dropdown options */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  left: "0",
                  backgroundColor: "#34495e", // Darker background for dropdown
                  borderRadius: "5px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  zIndex: "100",
                  minWidth: "120px",
                }}
                onMouseEnter={() => setShowDropdown(true)} // Keep open when hovering over dropdown
                onMouseLeave={() => setShowDropdown(false)} // Close when mouse leaves the dropdown
              >
                <NavLink
                  to="/admin-module/view/semester-application-dates"
                  style={({ isActive }) =>
                    isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                  }
                >
                  View
                </NavLink>
                <NavLink
                  to="/admin-module/update/semester-application-dates"
                  style={({ isActive }) =>
                    isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                  }
                >
                  Update
                </NavLink>
              </div>
            )}
          </div>

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
            <span
              style={{
                marginRight: "20px",
                fontWeight: "600",
                fontSize: "1rem",
                color: "#f39c12", // Light golden color
              }}
            >
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#e74c3c", // Red color
                color: "#fff",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")} // Darker red on hover
              onMouseOut={(e) => (e.target.style.backgroundColor = "#e74c3c")} // Reset to original color
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginRedirect}
            style={{
              background: "#27ae60", // Green color
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2ecc71")} // Lighter green on hover
            onMouseOut={(e) => (e.target.style.backgroundColor = "#27ae60")} // Reset to original color
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;

// import React, { useEffect, useState } from "react";
// import { NavLink, useNavigate, Link } from "react-router-dom";
// import { useAuth } from "./generalComponents/authContext";

// const AdminHeader = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     if (user?.role === "Admin" || user?.role === "admin") {
//       setIsAdmin(true);
//       localStorage.setItem("adminLoggedIn", "true");
//     } else {
//       setIsAdmin(false);
//       localStorage.removeItem("adminLoggedIn");
//     }
//   }, [user]);

//   const handleLogout = () => {
//     logout(); // Clear authentication state
//     localStorage.removeItem("adminLoggedIn"); // Remove login flag
//     navigate("/"); // Redirect to home page
//   };

//   const handleLoginRedirect = () => {
//     navigate("/admin-module/login"); // Redirect to admin login page
//   };

//   const linkStyle = {
//     marginRight: "15px",
//     textDecoration: "none",
//     color: "white",
//     fontWeight: "bold",
//   };

//   const activeStyle = {
//     textDecoration: "underline",
//   };

//   return (
//     <header
//       style={{
//         background: "darkblue",
//         color: "white",
//         padding: "10px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}
//     >
//       <div>
//         <Link
//           to="/admin-module"
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <h1>Admin Dashboard</h1>
//         </Link>
//         <nav>
//           <NavLink
//             to="/admin-module/view/semester-application-dates"
//             style={({ isActive }) =>
//               isActive ? { ...linkStyle, ...activeStyle } : linkStyle
//             }
//           >
//             View
//           </NavLink>
//           <NavLink
//             to="/admin-module/update/semester-application-dates"
//             style={({ isActive }) =>
//               isActive ? { ...linkStyle, ...activeStyle } : linkStyle
//             }
//           >
//             Semester Dates
//           </NavLink>
//           <NavLink
//             to="/admin-module/country-management"
//             style={({ isActive }) =>
//               isActive ? { ...linkStyle, ...activeStyle } : linkStyle
//             }
//           >
//             Country Management
//           </NavLink>
//         </nav>
//       </div>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         {isAdmin ? (
//           <>
//             <span style={{ marginRight: "15px", fontWeight: "bold" }}>
//               Welcome, {user?.name}
//             </span>
//             <button
//               onClick={handleLogout}
//               style={{
//                 background: "red",
//                 color: "white",
//                 border: "none",
//                 padding: "5px 10px",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//               }}
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={handleLoginRedirect}
//             style={{
//               background: "green",
//               color: "white",
//               border: "none",
//               padding: "5px 10px",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </header>
//   );
// };

// export default AdminHeader;
