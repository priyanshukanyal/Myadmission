import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/userApi";
import { useAuth } from "../../components/generalComponents/authContext";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!userData.name || !userData.email || !userData.password) {
      return setError("Please fill in all fields.");
    }
    if (userData.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setLoading(true);
    try {
      const data = await registerUser(userData);

      if (!data?.token || !data?.role) {
        throw new Error("Invalid registration response from server.");
      }

      login(data.token, data);
      navigate(
        data.role === "Admin" || data.role === "Super Admin"
          ? "/admin-dashboard"
          : "/"
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <h3 className="text-center mb-3">Register</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleRegister}>
        {/* Name Input */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Email Input */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Password Input */}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={userData.password}
              onChange={handleChange}
              required
            />
            <Button
              variant="link"
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="ms-2"
            >
              {passwordVisible ? "Hide" : "Show"}
            </Button>
          </div>
        </Form.Group>

        {/* Submit Button */}
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
