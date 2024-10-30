<template>
  <div class="thank-you-container">
    <h1>Thank you for participating!</h1>    
    <p>We appreciate your participation in the study. Your responses are valuable and have been successfully recorded.</p>
    <p>You have completed the study: <u>Thank you for your time and effort!</u></p><br>

    <section>
      <h2>Principal Investigators</h2>
      <ul>
        <li>Jean-François Godbout - <a href="mailto:ai4ed@gmail.com">jean-francois.godbout@umontreal.ca</a></li>
      </ul>
    </section>

    <section>
      <h2>Study Purpose and Aim</h2>
      <p>
        This study aimed to assess how AI could enhance learning in physics by addressing common misconceptions. <br><br>Participants were divided into two groups: one group received support from an AI companion across three sessions to identify and address specific misunderstandings in Newtonian mechanics. The other group, serving as the control group, was given a series of questions on physics history unrelated to the concepts assessed by the Force Concept Inventory (FCI) test. This setup allowed us to evaluate the AI's impact on learning outcomes compared to traditional question-based learning.
      </p>
      <p>
        If you would like a summary of the study's findings once the analysis is complete, we would be happy to provide this. Please contact <strong>XXX NAME</strong>, the principal investigator, to request the results.<br><br>
      </p>
    </section>

    <section>
      <h2>Deception and Its Purpose</h2>
      <p>
        To maintain the study's integrity, participants were not initially informed of the different group assignments (study and control group). This element was necessary to prevent bias and to evaluate the AI's effectiveness in comparison to an alternative learning approach.
      </p>
      <p>
        The responses provided by both groups, along with post-test data, will help us analyze how the AI-assisted interventions compared to the control approach in correcting physics misconceptions. This information will guide the future development of personalized AI educational tools.
      </p>
      <p>
        <b>As a reminder, it is important to note that the results of the FCI tests do <u>not</u> affect your grade.</b><br><br>
      </p>
    </section>

    <section>
      <h2>AI Companion Accuracy</h2>
      <p>
        While the AI companion effectively identified your incorrect answers on the first FCI questionnaire, some explanations it provided may not have been entirely precise. To support your learning, we recommend reviewing these concepts with your TA and professors, who can offer more thorough explanations and address any lingering questions. Additionally, the university provides various resources—such as tutoring centers, study groups, and office hours—that can further aid your understanding.
      </p>
      <p>
        To assist with targeted review, we will also send you the results of your pre-test evaluation. This will indicate which concepts you struggled with, allowing you to focus on revising these areas with the support available to you. <br><br> Thank you again for engaging critically with the explanations provided; your insights are invaluable to our research.
      </p>
    </section>

    <!-- <router-link to="/">Go back to Home</router-link> -->
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
  text-align: left;
  padding: 2em;
  margin: 0 auto;
  max-width: 800px;
  min-height: 400px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  color: #000;
  text-align: center;
}

p {
  margin: 1em 0;
  font-size: 1.1em;
  line-height: 1.6;
}

ul {
  padding-left: 1.2em;
}

li {
  font-size: 1em;
  line-height: 1.5;
  margin-bottom: 0.5em;
}

a {
  color: rgb(29, 29, 184);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.router-link {
  display: block;
  text-align: center;
  margin-top: 2em;
  padding: 0.5em 2em;
  background: rgb(29, 29, 184);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.router-link:hover {
  background-color: rgb(23, 23, 250);
  transform: translateY(-3px);
}
</style>