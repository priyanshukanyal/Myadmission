import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/userApi"; // Assuming the API functions are in 'api.js'

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!userData.name || !userData.email || !userData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true); // Show loading spinner while registering
    try {
      const data = await registerUser(userData);
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("user", JSON.stringify(data));
      setUserData({ name: "", email: "", password: "" });
      setError(""); // Clear previous errors
      navigate("/"); // Redirect to homepage
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false); // Hide loading spinner after request completion
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div>
      <h3 className="text-center mb-3">Register</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <div className="d-flex">
            <Form.Control
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              required
            />
            <Button
              variant="link"
              onClick={togglePasswordVisibility}
              className="ml-2"
              style={{ alignSelf: "center" }}
            >
              {passwordVisible ? "Hide" : "Show"}
            </Button>
          </div>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Register"}
        </Button>
      </Form>
    </div>
  );
};

export default Register;
