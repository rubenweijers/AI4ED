<template>
    <div class="study-info">
      <h2>Important:</h2>
      <!-- <p>
        The Force Concept Inventory (FCI) is a multiple-choice "test" designed to assess student
        understanding of the most basic concepts in Newtonian mechanics, namely: 
        <ul>
          <li>Velocity</li>
          <li>Acceleration</li>
          <li>Force</li>
          <li>Newton's laws of motion</li>
        </ul>

        <br><br>
        It specifically targets common misconceptions and "commonsense beliefs" about force and motion that students often hold.
      </p> -->
      <p>
        Please:
        <ul>
          <li>Check one box per question.</li>
          <li>Do not skip any question.</li>
          <li>Avoid guessing. Your answers should reflect what you personally think.</li>
        </ul>
      </p>
      <p>
        Pressing the buttons below will set a 35 minute timer for you to finish the survey and the FCI test <br>
      </p>
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
  