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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userData.name || !userData.email || !userData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ ...userData });

      if (data?.role) {
        login(data.token, data);
        if (data.role === "Admin" || data.role === "Super Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Registration failed: Missing user data or role.");
      }
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-center mb-3">Register</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
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

        <Form.Group className="mb-3">
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
              onClick={() => setPasswordVisible(!passwordVisible)}
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
          {loading ? <Spinner animation="border" size="sm" /> : "Register"}
        </Button>
      </Form>
    </div>
  );
};

export default Register;
