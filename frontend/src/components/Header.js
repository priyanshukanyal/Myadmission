import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Image,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/generalComponents/authContext";
import { Bell } from "react-bootstrap-icons"; // Importing Bell icon
import logo from "../assets/logo.png"; // Ensure logo path is correct

const Header = () => {
  const { state, logout, isAdmin } = useAuth();
  const { token, user } = state;
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(0); // Notification count

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data.length); // Count unread notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <Navbar bg="white" expand="md" className="shadow-sm py-2" sticky="top">
      <Container>
        {/* Logo and Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center fw-bold text-primary"
        >
          <Image
            src={logo}
            alt="MyAdmission Logo"
            width={40}
            height={40}
            roundedCircle
            className="me-2"
          />
          <span>MyAdmission</span>
        </Navbar.Brand>

        {/* Navbar Toggle for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/universities" className="fw-semibold">
              Universities
            </Nav.Link>
            <Nav.Link as={Link} to="/shortlisted" className="fw-semibold">
              Shortlisted
            </Nav.Link>
            <Nav.Link as={Link} to="/applied" className="fw-semibold">
              Applied
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="fw-semibold">
              Contact Us
            </Nav.Link>
            {isAdmin && (
              <Nav.Link
                as={Link}
                to="/admin-module"
                className="fw-semibold text-danger"
              >
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          {/* Notification Bell Icon */}
          {token && (
            <Nav.Link
              as={Link}
              to="/notifications"
              className="position-relative me-3"
            >
              <Bell size={24} className="text-primary" />
              {notifications > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {notifications}
                </Badge>
              )}
            </Nav.Link>
          )}

          {/* Profile and Auth Section */}
          <Nav className="ms-auto">
            {token ? (
              <NavDropdown
                title={`Welcome, ${user?.name || "User"}`}
                id="user-dropdown"
                align="end"
                className="fw-semibold"
              >
                <NavDropdown.Item as={Link} to="/Profile">
                  Update Profile
                </NavDropdown.Item>
                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin-data">
                    Admin Data
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button
                as={Link}
                to="/onboarding"
                variant="primary"
                size="sm"
                className="fw-semibold"
              >
                Login / Register
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

// import React, { useEffect } from "react";
// import { Navbar, Nav, Container, Button } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../components/generalComponents/authContext";

// const Header = () => {
//   const { state, logout } = useAuth();
//   const { token, user } = state;
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//     window.location.reload();
//   };

//   return (
//     <Navbar bg="light" expand="md" className="shadow-sm">
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
//           MyAdmission
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/universities">
//               Universities
//             </Nav.Link>
//             <Nav.Link as={Link} to="/shortlisted">
//               Shortlisted
//             </Nav.Link>
//             <Nav.Link as={Link} to="/contact">
//               Contact Us
//             </Nav.Link>
//             <Nav.Link as={Link} to="/applied">
//               Applied
//             </Nav.Link>
//           </Nav>
//           <Nav className="ms-auto">
//             {token ? (
//               <>
//                 <Navbar.Text className="me-2">
//                   Signed in as: {user?.name || "Loading..."}
//                 </Navbar.Text>
//                 <Button
//                   variant="outline-danger"
//                   size="sm"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <Button as={Link} to="/onboarding" variant="primary" size="sm">
//                 Login / Register
//               </Button>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;

// import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Navbar, Nav, Container, Button } from "react-bootstrap";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useAuth } from "./generalComponents/authContext"; // Import the useAuth hook from context
// import { getUserProfile } from "../api/userApi"; // Make sure this import is correct

// const Header = () => {
//   const { state, setUser, logout } = useAuth(); // Access the auth context's state and functions
//   const { token, user } = state; // Destructure token and user from state
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (token && !user) {
//         // Only fetch the user if we have the token and no user set yet
//         try {
//           const userProfile = await getUserProfile(token); // Fetch user profile using the token
//           setUser(userProfile); // Set the user state with the fetched data
//           window.localStorage.setItem("user", JSON.stringify(userProfile)); // Optionally store in localStorage
//         } catch (error) {
//           console.error("Error fetching user profile:", error);
//         }
//       }
//     };

//     fetchUserProfile();
//   }, [token, location.pathname, user, setUser]); // Fetch the profile whenever the token or route changes

//   const handleLogout = () => {
//     logout(); // Use logout function from context to handle the logout process
//     navigate("/"); // Redirect to onboarding or homepage
//     window.location.reload();
//   };

//   return (
//     <Navbar bg="light" expand="md" className="shadow-sm">
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
//           MyAdmission
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/Universities">
//               Universities
//             </Nav.Link>
//             <Nav.Link as={Link} to="/shortlisted">
//               Shortlisted
//             </Nav.Link>
//             <Nav.Link as={Link} to="/contact">
//               Contact Us
//             </Nav.Link>
//             <Nav.Link as={Link} to="/applied">
//               Applied
//             </Nav.Link>
//           </Nav>
//           <Nav className="ms-auto">
//             {token ? (
//               <>
//                 <Navbar.Text className="me-2">
//                   Signed in as: {user?.name || "Loading..."}
//                 </Navbar.Text>
//                 <Button
//                   variant="outline-danger"
//                   size="sm"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <Button as={Link} to="/onboarding" variant="primary" size="sm">
//                 Login / Register
//               </Button>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;
