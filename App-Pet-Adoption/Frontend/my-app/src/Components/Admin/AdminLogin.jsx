import React, { useState } from "react";
import { Form, Button, Container, Alert, Card, Nav } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, message: "", variant: "" });
    
    if (!adminEmail || !adminPassword) {
      setAlert({ show: true, message: "Email and password are required!", variant: "danger" });
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await apiClient.post("/api/admin/login", {
        email: adminEmail,
        password: adminPassword,
      });
      
      if (response.data.success) {
        localStorage.clear();
        if (response.data.token) {
          localStorage.setItem("adminToken", response.data.token);
        }
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        setAdminEmail("");
        setAdminPassword("");
        navigate("/Admindash", { replace: true });
      } else {
        setAlert({ show: true, message: "Invalid admin credentials!", variant: "danger" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      setAlert({ show: true, message: errorMessage, variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, message: "", variant: "" });

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setAlert({ show: true, message: "All fields are required!", variant: "danger" });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({ show: true, message: "Passwords do not match!", variant: "danger" });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setAlert({ show: true, message: "Password must be at least 8 characters long!", variant: "danger" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/api/admin/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setAlert({ show: true, message: "Registration successful. Please login.", variant: "success" });
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => { setActiveTab("login"); }, 1500);
      } else {
        setAlert({ show: true, message: response.data.message || "Registration failed!", variant: "danger" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setAlert({ show: true, message: errorMessage, variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUserLogin = () => {
    navigate('/');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: "400px" }} className="shadow">
        <Card.Header className="text-center bg-dark text-white">
          <h3>Admin Portal</h3>
          <Nav variant="tabs" className="justify-content-center" activeKey={activeTab}>
            <Nav.Item>
              <Nav.Link eventKey="login" onClick={() => { setActiveTab("login"); setAlert({ show: false, message: "", variant: "" }); }} className="text-green">
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="register" onClick={() => { setActiveTab("register"); setAlert({ show: false, message: "", variant: "" }); }} className="text-green">
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
              {alert.message}
            </Alert>
          )}
          {activeTab === "login" ? (
            <Form onSubmit={handleLoginSubmit} autoComplete="off">
              <Form.Group className="mb-3" controlId="formAdminLoginEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="admin-login-email"
                  placeholder="Enter admin email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAdminLoginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="admin-login-password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </Button>
                <Button variant="outline-secondary" onClick={handleBackToUserLogin}>
                  Back to User Login
                </Button>
              </div>
            </Form>
          ) : (
            <Form onSubmit={handleRegisterSubmit} autoComplete="off">
              <Form.Group className="mb-3" controlId="formAdminRegName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleRegChange}
                  required
                  autoComplete="new-name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAdminRegEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleRegChange}
                  required
                  autoComplete="new-email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAdminRegPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Create a password (min 8 characters)"
                  value={formData.password}
                  onChange={handleRegChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAdminRegConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleRegChange}
                  required
                  autoComplete="new-password"
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register as Admin"}
                </Button>
                <Button variant="outline-secondary" onClick={() => setActiveTab("login")}>
                  Already have an account? Login
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;