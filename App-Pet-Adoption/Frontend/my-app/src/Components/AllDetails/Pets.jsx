import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import AdminNavigationbar from "../Admin/AdminNavigationbar";
import PetModal from "../Modal/PetModal";
import UpdatePetModal from "./UpdatePetModal";
import apiClient from "../../services/apiClient";
import './styles.css';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [updatePet, setUpdatePet] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchPets = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get("/api/petdata")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPets(response.data);
        } else {
          setPets([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching pet data:", err);
        setError("Unable to fetch pet inventory. Please check database connection.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleShowDetails = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedPet(null);
    setShowModal(false);
    setUpdatePet(null);
    setShowUpdateModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet record permanently?")) return;
    try {
      await apiClient.delete(`/api/pets/delete/${id}`);
      setPets(prev => prev.filter(pet => pet._id !== id));
    } catch (error) {
      console.error('Error deleting Pet:', error);
      alert('Failed to delete pet. Please try again.');
    }
  };

  const handleOpenUpdate = (pet) => {
    setUpdatePet(pet);
    setShowUpdateModal(true);
  };

  const handlePetUpdated = (updatedPet) => {
    setPets(prev => prev.map(p => p._id === updatedPet._id ? { ...p, ...updatedPet } : p));
    handleClose();
    fetchPets();
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AdminNavigationbar />

      <Container className="my-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h2 className="fw-bold text-dark mb-1">Pet Inventory Management</h2>
            <p className="text-muted mb-0">View, update details, or delete shelter pet profiles</p>
          </div>
          <Button variant="success" className="rounded-pill px-4" href="/PetAddForm">
            Add New Pet
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5 my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading pet inventory...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center py-4">
            <h4>Database Connection Warning</h4>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={fetchPets}>Retry Connection</Button>
          </Alert>
        ) : pets.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm rounded-4">
            <Card.Body>
              <h4 className="fw-semibold">No Pet Inventory Found</h4>
              <p className="text-muted">No pet records exist in the database currently.</p>
              <Button variant="primary" href="/PetAddForm" className="rounded-pill px-4">
                Add First Pet
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {pets.map((pet) => (
              <Col key={pet._id} xs={12} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition">
                  <div className="position-relative" style={{ height: "220px" }}>
                    <Card.Img
                      src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"}
                      alt={pet.petName}
                      style={{ objectFit: "cover", height: "100%", width: "100%" }}
                    />
                    <Badge
                      bg={pet.status === 'adopted' ? 'danger' : 'success'}
                      className="position-absolute top-0 end-0 m-3 px-3 py-2 fs-6 rounded-pill"
                    >
                      {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                    </Badge>
                  </div>

                  <Card.Body className="d-flex flex-column justify-content-between p-4">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4 className="fw-bold mb-0 text-dark">{pet.petName || 'Unnamed'}</h4>
                        <Badge bg="secondary">{pet.species || 'Pet'}</Badge>
                      </div>

                      <p className="text-muted mb-2 small">
                        <strong>Breed:</strong> {pet.breed || 'N/A'} | <strong>Age:</strong> {pet.age || 'N/A'}
                      </p>

                      <p className="text-secondary small mb-3 text-truncate">
                        <strong>Traits:</strong> {pet.temperament || pet.specialCharacteristics || 'Loving companion'}
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top gap-1">
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="rounded-pill px-2"
                        onClick={() => handleShowDetails(pet)}
                      >
                        Details
                      </Button>

                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="rounded-pill px-3 text-dark fw-medium"
                        onClick={() => handleOpenUpdate(pet)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-2"
                        onClick={() => handleDelete(pet._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {selectedPet && (
        <PetModal show={showModal} onHide={handleClose} Pets={selectedPet} />
      )}
      {updatePet && (
        <UpdatePetModal
          show={showUpdateModal}
          onHide={handleClose}
          pet={updatePet}
          onUpdate={handlePetUpdated}
        />
      )}
    </div>
  );
};

export default Pets;
