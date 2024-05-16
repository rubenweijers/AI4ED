<template>
    <div class="form-container">
      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="username">Name:</label>
          <input type="text" id="username" v-model="username" placeholder="Enter your name" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" placeholder="Password" required>
        </div>
  
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
  
        <button type="submit" class="submit-btn">Sign Up</button>
      </form>
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
    async signup() {
      // this.error = null; // Clear any previous errors
      console.log('pressed')
      try {
          const response = await axios.post('/api/signup', {
          username: this.username,
          password: this.password,
          });

          // Handle successful signup
          console.log('Signup successful:', response.data);

          // Clear the form
          this.username = '';
          this.password = '';

          // Redirect to login or display a success message
          this.$router.push('/login');  
          console.log('Signup response:', response);
      } catch (error) {
        if (error.response) {
            console.error('Signup error:', error.response.data); // Log error details
        } else {
            console.error('Signup error:', error.message); // Log a generic error message
        }
        }
      },
  },
};

</script>
  

// Add the following styles to the Signup.vue file:
<style scoped>
.form-container {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  padding: 30px;
  border-radius: 10px;
  max-width: 400px; /* Limit form width */
  margin: 0 auto;  /* Center horizontally */
  text-align: left;
}

h2 {
  color: rgb(29, 29, 184); /* Dark blue header */
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif; /* Set font to Roboto */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.submit-btn {
  background-color: rgb(29, 29, 184); /* Dark blue button */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; /* Smooth transition on hover */
}

.submit-btn:hover {
  background-color: rgb(23, 23, 250); /* Lighter blue on hover */
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
