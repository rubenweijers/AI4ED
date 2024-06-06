<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="survey-container">
      <h2>Post-Study Survey</h2>
      <p>Imported Questions</p>
      <form @submit.prevent="submitSurvey">
        <div class="survey-question" v-for="(question, index) in surveyQuestions" :key="index">
          <label :for="'question-' + index">{{ index + 1 }}. {{ question.question }}</label>
          <div class="likert-scale" v-if="question.question_type === 'likert'">
            <div v-for="option in likertOptions" :key="option.value" class="likert-option">
              <input type="radio" :id="'question-' + index + '-' + option.value" :name="'question-' + index" :value="option.value" v-model="answers[index]" />
              <label :for="'question-' + index + '-' + option.value">{{ option.label }}</label>
            </div>
          </div>
          <div v-else-if="question.question_type === 'textarea'">
            <textarea :id="'question-' + index" v-model="answers[index]" rows="3"></textarea>
          </div>
        </div>
        <button type="submit" class="submit-button">Submit Survey</button>
      </form>
    </div>
  </div>
  <div v-else>
    <p>Please log in to complete the survey.</p>
    <router-link to="/login">Log in</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const user = ref(null);
const loading = ref(true);
const surveyQuestions = ref([]);
const answers = ref([]);

const likertOptions = [
  { value: '1', label: 'Strongly disagree' },
  { value: '2', label: 'Disagree' },
  { value: '3', label: 'Neither agree nor disagree' },
  { value: '4', label: 'Agree' },
  { value: '5', label: 'Strongly agree' }
];

const router = useRouter();

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
  } else {
    router.push('/login'); // Redirect to login if no user is found
  }
};

const fetchQuestions = async () => {
  const { data, error } = await supabase.from('survey_questions').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error fetching questions:', error.message);
    return;
  }
  if (data.length === 0) {
    console.warn('No questions found in the database.');
  } else {
    surveyQuestions.value = data;
    answers.value = surveyQuestions.value.map(() => ''); // Initialize answers array with empty strings
  }
  loading.value = false; // Set loading to false after fetching questions
};

const submitSurvey = async () => {
  try {
    const userId = user.value.id;
    const surveyEntries = surveyQuestions.value.map((question, index) => ({
      user_id: userId,
      question_id: question.id,
      question_number: index + 1,
      answer: answers.value[index],
    }));

    const { data, error } = await supabase
      .from('survey_answers')
      .upsert(surveyEntries, { onConflict: ['user_id', 'question_id'] });

    if (error) {
      console.error('Error submitting survey answers:', error.message);
      return;
    }

    // Show success message
    alert('Survey submission successful! Thank you for your feedback.');

    // Redirect to a thank you or home page
    router.push('/');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

onMounted(async () => {
  await checkUser();
  await fetchQuestions();
});
</script>

<style scoped>
.survey-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.survey-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: rgb(29, 29, 184); 
}

.survey-question {
  margin-bottom: 30px; /* Increased margin between questions */
}

.survey-question label {
  display: block;
  margin-top: 50px;
  margin-bottom: 10px;
  padding: 5px; /* Add padding for better readability */
  font-weight: 600;
  color: black;
  font-size: 18px; /* Increase font size */
  text-transform: none; /* Ensure text is not capitalized */
}

.likert-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px 0; /* Add padding to the likert scale for better spacing */
}

.likert-option {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.likert-option label {
  margin-top: 5px;
  font-size: 16px; /* Increase font size for better readability */
  color: rgb(88, 88, 88);
}

textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px; /* Increase font size for better readability */
}

.submit-button {
  display: block;
  margin: 20px auto 0;
  background-color: rgb(29, 29, 184);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 30px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: rgb(23, 23, 250);
  transform: translateY(-3px);
}
</style>
