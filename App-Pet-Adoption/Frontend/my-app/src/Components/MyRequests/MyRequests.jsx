import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Alert, Spinner, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigationbar from '../Navigationbar';
import Footer from '../Footer';
import apiClient from '../../services/apiClient';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const userEmail = user?.email || localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    apiClient
      .get(`/api/adopts/user/${userEmail}`)
      .then((res) => {
        if (res.data && res.data.adoptRequests) {
          setRequests(res.data.adoptRequests);
        } else {
          setRequests([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching adoption requests:', err);
        setError('Failed to load your adoption applications.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userEmail]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge bg="success" className="px-3 py-2 fs-6">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger" className="px-3 py-2 fs-6">Declined</Badge>;
      case 'pending':
      default:
        return <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">Pending Review</Badge>;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navigationbar />

      <Container className="my-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h2 className="fw-bold text-dark mb-1">My Adoption Requests</h2>
            <p className="text-muted mb-0">Track the live status of your pet adoption applications</p>
          </div>
          <Button variant="outline-primary" onClick={() => navigate('/catalog')}>
            Explore More Pets
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <p className="mt-3 text-muted">Loading your requests...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : requests.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm rounded-4">
            <Card.Body>
              <h4 className="fw-semibold text-dark">No Adoption Requests Yet</h4>
              <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
                You haven't submitted any adoption applications yet. Browse our shelter catalog to find your new companion!
              </p>
              <Button variant="primary" size="lg" className="mt-2 px-4 rounded-pill" onClick={() => navigate('/catalog')}>
                Browse Pet Catalog
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {requests.map((req) => (
              <Col key={req._id} xs={12} md={6} lg={6}>
                <Card className="h-100 border-0 shadow-sm rounded-4 hover-shadow transition">
                  <Card.Header className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                    <div className="fw-bold fs-5 text-primary">
                      {req.petsname || req.species || 'Pet Adoption Request'}
                    </div>
                    {getStatusBadge(req.status)}
                  </Card.Header>

                  <Card.Body className="px-4 py-3">
                    <Row className="g-2 fs-6">
                      <Col xs={6}>
                        <span className="text-muted d-block small">Applicant Name</span>
                        <strong>{req.fullName}</strong>
                      </Col>
                      <Col xs={6}>
                        <span className="text-muted d-block small">Contact Phone</span>
                        <strong>{req.phone}</strong>
                      </Col>
                      <Col xs={6} className="mt-3">
                        <span className="text-muted d-block small">Pet Species / Breed</span>
                        <span>{req.species || 'N/A'} {req.breed ? `(${req.breed})` : ''}</span>
                      </Col>
                      <Col xs={6} className="mt-3">
                        <span className="text-muted d-block small">Application Date</span>
                        <span>{new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </Col>
                    </Row>

                    {req.status === 'approved' && (
                      <Alert variant="success" className="mt-3 mb-0 rounded-3 small">
                        <strong>Congratulations!</strong> Your adoption application has been approved by the shelter admin. Expect a follow-up email or call soon for pickup details.
                      </Alert>
                    )}
                    {req.status === 'rejected' && (
                      <Alert variant="secondary" className="mt-3 mb-0 rounded-3 small">
                        Thank you for applying. Unfortunately, this request was not approved at this time.
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default MyRequests;
