import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigationbar from '../Navigationbar';
import PetModal from '../Modal/PetModal';
import apiClient from '../../services/apiClient';
import './PetCatalog.css';

const CATEGORIES = [
  { id: 'All', label: 'All Pets' },
  { id: 'Dog', label: 'Dogs' },
  { id: 'Cat', label: 'Cats' },
  { id: 'Bird', label: 'Birds' },
  { id: 'Rabbit', label: 'Rabbits' },
  { id: 'Small Pet', label: 'Small Pets' },
  { id: 'Reptile', label: 'Reptiles' }
];

const PetCatalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const handleShowDetails = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
    setShowModal(false);
  };

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/pets/search', {
        params: {
          q: searchQuery,
          category: selectedCategory
        }
      });
      if (response.data && response.data.data) {
        const availablePets = response.data.data.filter(
          pet => !pet.status || pet.status === 'available'
        );
        setPets(availablePets);
      } else {
        setPets([]);
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Unable to load pets. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const handleAdopt = (pet) => {
    navigate('/adopt', { state: { pet } });
  };

  return (
    <div className="catalog-wrapper">
      <Navigationbar />
      
      {/* Hero Header Section */}
      <section className="catalog-hero">
        <Container fluid="lg">
          <Row className="align-items-center justify-content-center text-center">
            <Col md={10} lg={8}>
              <span className="badge-pill-header">Find Your Perfect Companion</span>
              <h1 className="hero-title">Adopt a Loving Pet Today</h1>
              <p className="hero-subtitle">
                Explore hundreds of rescued dogs, cats, birds, and exotic animals eager for a forever home.
              </p>
              
              {/* Search Bar */}
              <div className="search-bar-box">
                <InputGroup className="search-input-group">
                  <InputGroup.Text className="search-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, breed, species, or temperament..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <Button 
                      variant="link" 
                      className="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Category Pills Filtering Bar */}
      <section className="category-bar-section">
        <Container fluid="lg">
          <div className="category-pills-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Pet Catalog Grid */}
      <section className="catalog-grid-section">
        <Container fluid="lg">
          {loading ? (
            <Row className="g-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                  <div className="skeleton-card">
                    <div className="skeleton-img skeleton-loader"></div>
                    <div className="skeleton-body">
                      <div className="skeleton-title skeleton-loader"></div>
                      <div className="skeleton-text skeleton-loader"></div>
                      <div className="skeleton-btn skeleton-loader"></div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : error ? (
            <div className="status-box text-center">
              <p className="text-danger fs-5">{error}</p>
              <Button variant="outline-primary" onClick={fetchPets}>Retry</Button>
            </div>
          ) : pets.length === 0 ? (
            <div className="no-pets-found text-center py-5">
              <h3>No pets found matching your filter</h3>
              <p className="text-muted">Try searching for a different keyword or category.</p>
              <Button 
                variant="primary" 
                className="btn-custom-primary mt-2"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <Row className="g-4">
              {pets.map((pet) => (
                <Col key={pet._id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 pet-card-modern glass-card">
                    <div className="card-img-wrapper">
                      <Card.Img
                        variant="top"
                        src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"}
                        alt={pet.petName}
                        className="pet-img"
                      />
                      <Badge bg="dark" className="species-badge">
                        {pet.species || 'Pet'}
                      </Badge>
                      {pet.gender && (
                        <Badge bg={pet.gender === 'Male' ? 'info' : 'danger'} className="gender-badge">
                          {pet.gender}
                        </Badge>
                      )}
                    </div>

                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <Card.Title className="pet-name mb-0">{pet.petName || 'Unnamed'}</Card.Title>
                          <span className="pet-age-pill">{pet.age || 'Young'}</span>
                        </div>
                        <p className="pet-breed-text">{pet.breed || 'Mixed Breed'}</p>

                        {pet.temperament && (
                          <p className="pet-temperament-text">
                            <strong>Characteristics:</strong> {pet.temperament}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          className="w-50 rounded-pill fs-7"
                          onClick={() => handleShowDetails(pet)}
                        >
                          Details
                        </Button>
                        <Button
                          className="btn-adopt-now w-50"
                          onClick={() => handleAdopt(pet)}
                        >
                          Adopt {pet.petName || 'Pet'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {selectedPet && (
            <PetModal show={showModal} onHide={handleCloseModal} pet={selectedPet} />
          )}
        </Container>
      </section>
    </div>
  );
};

export default PetCatalog;
