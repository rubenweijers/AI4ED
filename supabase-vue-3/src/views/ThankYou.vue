<template>
  <div class="content">
    <h1>Thank you for participating!</h1>    
    <p>We appreciate your participation in the study. Your responses are valuable and have been successfully recorded.</p>
    <p>You have completed the study. Thank you for your time and effort..</p>
    <router-link to="/">Go back to Home</router-link>
  </div>
</template>
  
<script setup>
  import { onMounted } from 'vue';
  import confetti from 'canvas-confetti'; // Import the confetti library
  
  // Trigger the confetti effect when the component is mounted
  onMounted(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  });
</script>
  

<style scoped>
.thank-you-container {
  text-align: center;
  padding: 3em; /* Increased padding to maintain text position */
  margin: 0 auto;
  max-width: 800px; /* Increased maximum width */
  min-height: 400px; /* Added minimum height to make the box taller */
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  display: flex; /* Flexbox for centering */
  flex-direction: column; /* Column layout */
  justify-content: center; /* Center content vertically */
}
  
  h1 {
    color: white;
  }
  
  p {
    margin: 1em 0;
    font-size: 1.2em;
  }
  
  a {
    display: inline-block;
    margin-top: 2em;
    padding: 0.5em 2em;
    background: rgb(29, 29, 184);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background 0.3s ease;
  }
  
  a:hover {
    background-color: rgb(23, 23, 250);
    color: white;
    transform: translateY(-3px);
  }
  </style>
  