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
  
  <style scoped>
  /* Your existing styles or add new styles for error messages */
  .error-message {
    color: red;
  }
  </style>
  