<template>
    <div class="writing-screening">
      <h1>Writing Screening</h1>
      <WritingScreeningComponent @response-submitted="handleResponseSubmitted" />
      <button v-if="responseSubmitted" @click="proceedToNextPage" class="next-button">Next</button>
    </div>
</template>
  
<script>
  import WritingScreeningComponent from '@/components/WritingScreeningComponent.vue';
  
  export default {
    name: 'WritingScreening',
    components: {
        WritingScreeningComponent
    },
    data() {
      return {
        responseSubmitted: false
      };
    },
    methods: {
      handleResponseSubmitted(response) {
        // Handle the submitted response here
        console.log('Response received:', response);
        this.responseSubmitted = true;
        // You might want to save this response to your database or state management store
      },
      proceedToNextPage() {
        // Navigate to the next page in your application
        this.$router.push('/next-page'); // Replace '/next-page' with your actual next route
      }
    }
  };
  </script>
  
  <style scoped>
  .writing-screening {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .next-button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #00008B;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .next-button:hover {
    background-color: #000066;
  }
  </style>
  