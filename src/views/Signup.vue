<template>
    <div class="form-container">
      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="username">Name:</label>
          <input type="text" id="username" v-model="username" placeholder="Enter your name" required autocomplete="off">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" placeholder="Password" required>
        </div>
        <button type="submit" class="submit-btn">Sign Up</button>
      </form>
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
      async signup() {
        try {
          const response = await axios.post('/api/signup', {
            username: this.username,
            password: this.password,
          });
  
          // Handle successful signup (e.g., display success message, redirect)
          console.log('Signup successful:', response.data);
          // You might want to do something like:
          // this.$router.push('/login'); // Redirect to login after signup
        } catch (error) {
          // Handle signup errors (e.g., display error message)
          console.error('Signup failed:', error.response.data);
        }
      },
    },
  };
</script>
  
<style scoped>

</style>
  