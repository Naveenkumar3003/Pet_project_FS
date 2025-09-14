const mongoose = require("mongoose");
const MONGO_URL = "mongodb+srv://naveennkumar0312_db_user:Naveen%402006@cluster0.6pslv2s.mongodb.net/PetAdoptionDB?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    const con = await mongoose.connect(MONGO_URL);
    console.log(`MongoDB is connected : ${con.connection.host}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;

