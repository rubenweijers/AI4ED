<template>
  <div class="content">
    <div class="welcome-image-container">
      <img src="/pasteloilpainting.png" alt="Welcome Image" class="welcome-image">
      <div class="welcome-text">
        <h2>AI for Education</h2>
        <p>Reducing misconceptions in physics using state of the art AI models.</p>
        <!-- <button @click="learnMore" class="learn-more-button">Learn More</button> -->
        <router-link :to="{ name: 'Study'}" class="learn-more-button">Learn more</router-link>
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
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff; /* White text for better visibility */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.welcome-text h2 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.welcome-text p {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.learn-more-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.learn-more-button:hover {
  background-color: #34495e;
}


</style>
