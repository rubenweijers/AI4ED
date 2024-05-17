<template>

  <div v-if="showPopup" class="popup">
    Signup successful!
  </div>

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

      <!-- Sign up button that redirect to login page -->
      <div class="signup-button-container">
        <button type="submit" class="submit-btn" :disabled="redirecting">
          Sign Up
        </button>
        <div v-if="redirecting" class="spinner"></div>
      </div>


      <!-- Old login button -->
      <!-- <button type="submit" class="submit-btn">Sign Up</button> -->

      <p>Already have an account? <span class="signup-link"><router-link to="/login">Log in</router-link></span></p>
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
    showPopup: false,
    redirecting: false,
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
          this.showPopup = true;
          this.redirecting = true; // Show the "redirecting" message and spinning wheel

          // Redirect to login page after 3 seconds
          setTimeout(() => {
            this.showPopup = false; // Hide the popup after 3 seconds
            this.$router.push('/login'); // Redirect to login
            this.redirecting = false;
          }, 3000);

          // Clear the form
          this.username = '';
          this.password = '';

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

.popup {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
  background-color: rgb(27, 0, 63); /* Semi-transparent black background */
  color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000; /* Ensure it's on top of other elements */
}

/* Signup Link */
.signup-link {
  font-weight: bold;
  cursor: pointer;
}

.signup-button-container {
  display: flex;
  align-items: center;
}

.spinner {
  margin-left: 10px;
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 0.7s linear infinite; /* Reduced from 2s to 1s for faster spinning */
}

@keyframes spin {
  0% { transform: rotate(0deg); border-color: #f3f3f3; border-top-color: #3498db; } /* Blue */
  25% { transform: rotate(90deg); border-color: #f3f3f3; border-top-color: #9b59b6; } /* Purple */
  50% { transform: rotate(180deg); border-color: #f3f3f3; border-top-color: #e74c3c; } /* Red */
  75% { transform: rotate(270deg); border-color: #f3f3f3; border-top-color: #f1c40f; } /* Yellow */
  100% { transform: rotate(360deg); border-color: #f3f3f3; border-top-color: #2ecc71; } /* Green */
}

</style>
