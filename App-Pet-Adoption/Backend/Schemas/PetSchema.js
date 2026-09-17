const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    petName: {
        type: String,
        required: true,
        trim: true
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    species: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: String,
        default: 'Unknown'
    },
    gender: {
        type: String,
        default: 'Unknown'
    },
    origin: {
        type: String,
        default: 'N/A'
    },
    size: {
        type: String,
        default: 'Medium'
    },
    weight: {
        type: String,
        default: 'N/A'
    },
    temperament: {
        type: String,
        default: 'Friendly'
    },
    coat: {
        type: String,
        default: 'Short'
    },
    lifeSpan: {
        type: String,
        default: '10-15 years'
    },
    specialCharacteristics: {
        type: String,
        default: 'Loving pet seeking home'
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
    },
    status: {
        type: String,
        enum: ['available', 'adopted'],
        default: 'available'
    },
    adoptedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Pets = mongoose.model("Pets", PetSchema);
module.exports = Pets;

