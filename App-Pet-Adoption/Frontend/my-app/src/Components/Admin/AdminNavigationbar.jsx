import React from "react";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const AdminNavigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminJson = localStorage.getItem('admin');
  const admin = adminJson ? JSON.parse(adminJson) : null;
  const adminName = admin?.username || admin?.email?.split('@')[0] || 'Admin';

  const handleAdminLogout = () => {
    localStorage.clear();
    navigate("/admin", { replace: true });
  };

  return (
    <Navbar expand="lg" className="admin-navbar sticky-top bg-dark navbar-dark shadow-sm py-2 mb-4">
      <Container fluid="lg">
        <Navbar.Brand 
          onClick={() => navigate('/Admindash')} 
          className="brand-logo d-flex align-items-center cursor-pointer fs-4 fw-bold text-white"
          style={{ cursor: 'pointer' }}
        >
          <span>PetPals <span className="text-warning">Admin Portal</span></span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="mx-auto align-items-center gap-1">
            <Nav.Link 
              onClick={() => navigate('/Admindash')} 
              className={`px-3 ${location.pathname === '/Admindash' ? 'fw-bold text-warning active' : 'text-light'}`}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              onClick={() => navigate('/PetAddForm')} 
              className={`px-3 ${location.pathname === '/PetAddForm' ? 'fw-bold text-warning active' : 'text-light'}`}
            >
              Add New Pet
            </Nav.Link>
            <Nav.Link 
              onClick={() => navigate('/viewPetDetails')} 
              className={`px-3 ${location.pathname === '/viewPetDetails' ? 'fw-bold text-warning active' : 'text-light'}`}
            >
              Pet Inventory
            </Nav.Link>
            <Nav.Link 
              onClick={() => navigate('/Petrequestlist')} 
              className={`px-3 ${location.pathname === '/Petrequestlist' ? 'fw-bold text-warning active' : 'text-light'}`}
            >
              Adoption Requests
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3 mt-2 mt-lg-0">
            <Badge bg="secondary" className="px-3 py-2 rounded-pill fs-6 fw-normal text-white">
              {adminName}
            </Badge>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={handleAdminLogout} 
              className="rounded-pill px-3"
            >
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavigationbar;
