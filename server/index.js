const express = require('express');
const pasth = require('path');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const collection = require('./config');
const { userInfo } = require('os');

const app = express();
// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// Register user
app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        };

        // check if the user already exists in the database
        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            return res.status(400).send("User already exists. Please choose a different username");
        }else {
            // hash the password using bcrypt
            const saltRounds = 10; // Number of salt round of bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword; // Replace the original password with the hashed password

            const userdata = await collection.create(data); 
            console.log('User created:', userdata);
            res.send("Account Created"); // Send a success response to the frontend
        }

    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send("Error creating account"); // Send an error response
    }

});

// Login user and send them to home.ejs
app.post('/login', async (req, res) => {
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
        }

        // If the password is correct, send the user to the home page
        res.render('home', { username: data.name });

    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send("Error logging in");
    }
});

const port = 2000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
