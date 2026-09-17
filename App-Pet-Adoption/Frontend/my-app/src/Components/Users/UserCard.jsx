import React, { useState } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import "./UserCard.css";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

const UserCard = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSignupChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, message: "", variant: "" });

    if (!formData.username || !formData.email || !formData.password) {
      setAlert({ show: true, message: "All fields are required!", variant: "danger" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/api/users", formData);

      if (response.data.success) {
        setAlert({ show: true, message: "Registered successfully. Please log in.", variant: "success" });
        setFormData({ username: "", email: "", password: "" });
        setIsSignup(false);
      } else {
        setAlert({ show: true, message: response.data.error || "Registration failed!", variant: "danger" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      setAlert({ show: true, message: errorMessage, variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, message: "", variant: "" });

    if (!userEmail || !userPassword) {
      setAlert({ show: true, message: "Email and password are required!", variant: "danger" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/api/users/login", {
        email: userEmail,
        password: userPassword,
      });

      if (response.data.success) {
        localStorage.clear();
        if (response.data.token) {
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("token", response.data.token);
        }
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.user?.email) {
          localStorage.setItem("userEmail", response.data.user.email);
        }
        setUserEmail("");
        setUserPassword("");
        navigate("/home", { replace: true });
      } else {
        setAlert({ show: true, message: "Invalid email or password!", variant: "danger" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      setAlert({ show: true, message: errorMessage, variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="auth-container">
      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
          className="mt-3 mx-auto alert-custom"
        >
          {alert.message}
        </Alert>
      )}

      <Container className="d-flex justify-content-center align-items-center">
        <Card className="auth-card">
          <Card.Body>
            {isSignup ? (
              <>
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join our community today</p>
                <Form onSubmit={handleSignupSubmit} autoComplete="off">
                  <Form.Group className="mb-3" controlId="formSignUpName">
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={handleSignupChange}
                      placeholder="Your username"
                      name="username"
                      required
                      className="auth-input"
                      autoComplete="new-username"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formSignUpEmail">
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={handleSignupChange}
                      placeholder="Your email"
                      name="email"
                      required
                      className="auth-input"
                      autoComplete="new-email"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formSignUpPassword">
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={handleSignupChange}
                      placeholder="Your password"
                      name="password"
                      required
                      className="auth-input"
                      autoComplete="new-password"
                    />
                  </Form.Group>
                  <Button
                    className="auth-button w-100"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </Form>
                <p className="auth-switch-text">
                  Already have an account?{" "}
                  <span className="auth-switch-link" onClick={() => { setIsSignup(false); setAlert({ show: false, message: "", variant: "" }); }}>
                    Log in
                  </span>
                </p>
              </>
            ) : (
              <>
                <h2 className="auth-title">Welcome back</h2>
                <h3 className="auth-subtitle">Login to your account</h3>
                <p className="auth-welcome-text">Ready to find your next pet companion?</p>
                <Form onSubmit={handleLoginSubmit} autoComplete="off">
                  <Form.Group className="mb-3" controlId="formLoginEmail">
                    <Form.Control
                      type="email"
                      name="login-email-field"
                      placeholder="Your email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="auth-input"
                      autoComplete="off"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formLoginPassword">
                    <Form.Control
                      type="password"
                      name="login-password-field"
                      placeholder="Your password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                      className="auth-input"
                      autoComplete="off"
                    />
                  </Form.Group>
                  <Button
                    className="auth-button w-100 mb-3"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </Form>
                <p className="auth-switch-text">
                  Don't have an account?{" "}
                  <span className="auth-switch-link" onClick={() => { setIsSignup(true); setAlert({ show: false, message: "", variant: "" }); }}>
                    Sign up
                  </span>
                </p>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      <div className="admin-section">
        <p className="admin-question">Are you an admin?</p>
        <Button
          className="admin-button"
          variant="outline-primary"
          onClick={handleAdminClick}
        >
          Admin Login
        </Button>
      </div>
    </div>
  );
};

export default UserCard;