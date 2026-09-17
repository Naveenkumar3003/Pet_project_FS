import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import apiClient from "../../services/apiClient";
import Navigationbar from "../Navigationbar";
import "./AdoptForm.css";
import { useNavigate, useLocation } from "react-router-dom";

function AdoptForm() {
  const location = useLocation();
  const pet = location.state?.pet || {};

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const loggedInEmail = user?.email || localStorage.getItem('userEmail') || '';

  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    age: "",
    gender: "",
    address: "",
    occupation: "",
    phone: "",
    email: loggedInEmail,
    homeType: "",
    adultsInFamily: "",
    childrenInFamily: "",
    petsInHome: "",
    petsname: pet.petName || "",
    species: pet.species || "",
    breed: pet.breed || "",
    agePreference: "",
    sizePreference: "",
    genderPreference: "",
    timeAvailability: "",
    veterinaryCare: false,
    indoorOutdoor: "",
    petSupervision: "",
    petId: pet._id || "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [id]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, message: "", variant: "" });

    try {
      await apiClient.post("/api/adopts", formData);
      setAlert({ show: true, message: "Adoption request submitted successfully! Redirecting to your requests tracker...", variant: "success" });
      setTimeout(() => navigate('/my-requests'), 1500);
    } catch (error) {
      setAlert({ show: true, message: "Failed to submit request. Please try again.", variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigationbar />
      <Form className="form-container" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="form-title">Pet Adoption Application</h2>
        <p className="form-subtitle">Complete this form to request adoption. All submissions are reviewed by our team.</p>

        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <h3 className="section-label">Pet Information</h3>
        <Form.Group className="mb-3" controlId="petsname">
          <Form.Label>Pet Name</Form.Label>
          <Form.Control
            type="text"
            className="input"
            placeholder="Enter Pet Name"
            autoComplete="off"
            value={formData.petsname}
            onChange={handleChange}
          />
        </Form.Group>

        <h3 className="section-label">Adopter Information</h3>
        <Form.Group className="mb-3" controlId="fullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            className="input"
            placeholder="Enter Full Name"
            autoComplete="off"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            className="input"
            placeholder="Enter Age"
            autoComplete="off"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="gender">
          <Form.Label>Gender</Form.Label>
          <Form.Select
            className="input"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            className="input"
            placeholder="Enter Address"
            autoComplete="off"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="occupation">
          <Form.Label>Occupation</Form.Label>
          <Form.Control
            type="text"
            className="input"
            placeholder="Enter Occupation"
            autoComplete="off"
            value={formData.occupation}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            className="input"
            placeholder="Enter Phone Number"
            autoComplete="off"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            className="input"
            placeholder="Enter Email Address"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button className="btn-custom-primary w-100" type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </Form>
    </>
  );
}

export default AdoptForm;
