import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import AdminNavigationbar from '../Admin/AdminNavigationbar';
import './AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  const [stats, setStats] = useState({
    totalPets: 0,
    totalRequests: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [petsResponse, requestsResponse] = await Promise.all([
          apiClient.get('/api/pets/count'),
          apiClient.get('/api/adopts/count')
        ]);

        setStats({
          totalPets: petsResponse.data.count || 0,
          totalRequests: requestsResponse.data.count || 0,
          loading: false,
          error: null
        });
      } catch (err) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to connect to database backend'
        }));
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const username = adminData.email ? adminData.email.split('@')[0] : (adminData.username || 'Admin');

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AdminNavigationbar />

      <Container className="my-4 flex-grow-1">
        <div className="mb-4 pb-2 border-bottom">
          <h2 className="fw-bold text-dark mb-1">Welcome back, {username}!</h2>
          <p className="text-muted mb-0">Overview of shelter pet inventory and adoption applications</p>
        </div>

        {stats.loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading dashboard statistics...</p>
          </div>
        ) : stats.error ? (
          <Alert variant="danger" className="text-center py-4 rounded-4">
            <h4>{stats.error}</h4>
            <p>Make sure the backend server is running on port 8000 and connected to MongoDB.</p>
          </Alert>
        ) : (
          <>
            {/* Stats Cards */}
            <Row className="g-4 mb-5">
              <Col md={6} lg={6}>
                <Card
                  className="h-100 border-0 shadow-sm rounded-4 text-white cursor-pointer hover-shadow transition"
                  style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", cursor: "pointer" }}
                  onClick={() => navigate('/viewPetDetails')}
                >
                  <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-white-50 uppercase fw-semibold small">Registered Pets</span>
                      <h1 className="display-4 fw-bold mb-0">{stats.totalPets}</h1>
                      <span className="small text-white-50">Click to view pet inventory</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={6}>
                <Card
                  className="h-100 border-0 shadow-sm rounded-4 text-white cursor-pointer hover-shadow transition"
                  style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", cursor: "pointer" }}
                  onClick={() => navigate('/Petrequestlist')}
                >
                  <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-white-50 uppercase fw-semibold small">Adoption Applications</span>
                      <h1 className="display-4 fw-bold mb-0">{stats.totalRequests}</h1>
                      <span className="small text-white-50">Click to review requests</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <h4 className="fw-bold text-dark mb-3">Admin Quick Actions</h4>
            <Row className="g-3">
              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 h-100 p-3 text-center">
                  <Card.Body>
                    <h5 className="fw-bold">Add New Pet</h5>
                    <p className="text-muted small">List a new shelter animal for adoption</p>
                    <Button variant="primary" className="rounded-pill w-100" onClick={() => navigate('/PetAddForm')}>
                      Add Pet Form
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 h-100 p-3 text-center">
                  <Card.Body>
                    <h5 className="fw-bold">Manage Inventory</h5>
                    <p className="text-muted small">View, update, or delete registered pets</p>
                    <Button variant="outline-primary" className="rounded-pill w-100" onClick={() => navigate('/viewPetDetails')}>
                      View Pet Inventory
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 h-100 p-3 text-center">
                  <Card.Body>
                    <h5 className="fw-bold">Adoption Requests</h5>
                    <p className="text-muted small">Review pending adoption requests</p>
                    <Button variant="outline-dark" className="rounded-pill w-100" onClick={() => navigate('/Petrequestlist')}>
                      Review Applications
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminHome;