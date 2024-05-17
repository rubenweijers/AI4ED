require('dotenv').config();
const { model } = require("mongoose");
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Create a schema for the login
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a schema for the questionnaire
const responseSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    question1: Boolean,
    question2: Boolean,
    createdAt: { type: Date, default: Date.now }
  });

// Collection Part
const collection = new mongoose.model('users', LoginSchema);

// Response Part
const response = mongoose.model('Response', responseSchema);

// Export the collection and the Response model
module.exports = collection;
// module.exports = response;
