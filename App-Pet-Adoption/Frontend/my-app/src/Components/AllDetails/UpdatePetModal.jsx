import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import apiClient from "../../services/apiClient";

const UpdatePetModal = ({ show, onHide, pet, onUpdate }) => {
  const [petData, setPetData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    if (pet) {
      setPetData({ ...pet });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', variant: '' });

    try {
      const response = await apiClient.put(
        `/api/pets/update/${petData._id}`,
        petData
      );
      if (response.data && response.data.success) {
        const updated = response.data.pet || petData;
        setAlert({ show: true, message: 'Pet profile updated successfully!', variant: 'success' });
        setTimeout(() => {
          onUpdate(updated);
          onHide();
        }, 800);
      } else {
        setAlert({ show: true, message: response.data.message || 'Failed to update pet details', variant: 'danger' });
      }
    } catch (error) {
      console.error("Error updating pet:", error);
      setAlert({ show: true, message: error.response?.data?.message || 'Error saving pet updates. Please try again.', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="rounded-4">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark fs-4">
          Edit Pet Profile - {petData.petName || 'Pet'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {alert.show && (
          <Alert variant={alert.variant} className="rounded-3 mb-3">
            {alert.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="formPetName">
                <Form.Label className="fw-semibold text-secondary small">Pet Name</Form.Label>
                <Form.Control
                  type="text"
                  name="petName"
                  value={petData.petName || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formSpecies">
                <Form.Label className="fw-semibold text-secondary small">Species</Form.Label>
                <Form.Select
                  name="species"
                  value={petData.species || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Small Pet">Small Pet</option>
                  <option value="Reptile">Reptile</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formBreed">
                <Form.Label className="fw-semibold text-secondary small">Breed</Form.Label>
                <Form.Control
                  type="text"
                  name="breed"
                  value={petData.breed || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formAge">
                <Form.Label className="fw-semibold text-secondary small">Age</Form.Label>
                <Form.Control
                  type="text"
                  name="age"
                  value={petData.age || ""}
                  onChange={handleChange}
                  placeholder="e.g. 2 years"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formGender">
                <Form.Label className="fw-semibold text-secondary small">Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={petData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formOrigin">
                <Form.Label className="fw-semibold text-secondary small">Origin</Form.Label>
                <Form.Control
                  type="text"
                  name="origin"
                  value={petData.origin || ""}
                  onChange={handleChange}
                  placeholder="e.g. Germany"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formSize">
                <Form.Label className="fw-semibold text-secondary small">Size</Form.Label>
                <Form.Control
                  type="text"
                  name="size"
                  value={petData.size || ""}
                  onChange={handleChange}
                  placeholder="e.g. Medium"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formWeight">
                <Form.Label className="fw-semibold text-secondary small">Weight</Form.Label>
                <Form.Control
                  type="text"
                  name="weight"
                  value={petData.weight || ""}
                  onChange={handleChange}
                  placeholder="e.g. 15 kg"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formCoat">
                <Form.Label className="fw-semibold text-secondary small">Color & Coat Type</Form.Label>
                <Form.Control
                  type="text"
                  name="coat"
                  value={petData.coat || ""}
                  onChange={handleChange}
                  placeholder="e.g. Short golden fur"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formLifeSpan">
                <Form.Label className="fw-semibold text-secondary small">Life Span</Form.Label>
                <Form.Control
                  type="text"
                  name="lifeSpan"
                  value={petData.lifeSpan || ""}
                  onChange={handleChange}
                  placeholder="e.g. 10 - 14 years"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formStatus">
                <Form.Label className="fw-semibold text-secondary small">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={petData.status || "available"}
                  onChange={handleChange}
                >
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formImage">
                <Form.Label className="fw-semibold text-secondary small">Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={petData.image || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="formTemperament">
                <Form.Label className="fw-semibold text-secondary small">Temperament</Form.Label>
                <Form.Control
                  type="text"
                  name="temperament"
                  value={petData.temperament || ""}
                  onChange={handleChange}
                  placeholder="e.g. Playful, friendly with kids"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="formSpecialCharacteristics">
                <Form.Label className="fw-semibold text-secondary small">Special Characteristics</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="specialCharacteristics"
                  value={petData.specialCharacteristics || ""}
                  onChange={handleChange}
                  placeholder="e.g. Microchipped, house trained, loves outdoor play"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="secondary" className="rounded-pill px-4" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="rounded-pill px-4 fw-medium" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdatePetModal;
