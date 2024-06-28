<template>
    <div class="study-info">
      <h2>Force Concept Inventory</h2>
      <p>
        The Force Concept Inventory (FCI) is a multiple-choice "test" designed to assess student
        understanding of the most basic concepts in Newtonian mechanics. The FCI can be used for
        several different purposes, but the most important one is to evaluate the effectiveness of
        instruction.
      </p>
      <p>
        Please:
        <br> Check one box per question.
        <br> Do not skip any question.
        <br> Avoid guessing. Your answers should reflect what you personally think.
      </p>
      <p>
        Plan to finish this questionnaire in 30 minutes. <br>
        Thank you for your cooperation.
      </p>
      <p>Click Next to proceed to the study.</p>
    </div>
</template>
  
<script>
  export default {
    name: 'StudyInfo'
  };
  </script>
  
  <style scoped>
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
  