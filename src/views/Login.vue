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
      <p>Don't have an account? <router-link to="/signup">Signup</router-link></p>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      async login() {
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

</style>
  