<template>
    <div>
      <h1>Post Test Quiz</h1>
      <p>To be implemented</p>
      <button @click="submitTest" class="submit-button">Submit Post-Test</button>
    </div>
</template>
  
<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const submitTest = () => {
        // Logic to handle the test submission can be added here if needed
        router.push('/survey'); // Redirect to Chat.vue
    };
</script>
  
<style scoped>
  .submit-button {
    background-color: rgb(29, 29, 184);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 12px 30px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .submit-button:hover {
    background-color: rgb(23, 23, 250);
    transform: translateY(-3px);
  }
</style>
  