require('dotenv').config();
const { model } = require("mongoose");
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Create a schema
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

// Collection Part
const collection = new mongoose.model('users', LoginSchema);

module.exports = collection;
