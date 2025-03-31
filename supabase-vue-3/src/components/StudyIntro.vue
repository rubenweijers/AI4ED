<template>
  <div class="consent-info">
      <h1>Key Information:</h1>
      <p>Campus Protocol ID#: 2025-0305</p>
      <p>
        You are invited to take part in a research study conducted by a lab TA, supervised by Dr. Ying Wu, a
        professor at Duke University.

        The purpose of the study is to examine whether interacting with an AI companion can reduce
        misconceptions in learning Newtonian physics.

        Participation in the study involves completing a short survey that will ask you questions about your
        opinions on the use of generative AI. After this, you will be asked to complete a 30-question multiple
        choice test designed to assess your understanding of fundamental concepts in Newtonian mechanics,
        including Velocity, Acceleration, Force, and Newton’s Laws of Motion. This test is crafted to address
        common misconceptions about force and motion. These will be multiple-choice questions, and you will
        be asked to select only one option per question based on your understanding. Once you start this test, a
        timer of 35 minutes will start. Plan to complete this test within that time.

        <img src="/studypipeline.svg" alt="Studypipeline" class="welcome-image">

        <h3><strong>2. AI Interaction:</strong></h3> 
        <!-- TREATMENT GROUP -->
        <div v-if="profile && (profile.group === 'experimental_o3' || profile.group === 'experimental_4o')">
          After that, you will interact with an AI companion to discuss the related physics concepts. Like a peer in
          a study group, the AI companion may not always provide the most accurate explanations for every
          question. Note that in each discussion, you must interact at least once with the AI companion. This part
          of the study lasts up to 40 minutes, depending on your test performance.

          After the AI interactions, you will complete a second test, similar to the first test, to evaluate the AI’s
          impact on your understanding of Newtonian Mechanics. You will also be asked to provide feedback on
          the study. You will have 30 minutes to finish this test.

          Please note that the system is capable of accurately grading your responses to the questions in the
          survey. However, during conversations with you to correct a misconception or an answer, the AI
          companion may make mistakes, or misinterpret or misunderstand your response, despite its best efforts.
          It can answer up to [percentage_depending_on_final_AI_chosen] of the questions incorrectly. As a
          result, its feedback may not always be accurate or helpful. You are expected to exercise your own
          judgment when considering feedback from the AI, just as you would when the feedback is from a human
          peer.
        </div>
        <div v-else-if="profile && profile.group === 'control'">
          <!-- CONTROL GROUP -->
          After that, you will interact with an AI companion to discuss well-known historical figures in physics.
          Like a peer in a study group, the AI companion may not always provide the most accurate explanations
          for every question. Note that in each discussion, you must interact at least once with the AI companion.
          This part of the study lasts up to 40 minutes, depending on your test performance.
          
          After the AI interactions, you will complete a second test, similar to the first test, to evaluate the AI’s
          impact on your understanding of Newtonian Mechanics. You will also be asked to provide feedback on
          the study. You will have 30 minutes to finish this test.

          Please note that the system is capable of accurately grading your responses to the questions in the
          survey. However, during conversations with you the AI companion may make mistakes, or misinterpret
          or misunderstand your response, despite its best efforts. As a result, its information may not always be
          accurate or helpful. You are expected to exercise your own judgment when considering information
          from the AI companion, just as you would with a human peer.
        </div>

        <h2><strong>Discussion with Peers</strong></h2>
        At the time you complete this study, some of your peers may not yet have participated in their lab
        sessions. We ask you to please refrain from discussing the content in this study with other students until
        they are finished.
        <h2><strong>Voluntary Participation</strong></h2>
        The total time for completing the survey should not exceed the duration of your lab session. Your
        participation is voluntary. You may withdraw or choose not to answer any question at any time for any
        reason.

        <h2><strong>Information Storage</strong></h2>
        We will not collect identifiable information about you or ask you to provide identifiable information
        about yourself. The only information that we will collect from you is your answers to the questions
        presented to you as part of the pretest and posttest and during your interaction with the AI companion.
        The raw data collected by AI will be stored on Duke’s approved storage for analysis.

        Due to the unpredictability of how AI develops and also interprets and processes data, data entered into
        the AI companion may be used in ways beyond our control or initial intentions.

        Aggregated results may be made public or used for future research purposes. This is integral to the
        research process, as it allows other researchers to verify results and avoid duplicating research.
        
        <h2><strong>Risks and Benefits</strong></h2>
        Your participation will not affect your grade or class standing in any manner. We know of no risks or
        direct benefits to you resulting from participating in the study.
        
        <h2><strong>Contact</strong></h2>
        If you have any questions about us or the research, feel free to email me (wu@phy.duke.edu) now. If
        you have questions about your rights as a research subject, contact Duke University’s Institutional
        Review Board at campusirb@duke.edu or at 919-684-3030. If contacting the IRB, please reference
        protocol ID#2025-0305.
        
        If you are interested in taking part in this survey, please click to the next screen
      </p>
      <br><br>
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
  