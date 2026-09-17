const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL;

    if (!mongoUrl && process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      mongoUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0.qpunvcw.mongodb.net/PetAdoptionDB?retryWrites=true&w=majority`;
    }

    if (!mongoUrl) {
      mongoUrl = "mongodb+srv://naveennkumar0312_db_user:DQvv9rpSc9BUQJj0@cluster0.qpunvcw.mongodb.net/PetAdoptionDB?retryWrites=true&w=majority";
    }

    const dbName = process.env.DB_NAME || "PetAdoptionDB";

    const con = await mongoose.connect(mongoUrl, {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB Connected Successfully: ${con.connection.host}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error("\nMONGODB IP WHITELIST REQUIRED:");
      console.error("   Your current IP address is not whitelisted in MongoDB Atlas.");
      console.error("   Please go to MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0) or add your current IP.\n");
    }
  }
};

module.exports = connectDB;

