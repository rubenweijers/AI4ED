const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware'); // Currently not being used
const path = require('path');  // Corrected import of the 'path' module
const bcrypt = require('bcrypt');
const collection = require('./config');
const cors = require('cors'); // Currently not being used
const proxy = require('express-http-proxy');
const MongoClient = require('mongodb').MongoClient;

// Use cookie-parser for login/logout functionality
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Import jsonwebtoken for authentication
const jwt = require('jsonwebtoken');

const app = express();
const port = 2000;

// CORS CURRENTLY NOT USED
// app.use(cors());
app.use(express.json());

// THIS NOT USED CURRENTLY
// app.use(express.urlencoded({ extended: false }));



// Register user (API endpoint)
app.post('/api/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        };

        // Check if the user already exists
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' }); // 409 Conflict
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        // Create the user in the database
        await collection.create(data);
        res.status(201).json({ message: 'Account created successfully' }); // 201 Created
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'An error occurred while creating the account' });
    }
});

// Login user (API endpoint)
app.post('/api/login', async (req, res) => {
    console.log('Login request received:', req.body);
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        };

        // check if the user exists in the database
        const existingUser = await collection.findOne({ name: data.name });

        if (!existingUser) {
            return res.status(400).send("User does not exist. Please create an account");
        }

        // compare the password entered with the hashed password in the database
        const passwordMatch = await bcrypt.compare(data.password, existingUser.password);

        if (!passwordMatch) {
            return res.status(400).send("Invalid password");
        }else {
            // Generate a JWT
            const token = jwt.sign({ username: data.name }, 'your-secret-key', { expiresIn: '1h' });

            res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
            res.status(200).send("Login successful");
        }

    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send("Error logging in");
    }
});

// Send questionnaire data to the database (API endpoint)
// ... your imports ...
app.post('/api/questionnaire/submit', async (req, res) => {
    try {
      // Assuming you have authentication in place
      // and the authenticated user's ID is available as req.user.id
      const userId = req.body.userId; 
      const responses = req.body;

      // Remove the userId from the responses object
      delete responses.userId;
  
      const newResponse = new Response({ userId, ...responses });
      await newResponse.save();
  
      res.status(201).json({ message: 'Responses saved successfully' });
    } catch (error) {
      console.error('Error saving responses:', error);
      res.status(500).json({ error: 'An error occurred while saving responses' });
    }
  });
  
  // ... other routes
  


// Catch-all route to serve your Vue app for all other paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// End of working code















// Some old code that doesn't work:
// let db;
// MongoClient.connect('mongodb://localhost:2000/login-practice', { useUnifiedTopology: true }, (err, client) => {
//   if (err) throw err;
//   db = client.db('login-practice'); // use 'mydb' database
// });


// Manual proxy configuration
// app.use('/api', proxy('http://localhost:8080')); 

// app.post('/api/signup', async (req, res) => {
//     try {
//       const { username, password } = req.body;
  
//       // Check if the user already exists
//       const existingUser = await db.collection('users').findOne({ username });
//       if (existingUser) {
//         return res.status(409).json({ error: 'User already exists' });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Store the user in the database
//       await db.collection('users').insertOne({ username, password: hashedPassword });
  
//       res.status(201).json({ message: 'Account created successfully' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'An error occurred while creating the account' });
//     }
//   });