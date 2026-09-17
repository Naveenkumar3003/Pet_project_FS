# 🐾 PetPals Connect — Full-Stack MERN Pet Adoption Platform

A production-ready, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** application built to digitize pet adoption workflows, connect shelters with prospective adopters, and automate post-adoption pet status tracking.

---

## 🌟 Key Features & Capabilities

* **User Authentication & Session Security**: Role-based access control (RBAC) with JWT tokens and `bcrypt` password hashing.
* **Smart Navigation & Auth Guards**: Clean browser history control preventing back-button returns to login pages for active sessions.
* **Interactive Pet Catalog**: Search by keyword, breed, species, or temperament; filter by category pills (Dogs, Cats, Birds, Small Pets).
* **Automated 48-Hour Post-Adoption Lifecycle**:
  - When an admin approves an adoption request, pet status instantly transitions to `adopted`.
  - Adopted pets are automatically excluded from public listings and permanently purged after **48 hours** via scheduled background tasks.
* **Live User Adoption Request Tracker (`/my-requests`)**: Dedicated user dashboard to monitor submitted applications and real-time status updates (Pending ⏳, Approved 🎉, Rejected ❌).
* **Shelter Admin Management Portal (`/Admindash`)**: Real-time stats dashboard, pet inventory CRUD operations, and request review interface with instant decision actions.
* **Modern Design System**: Polished UI built with custom CSS design tokens, glassmorphism card overlays, responsive layouts, and curated color palettes.

---

## 🏗 System Architecture & Technology Stack

### Tech Stack
* **Frontend**: React.js, React Router v6, React Bootstrap, Axios
* **Backend**: Node.js, Express.js, JWT, Bcrypt, Body-Parser, CORS
* **Database**: MongoDB Atlas, Mongoose ODM
* **Build & Deployment**: Production-optimized build bundle, environment variable configurations

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd Backend
npm install
npm start
```
* Backend runs on `http://localhost:8000`

### 2. Frontend Setup
```bash
cd Frontend/my-app
npm install
npm start
```
* Frontend runs on `http://localhost:3000`

---

## 🔒 Environment Configuration

### Backend `.env`
```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
```

### Frontend `.env`
```env
REACT_APP_API_ADDRESS=http://localhost:8000
```