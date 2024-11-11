<template>
  <div class="consent-info">
      <h1>Welcome to the AI4ED Project Study!</h1>
      <p>
          Thank you for considering participation in a research study on the use of artificial intelligence (AI) for 
          providing personalized, targeted interventions in physics education.
          <h2><strong>Information</strong></h2>
          This study involves three key steps:
          <img src="/studypipeline.svg" alt="Studypipeline" class="welcome-image">
          <h3><strong> 1. Pre-Test:</strong></h3> After a brief survey, you will start by completing a <u>modified</u> version of the Force Concept Inventory (FCI), 
          a 30-item multiple-choice questionnaire designed to assess your understanding of fundamental concepts 
          in Newtonian mechanics, including:
          <ul>
              <li>Velocity</li>
              <li>Acceleration</li>
              <li>Force</li>
              <li>Newton’s Laws of Motion</li>
          </ul>
          The modified FCI is crafted to address common misconceptions about force and motion. Please follow these guidelines:
          <ul>
              <li>Select only one option per question.</li>
              <li>Do not leave any question unanswered.</li>
              <li>Avoid guessing; answer based on your understanding.</li>
          </ul>
          Once you start the study, a timer of 35 minutes will start. Plan to complete this FCI within that time.
          <h3><strong>2. AI Interaction:</strong></h3> 
          <!-- TREATMENT GROUP -->
          <div v-if="profile && profile.group === 'treatment'">
            In the next part of the study, we ask you to explain your reasoning for a question you got wrong in the modified FCI. 
            After that, you will interact with an AI companion in a three-round dialogue. 
            In each message, the AI reviews the summary of your reasoning and the question, and offers explanations and discussion, similar to a peer study group. 
            The AI companion will only talk to you about questions you got wrong. This part lasts for 40 minutes, or until all wrongly answered questions have been discussed.
            Note that in each dialogue, you must complete the 3 rounds to advance - the AI may prompt you with a question directly, but if it doesn't, please ask it any followup questions you have or anything else you feel will be helpful for improving your understanding of the question at hand.
        </div>
        <div v-else-if="profile && profile.group === 'control'">
          <!-- CONTROL GROUP -->
          For the next 40 minutes, the AI companion will alternate between asking you to explain your reasoning for a question you answered incorrectly on the modified FCI and presenting you with a question on physics history. 
          Each time you receive a physics history question, you will engage in three rounds of dialogue about that topic with the AI companion. 
          In each message, the AI reviews your responses from the recent history question you just answered, and offers explanations for those questions, similar to a peer study group. 
          The AI may prompt you with a question directly, but if it doesn't, please ask it any follow up questions you have or anything else you feel will be helpful for improving your understanding of the question at hand. 
          Please do not discuss topics other than physics history with the AI.
        </div>
          <h3><strong>3. Post-Test and Feedback:</strong></h3> After the AI interactions, you will complete another FCI test
          to evaluate the AI’s impact on your understanding of Newtonian Mechanics. You will also be asked to provide feedback to the study.
          We kindly ask that you answer all questions honestly and to the best of your ability. Your responses are anonymous 
          and will not be shared outside of the research team. This is an <strong>ungraded</strong> test, and your answers 
          will not affect your grades or standing in any way.
          <h2><strong>Accuracy of the AI Companion</strong></h2>
          <!-- TREATMENT GROUP -->
          <div v-if="profile && profile.group === 'treatment'">
          After taking the first FCI test, your answers will be automatically compared to the correct ones marked by expert physics researchers. 
          When you are asked to explain your reasoning for some of them in the second part of the study, you will only be asked to explain reasoning for questions where your initial answer was incorrect. 
          However, when you talk to the AI, note that it is not an expert physics researcher. Similar to a peer in a study group, the AI companion may not always provide accurate explanations for every question. 
          It can answer up to 40% of the questions incorrectly. 
          It’s essential to review the explanations critically for a more effective learning experience.
          </div>
          <!-- CONTROL GROUP -->
          <div v-else-if="profile && profile.group === 'control'">
            After taking the first FCI test, your answers will be automatically compared to the correct ones marked by expert physics researchers. 
            When you are asked to explain your reasoning for some of them in the second part of the study, you will only be asked to explain reasoning for questions where your initial answer was incorrect. 
            However, when you talk to the AI, note that it is not a guaranteed expert on physics history. 
            Similar to a peer in a study group, the AI companion may not always provide accurate knowledge or explanations. 
            It’s essential to review the explanations critically for a more effective learning experience.
          </div>
          <h2><strong>Discussion with Peers</strong></h2>
          At the time you complete this study, some of your peers may not yet have participated in their lab sections. 
          We ask you to please refrain from discussing the content here with other students until Thursday, November 14th (2024).
          <h2><strong>Voluntary Participation</strong></h2>
          Participation is entirely voluntary, and you may withdraw at any point by closing your browser.
          <h2><strong>Risks</strong></h2>
          There are no anticipated risks associated with participating. As no identifying information is collected, your 
          responses will remain anonymous and cannot be traced back to you.
          <h2><strong>Benefits</strong></h2>
          Your participation will help us understand how AI can support personalized learning, particularly in physics education. <br>You will also get to practice questions on the concepts you are learning this semester.
          <h2><strong>Consent</strong></h2>
          By agreeing to participate, you consent to the use of your anonymized responses for research purposes. No identifying 
          information will be collected, and your participation is voluntary. You may withdraw at any time without consequence. 
          This study does not offer compensation.
      </p>
      <p>
        <h2><strong>Contact</strong></h2>
          For questions, please reach out to investigator <strong>Prof. Ying Wu (Duke University)</strong> or principal investigator:  <strong>Prof. Jean-François Godbout (Université de Montréal)- <a href="mailto:ai4phys@gmail.com">ai4phys@gmail.com</a></strong>
      </p><br><br>
  </div>
</template>
  
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
});
</script>
  
<style scoped>
  .welcome-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the entire div */
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
  