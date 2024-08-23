<template>
    <div class="study-info-container">
      <h2>Study Information</h2>
      
      <StudyInfo1 />
      
      <div class="info-block">
        <p>Please review the information above carefully before proceeding to the study questions.</p>
      </div>
      
      <button @click="proceedToStudy" class="next-button">Next</button>
    </div>
</template>
  
<script setup>
  import { useRouter } from 'vue-router';
  import StudyInfo1 from '../components/StudyInfo1.vue';
  
  const router = useRouter();
  
  const proceedToStudy = () => {
    router.push('/study'); // Assuming '/study' is the route for Study.vue
  };
</script>
  
<style scoped>
  .study-info-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    font-family: Arial, sans-serif;
  }
  
  .study-info-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: rgb(29, 29, 184);
  }
  
  .info-block {
    background-color: #f8f8f8;
    border-left: 4px solid rgb(29, 29, 184);
    padding: 15px;
    margin-bottom: 20px;
    font-size: 18px;
    line-height: 1.4;
    color: #333;
  }
  
  .next-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: rgb(29, 29, 184);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 18px;
  }
  
  .next-button:hover {
    background-color: rgb(23, 23, 250);
  }
  
  @media (max-width: 600px) {
    .study-info-container {
      margin: 20px;
      padding: 15px;
    }
    
    h2 {
      font-size: 24px;
    }
    
    .info-block {
      font-size: 16px;
    }
  }
</style>