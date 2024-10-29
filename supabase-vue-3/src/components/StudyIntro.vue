<template>
    <div class="study-info">
      <h2>Thank you for participating in our study!</h2>
      <p>
        In this study, you will be taking the <i>Force Concept Inventory (FCI)</i> test to evaluate your understanding of fundamental Newtonian mechanics concepts.
        <br><br>
        After completing the test, you will interact with an AI tutor to help you understand the concepts better.<br>
        <br><br>
        Then, you will be asked to complete a different version of the FCI to evaluate your learning experience.
        <br><br> 
        Aditionally, we will ask some additional questions about your experience throughout the experiment. 
        <br>
        We ask you to answer these questions honestly and to the best of your ability.
        <br>
        Your responses are anonmyous and will <strong>not</strong> be shared with anyone outside this research.
        <br>
        This is an <strong>ungraded</strong> test and your responses will not affect your grade in any way.
        <br>
        Bonus points will be awarded for participation?
      </p>
      <img src="/studypipeline.svg" alt="Welcome Image" class="welcome-image">

    </div>
</template>
  
<script>
  export default {
    name: 'StudyInfo'
  };
  </script>
  
<style scoped>
  .welcome-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px; /* Rounded corners */
}

  .study-info {
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    line-height: 1.6;
    text-align: left;
  }
  
  .study-info h2 {
    margin-bottom: 10px;
  }
  
  .study-info p {
    margin-bottom: 20px;
  }
  </style>
  