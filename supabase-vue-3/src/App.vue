<template>
  <div>
    <Header />
    <router-view/>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #FAF9F6;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 5px; /* Ensure no margin! */
  padding: 0px; /* Ensure no padding */
  text-align: center;
  color: black;
}

.content {
  /* margin-top: 50px; */
  color: #000;
}

.cta-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1d1db8;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
}

.cta-btn:hover {
  background-color: #1717fa;
  transform: translateY(-3px);
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .nav, .actions {
    margin-top: 10px;
  }
}
</style>
