<template>
    <div class="form-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Name:</label>
          <input type="text" id="username" v-model="username" placeholder="Enter your name" required autocomplete="off">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" placeholder="Password" required>
        </div>
        <button type="submit" class="submit-btn">Login</button>
      </form>
      <p>Don't have an account? <span class="signup-link"><router-link to="/signup">Signup</router-link></span></p>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
        username: '',
        password: '',
        error: null, // To store error messages from the backend
        };
    },
    
methods: {
    async login() {
      console.log('pressed')
    try {
        const response = await axios.post('/api/login', {
        username: this.username,
        password: this.password,
        });

        // Handle successful login (e.g., store token, redirect)
        console.log('Login successful:', response.data);
        // You would typically do something like:
        // this.$router.push('/dashboard'); // Redirect to a protected route
    } catch (error) {
        // Handle login errors (e.g., display error message)
        console.error('Login failed:', error.response.data);
    }
    },
},
};
</script>
  
<style scoped>
/* Form Container */
.form-container {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  padding: 30px;
  border-radius: 10px;
  max-width: 400px; 
  margin: 0 auto;  
  text-align: left;
}

/* Heading */
h2 {
  color: rgb(29, 29, 184); 
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif; 
}

/* Form Groups */
.form-group {
  margin-bottom: 15px;
}

/* Labels */
label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

/* Inputs */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* Login Button */
.submit-btn {
  background-color: rgb(29, 29, 184); 
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; 
}

.submit-btn:hover {
  background-color: rgb(23, 23, 250); 
}

/* Signup Link */
p {
  margin-top: 20px;
}

a { /* Styles for the signup link */
  color: rgb(29, 29, 184); 
  text-decoration: none;
}
a:hover{
  color:rgb(69, 69, 255); 
  /* // add hover effect */

}

/* Signup Link */
.signup-link {
  font-weight: bold;
  cursor: pointer;
}

</style>
