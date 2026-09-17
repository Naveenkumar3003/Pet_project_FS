import React from "react";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import './NavigationBar1style.css';

const Navigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem('userToken') || localStorage.getItem('token') || localStorage.getItem('user');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <Navbar expand="lg" className="modern-navbar sticky-top bg-white shadow-sm py-2">
      <Container fluid="lg">
        <Navbar.Brand 
          onClick={() => navigate('/home')} 
          className="brand-logo d-flex align-items-center cursor-pointer fs-4 fw-bold text-primary"
          style={{ cursor: 'pointer' }}
        >
          <span className="brand-text text-dark">PetPals <span className="text-primary">Connect</span></span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto nav-links-group align-items-center gap-1">
            <Nav.Link 
              onClick={() => navigate('/home')} 
              className={`nav-item-link px-3 ${location.pathname === '/home' ? 'fw-bold text-primary active' : 'text-secondary'}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              onClick={() => navigate('/catalog')} 
              className={`nav-item-link px-3 ${location.pathname === '/catalog' ? 'fw-bold text-primary active' : 'text-secondary'}`}
            >
              Browse Pets
            </Nav.Link>
            <Nav.Link 
              onClick={() => navigate('/catalog?category=Dog')} 
              className="nav-item-link px-3 text-secondary"
            >
              Dogs
            </Nav.Link>
            <Nav.Link 
              onClick={() => navigate('/catalog?category=Cat')} 
              className="nav-item-link px-3 text-secondary"
            >
              Cats
            </Nav.Link>
            {token && (
              <Nav.Link 
                onClick={() => navigate('/my-requests')} 
                className={`nav-item-link px-3 ${location.pathname === '/my-requests' ? 'fw-bold text-primary active' : 'text-secondary'}`}
              >
                My Requests
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3 mt-2 mt-lg-0">
            {token && (
              <div className="d-flex align-items-center gap-2">
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fs-6 fw-normal">
                  {displayName}
                </Badge>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleLogoutClick} 
                  className="rounded-pill px-3"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
