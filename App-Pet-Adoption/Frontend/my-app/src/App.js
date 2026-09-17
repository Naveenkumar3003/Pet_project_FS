import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserCard from './Components/Users/UserCard';
import AdminLogin from './Components/Admin/AdminLogin.jsx';
import Home from './Components/Home';
import PetAddForm from './Components/NewPet/PetAddForm';
import DogDetails from './Components/Dogpage/DogDetails';
import CatDetails from './Components/Catpage/CatDetails';
import PetCatalog from './Components/Catalog/PetCatalog';
import AdoptForm from './Components/AdoptPet/AdoptForm';
import Petrequestlist from './Components/Petrequestlist/Petrequestlist.jsx';
import Pets from './Components/AllDetails/Pets';
import AdminDash from './Components/Admindash/AdminDashboard.jsx';
import MyRequests from './Components/MyRequests/MyRequests.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

// User auth check
const isAuthenticated = () => {
  return localStorage.getItem('userToken') !== null || localStorage.getItem('user') !== null || localStorage.getItem('token') !== null;
};

// Admin auth check
const isAdminAuthenticated = () => {
  return localStorage.getItem('adminToken') !== null || localStorage.getItem('admin') !== null;
};

// Protected route component for standard users
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Admin protected route component
const AdminProtectedRoute = ({ children }) => {
  return isAdminAuthenticated() ? children : <Navigate to="/admin" replace />;
};

// Public only route (prevents returning to login if already authenticated)
const PublicOnlyRoute = ({ children }) => {
  if (isAdminAuthenticated()) {
    return <Navigate to="/Admindash" replace />;
  }
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <Routes>
        {/* Public-Only Auth Routes */}
        <Route 
          path="/" 
          element={
            <PublicOnlyRoute>
              <UserCard />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PublicOnlyRoute>
              <AdminLogin />
            </PublicOnlyRoute>
          } 
        />
        
        {/* Protected User Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/catalog" 
          element={
            <ProtectedRoute>
              <PetCatalog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-requests" 
          element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dogs/:id" 
          element={
            <ProtectedRoute>
              <DogDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cats/:id" 
          element={
            <ProtectedRoute>
              <CatDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dogs" 
          element={
            <ProtectedRoute>
              <PetCatalog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cats" 
          element={
            <ProtectedRoute>
              <PetCatalog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/viewPetDetails" 
          element={
            <AdminProtectedRoute>
              <Pets />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/adopt" 
          element={
            <ProtectedRoute>
              <AdoptForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/Admindash" 
          element={
            <AdminProtectedRoute>
              <AdminDash />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/PetAddForm" 
          element={
            <AdminProtectedRoute>
              <PetAddForm />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/Petrequestlist" 
          element={
            <AdminProtectedRoute>
              <Petrequestlist />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect based on auth */}
        <Route 
          path="*" 
          element={
            isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
          } 
        />
      </Routes>
    </>
  );
}

export default App;