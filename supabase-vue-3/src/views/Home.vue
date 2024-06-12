<template>
  <div class="content">
    <div class="welcome-image-container">
      <img src="/oilpa.png" alt="Welcome Image" class="welcome-image">
      <div class="welcome-text">
        <h2>Welcome to our study!</h2>
        <p>Join our research in exploring how personalized AI can enhance learning.</p>
        <p>Take a questionnaire, interact with advanced AI based on your learning style, and see the results!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirect() {
      this.$router.push({ name: 'Home' })
    },
    back() {
      this.$router.go(-1)
    },
    forward() {
      this.$router.go(1)
    },
  }
}
</script>

<style scoped>
.content {
  margin-top: 50px;
  color: #2c3e50; /* Ensure this color contrasts well with the off-white background */
  text-align: center;
  padding: 20px;
  border-radius: 10px;
}

.welcome-image-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 50px); /* Adjust height to fill the screen minus top margin */
  overflow: hidden;
  border-radius: 5px; /* Rounded corners */
}

.welcome-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px; /* Rounded corners */
}

.welcome-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.7); /* Semi-transparent background for better readability */
  padding: 20px;
  border-radius: 5px;
}
</style>
