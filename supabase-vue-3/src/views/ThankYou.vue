<template>
  <div class="thank-you-container">
    <h1>Thank you for participating!</h1>    
    <p>We appreciate your participation in the study. Your responses are valuable and have been successfully recorded.</p>
    <p>You have completed the study: <u>Thank you for your time and effort!</u></p><br>

    <section>
      <h2>Senior Investigators</h2>
      <ul>
        <li>Principal Investigator Prof. Jean-François Godbout (Université de Montréal)</li>
        <li>Duke Investigator Prof. Ying Wu (Duke University)</li>
      </ul>
    </section>

    <section>
  <h2>Study Purpose and Aim</h2>
  <p>
    This study aimed to assess how AI could enhance learning in physics by addressing common misconceptions. 
    Participants were divided into two groups: one group discussed with an AI companion to identify and address specific misunderstandings in Newtonian mechanics, 
    while the other group, serving as the control group, discussed physics history with the AI, not directly related to the concepts assessed by the Force Concept Inventory (FCI) test. 
    This setup allowed us to evaluate the AI's impact on learning outcomes compared to traditional question-based learning.
  </p>
  <p>
    If you would like a summary of the study's findings once the analysis is complete, we would be happy to provide this. Please contact the senior investigators at 
    <strong><a href="mailto:ai4phys@gmail.com">ai4phys@gmail.com</a></strong> to request the results.
  </p>
</section>

<section>
  <h2>Study Design</h2>
  <p>
    To maintain the study's integrity, participants were not initially informed of the different group assignments (study and control group). This element was necessary 
    to prevent bias and to evaluate the AI's effectiveness in comparison to an alternative learning approach.
  </p>
  <p>
    The responses provided by both groups, along with post-test data, will help us analyze how the AI-assisted interventions compared to the control approach in correcting physics misconceptions. 
    This information will guide the future development of personalized AI educational tools.
  </p>
  <p>
    <strong>As a reminder, it is important to note that the results of the FCI tests do <u>not</u> affect your grade.</strong>
  </p>
</section>

<section>
  <h2>AI Companion Accuracy</h2>
  <p>
    While the system identified your incorrect answers on the first FCI questionnaire, some explanations the AI companion provided may not have been entirely correct. 
    We suggest viewing the interactions similarly to ones with a non-expert peer, which can be valuable for learning but are not authoritative like a TA or professor. 
    To support your learning, we recommend reviewing these concepts with your TA and professors, who can offer more definitive explanations and address any lingering questions. 
    Additionally, the university provides various resources—such as tutoring centers, study groups, and office hours—that can further aid your understanding.
  </p>
  <p>
    Thank you again for engaging critically with the explanations provided; your insights are invaluable to our research.
  </p>
</section>

<section>
  <h2>Discussion with Peers</h2>
  <p>
    At the time you complete this study, some of your peers may not yet have participated in their lab sections. We ask you to please refrain from discussing the content 
    here with other students until Thursday, April 3rd.
  </p>
</section>


  <!-- <section>
    <button @click="clearLocalStorage" class="clear-storage-button">Clear Login Data</button>
  </section> -->
  </div>
</template>

  
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const clearLocalStorage = () => {
  localStorage.removeItem('user');
  router.push('/login'); // Redirect to login after clearing data
};
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