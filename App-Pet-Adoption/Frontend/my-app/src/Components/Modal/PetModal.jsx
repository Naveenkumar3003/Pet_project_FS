import React from "react";
import { Modal, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PetModal = ({ show, onHide, Pets, pet }) => {
  const navigate = useNavigate();
  const petData = Pets || pet;

  if (!petData) return null;

  const handleAdoptFromModal = () => {
    onHide();
    navigate('/adopt', { state: { pet: petData } });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="rounded-4">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark fs-3 d-flex align-items-center gap-2">
          <span>{petData.petName || "Pet Profile"}</span>
          <Badge bg={petData.status === 'adopted' ? 'danger' : 'success'} className="fs-6 fw-normal rounded-pill">
            {petData.status === 'adopted' ? 'Adopted' : 'Available for Adoption'}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-4 align-items-center">
          <Col md={5}>
            <img
              src={petData.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"}
              alt={petData.petName}
              className="img-fluid rounded-4 shadow-sm w-100"
              style={{ maxHeight: "280px", objectFit: "cover" }}
            />
          </Col>

          <Col md={7}>
            <div className="bg-light p-3 rounded-3 mb-3">
              <Row className="g-2 fs-6">
                <Col xs={6}>
                  <span className="text-muted d-block small">Species</span>
                  <strong>{petData.species || "N/A"}</strong>
                </Col>
                <Col xs={6}>
                  <span className="text-muted d-block small">Breed</span>
                  <strong>{petData.breed || "N/A"}</strong>
                </Col>
                <Col xs={6} className="mt-2">
                  <span className="text-muted d-block small">Age</span>
                  <strong>{petData.age || "Unknown"}</strong>
                </Col>
                <Col xs={6} className="mt-2">
                  <span className="text-muted d-block small">Gender</span>
                  <strong>{petData.gender || "Unknown"}</strong>
                </Col>
                <Col xs={6} className="mt-2">
                  <span className="text-muted d-block small">Size</span>
                  <strong>{petData.size || "Medium"}</strong>
                </Col>
                <Col xs={6} className="mt-2">
                  <span className="text-muted d-block small">Weight</span>
                  <strong>{petData.weight || "N/A"}</strong>
                </Col>
              </Row>
            </div>

            <div className="fs-6">
              <p className="mb-2">
                <strong className="text-dark">Origin:</strong>{" "}
                <span className="text-secondary">{petData.origin || "N/A"}</span>
              </p>
              <p className="mb-2">
                <strong className="text-dark">Temperament:</strong>{" "}
                <span className="text-secondary">{petData.temperament || "Friendly and gentle"}</span>
              </p>
              <p className="mb-2">
                <strong className="text-dark">Coat & Color:</strong>{" "}
                <span className="text-secondary">{petData.coat || "N/A"}</span>
              </p>
              <p className="mb-2">
                <strong className="text-dark">Life Span:</strong>{" "}
                <span className="text-secondary">{petData.lifeSpan || "10-15 years"}</span>
              </p>
              <p className="mb-0">
                <strong className="text-dark">Special Characteristics:</strong>{" "}
                <span className="text-secondary">{petData.specialCharacteristics || "Loving companion seeking a home."}</span>
              </p>
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 px-4 pb-4">
        <Button variant="secondary" className="rounded-pill px-4" onClick={onHide}>
          Close
        </Button>
        {(!petData.status || petData.status === 'available') && (
          <Button variant="primary" className="rounded-pill px-4" onClick={handleAdoptFromModal}>
            Adopt {petData.petName || 'Pet'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PetModal;
