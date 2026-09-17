const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const connectDB = require("./connection");
const Pets = require("./Schemas/PetSchema");
const Adopt = require("./Schemas/AdoptSchema");
const Admin = require("./Schemas/AdminSchema");
const Users = require("./Schemas/UserSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "pet_adoption_jwt_secret_key_2026_super_secure";

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:3000",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auth Middlewares
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
};

const authenticateAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Admin token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded.isAdmin) return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    req.admin = decoded;
    next();
  });
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
});

// User Registration
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new Users({
      username,
      email,
      password: hash
    });
    const savedUser = await newUser.save();
    
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ success: true, user: savedUser, token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// User Login with JWT Token
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      } 
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists with this email' });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({
      username: name, 
      email,
      password: hashedPassword
    });
    const savedAdmin = await newAdmin.save();
    
    const token = jwt.sign(
      { id: savedAdmin._id, username: savedAdmin.username, email: savedAdmin.email, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const adminResponse = {
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email
    };
    res.status(201).json({ success: true, admin: adminResponse, token, message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Error during admin registration:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Admin Login with JWT Token
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid admin credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      success: true, 
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      } 
    });
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/admin', async (req, res) => {
  try {
    const data = await Admin.find().select("-password");
    res.status(200).json(data);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({
      username,
      email,
      password: hash
    });
    const savedAdmin = await newAdmin.save();
    res.status(201).json({ success: true, admin: savedAdmin });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Adoption Requests
app.post('/api/adopts', async (req, res) => {
  try {
    const newAdopt = new Adopt({
      ...req.body,
      status: 'pending'
    });
    const savedAdopt = await newAdopt.save();
    res.status(200).json({ success: true, adoption: savedAdopt });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/adopts', async (req, res) => {
  try {
    const adoptRequests = await Adopt.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, adoptRequests });
  } catch (err) {
    console.error('Error fetching adoption requests:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Fetch Adoption Requests by User Email
app.get('/api/adopts/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email parameter required' });
    }
    const userRequests = await Adopt.find({ email: new RegExp(`^${email}$`, 'i') }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, adoptRequests: userRequests });
  } catch (err) {
    console.error('Error fetching user adoption requests:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Admin: Update adoption request status (approve or reject)
app.put('/api/adopts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be approved or rejected' });
    }

    const adoptRequest = await Adopt.findById(id);
    if (!adoptRequest) {
      return res.status(404).json({ success: false, error: 'Adoption request not found' });
    }

    adoptRequest.status = status;

    if (status === 'approved') {
      adoptRequest.adoptedAt = new Date();

      // Mark the pet as adopted if petId is linked
      if (adoptRequest.petId) {
        await Pets.findByIdAndUpdate(adoptRequest.petId, {
          status: 'adopted',
          adoptedAt: new Date()
        });
      } else if (adoptRequest.petsname) {
        // Fallback: match by pet name if petId wasn't passed
        await Pets.findOneAndUpdate(
          { petName: new RegExp(`^${adoptRequest.petsname}$`, 'i') },
          { status: 'adopted', adoptedAt: new Date() }
        );
      }
    } else if (status === 'rejected') {
      // If rejected, ensure pet availability is available
      if (adoptRequest.petId) {
        await Pets.findByIdAndUpdate(adoptRequest.petId, {
          status: 'available',
          adoptedAt: null
        });
      }
    }

    await adoptRequest.save();
    res.status(200).json({ success: true, message: `Request ${status} successfully`, adoption: adoptRequest });
  } catch (err) {
    console.error('Error updating adoption status:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Auto-removal helper: Remove adopted pets after 2 days (48 hours)
const cleanupAdoptedPets = async () => {
  if (mongoose.connection.readyState !== 1) {
    return; // Wait for DB connection
  }
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = await Pets.deleteMany({
      status: 'adopted',
      adoptedAt: { $lte: twoDaysAgo }
    });
    if (result.deletedCount > 0) {
      console.log(`Auto-removed ${result.deletedCount} adopted pets older than 48 hours`);
    }
  } catch (err) {
    console.error('Error in auto-removal cleanup:', err.message);
  }
};

// Run cleanup when connection opens & periodically every hour
mongoose.connection.on('connected', () => {
  cleanupAdoptedPets();
});
setInterval(cleanupAdoptedPets, 60 * 60 * 1000);

// Search & Filter Pets Endpoint
app.get('/api/pets/search', async (req, res) => {
  try {
    const { q, category, species, gender } = req.query;
    let queryFilter = {};

    const targetSpecies = category || species;
    if (targetSpecies && targetSpecies !== 'All') {
      queryFilter.species = new RegExp(`^${targetSpecies}$`, 'i');
    }

    if (gender && gender !== 'All') {
      queryFilter.gender = new RegExp(`^${gender}$`, 'i');
    }

    if (q && q.trim() !== '') {
      const searchRegex = new RegExp(q.trim(), 'i');
      queryFilter.$or = [
        { petName: searchRegex },
        { breed: searchRegex },
        { species: searchRegex },
        { temperament: searchRegex },
        { origin: searchRegex },
        { specialCharacteristics: searchRegex }
      ];
    }

    const pets = await Pets.find(queryFilter);
    res.status(200).json({ success: true, count: pets.length, data: pets });
  } catch (err) {
    console.error('Error searching pets:', err);
    res.status(500).json({ success: false, error: 'Database search error' });
  }
});

// Pet CRUD Routes
app.post('/api/pets', async (req, res) => {
  try {
    const newPet = new Pets({
      ...req.body
    });
    const savedPet = await newPet.save();
    res.status(200).json({ success: true, pet: savedPet });
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/petdata', async (req, res) => {
  try {
    const { species, status } = req.query;
    let filter = {};

    // Filter out adopted pets older than 48 hours
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    filter.$or = [
      { status: { $ne: 'adopted' } },
      { status: 'adopted', adoptedAt: { $gt: twoDaysAgo } }
    ];

    if (species && species !== 'All') {
      filter.species = new RegExp(`^${species}$`, 'i');
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    const data = await Pets.find(filter).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/pets/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid pet ID' });
    }
    const result = await Pets.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Pet not found' });
    }
    res.status(200).json({ success: true, message: 'Pet deleted successfully' });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

app.put('/api/pets/update/:id', async (req, res) => {
  try {
    const updatedPet = await Pets.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, pet: updatedPet });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/pets/count', async (req, res) => {
  try {
    const count = await Pets.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.get('/api/adopts/count', async (req, res) => {
  try {
    const count = await Adopt.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete Adoption Request (FIXED: req.params destructuring)
app.delete('/api/adopts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid adoption request ID' });
    }
    const result = await Adopt.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Adoption request not found' });
    }
    res.status(200).json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting request' });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use(express.static(path.join(__dirname, "../Frontend/my-app/build")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});