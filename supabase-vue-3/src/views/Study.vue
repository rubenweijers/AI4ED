<template>
  <div v-if="loading">
    <!-- Optionally, you can display a loading spinner or a message here -->
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-container">
      <h2>Study Questionnaire</h2>
      <form>
        <div v-for="(question, index) in questions" :key="index">
          <label :for="'question-' + index">{{ question.n }}. {{ question.questionText }}</label>
          <div class="options">
            <input type="checkbox"
                :id="'question-' + index + '-agree'"
                :value="question.questionText + '-agree'"
                v-model="answers[question.questionText + '-agree']"
                @click="toggleCheckbox(question.questionText, 'Agree')">
            <label :for="'question-' + index + '-agree'">Agree</label>

            <input type="checkbox"
                :id="'question-' + index + '-disagree'"
                :value="question.questionText + '-disagree'"
                v-model="answers[question.questionText + '-disagree']"
                @click="toggleCheckbox(question.questionText, 'Disagree')">
            <label :for="'question-' + index + '-disagree'">Disagree</label>
          </div>
        </div>
        <button type="submit" class="submit-button">Submit Questionnaire</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const user = ref(null)
const loading = ref(true)
const router = useRouter()

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
  } else {
    router.push('/login'); // Redirect to login if no user is found
  }
  loading.value = false;
}

onMounted(() => {
  checkUser();
});

const questions = ref([
  { n: 1, questionText: "I have strong beliefs about what is right and wrong, good and bad", type: "radio" },
  { n: 2, questionText: "I often act without considering the possible consequences.", type: "radio" },
  { n: 3, questionText: "I tend to solve problems using a step-by-step approach.", type: "radio" },
  { n: 4, questionText: "I believe that formal procedures and policies restrict people.", type: "radio" },
  { n: 5, questionText: "I have a reputation for saying what I think, simply and directly.", type: "radio" },
  { n: 6, questionText: "I often find that actions based on feelings are as sound as those based on careful thought and analysis.", type: "radio" },
  { n: 7, questionText: "I like the sort of work where I have time for thorough preparation and implementation.", type: "radio" },
]);
const answers = ref({})

const toggleCheckbox = (questionText, option) => {
  const oppositeOption = option === 'Agree' ? '-disagree' : '-agree';
  answers.value[questionText + oppositeOption] = false;
}
</script>

<style scoped>
.study-container { /* A wrapper for the entire questionnaire */
  max-width: 600px; /* Limit width for better readability */
  margin: 50px auto; /* Center the form */
  padding: 30px;
  background-color: #fff; /* Light background */
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  text-align: left;
}

.study-container h2 { /* Add a heading */
  text-align: center;
  margin-bottom: 20px;
  color: rgb(29, 29, 184); 
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

input[type="text"], textarea, select {
  width: 100%; 
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; 
} 

.options {
    display: flex;
    flex-direction: column;
    /* justify-content: flex-start; */
    margin-top: -10px;
    margin-bottom: 50px;
}

.options label {
    margin-bottom: -10px;
}

.options input[type="checkbox"] {
  /* Hide the default checkbox */
  opacity: 0; 
  position: left; 
}

.options input[type="checkbox"] + label::before {
  content: '';
  display: inline-block;
  width: 18px; 
  height: 18px;
  margin-right: 10px; 
  border: 1px solid #ddd;
  border-radius: 3px; 
  background-color: #fff;
}

.options input[type="checkbox"]:checked + label::before {
  background-color: rgb(29, 29, 184); 
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e"); 
  background-size: 10px;
}

.submit-button {
  background-color: rgb(29, 29, 184);  /* Main button color */
  color: white;                       /* Text color */
  border: none;
  border-radius: 5px;                 /* Slightly rounded corners */
  padding: 12px 30px;                 /* Adjust padding as needed */
  cursor: pointer;
  transition: background-color 0.3s;  /* Smooth hover transition */
}

.submit-button:hover {
  background-color: rgb(23, 23, 250); /* Slightly darker on hover  */
  transform: translateY(-3px); /* Moves the button slightly upwards */
}
</style>
