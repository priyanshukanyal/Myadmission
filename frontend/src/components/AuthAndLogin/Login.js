import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/userApi";
import { useAuth } from "../../components/generalComponents/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError(""); // Clear errors
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      // Await the loginUser API and destructure the response correctly
      const data = await loginUser(email, password);
      console.log("Login Response Data:", data); // Debug response structure

      // Pass the correct token and user to AuthContext
      login(data.token, {
        name: data.name,
        email: data.email,
        role: data.role,
        _id: data._id,
      });

      // Navigate based on role
      const isAdmin = data.role === "Admin" || data.role === "Super Admin";
      navigate(isAdmin ? "/admin-module" : "/");
    } catch (err) {
      console.error("Login error:", err); // Debug error details
      setError(err.response?.data?.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div>
      <h3 className="text-center mb-3">Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <div className="d-flex">
            <Form.Control
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="link"
              type="button"
              onClick={togglePasswordVisibility}
              className="ms-2"
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
          {loading ? <Spinner animation="border" size="sm" /> : "Login"}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
