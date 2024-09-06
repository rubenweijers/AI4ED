<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="survey-container">
      <h2>Pre-Study Survey</h2>
      <p>List of Imported Questions</p>
      <!-- need to be removed before the final release -->
      <button @click="selectAllOption1" class="select-all-button">Select All Option 1</button>
      <form @submit.prevent="confirmSubmission">
        <div class="survey-question" v-for="(question, index) in surveyQuestions" :key="index">
          <!-- Render question text with line breaks -->
          <label :for="'question-' + question.question_number" v-html="formatQuestionText(question)"></label>

          <!-- Conditionally render image -->
          <img v-if="question.image" :src="question.image" alt="Question related image" class="question-image">

          <!-- Conditionally render additional text -->
          <p v-if="question.additionalText" class="additional-text">{{ question.additionalText }}</p>

          <div class="option" v-for="(option, optionIndex) in getOptions(question)" :key="optionIndex">
            <input type="radio"
              :id="'question-' + question.question_number + '-' + optionIndex"
              :name="'question-' + question.question_number"
              :value="optionIndex"
              v-model="answers[question.id]"
              @change="submitAnswer(question, optionIndex)"  
            >
            <label :for="'question-' + question.question_number + '-' + optionIndex" v-html="formatOptionText(option)"></label>
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
  const { data, error } = await supabase.from('survey_questions').select('*').order('question_number', { ascending: true });
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

const getOptions = (question) => {
  return [question.option_1, question.option_2, question.option_3, question.option_4, question.option_5].filter(option => option);
};

const formatQuestionText = (question) => {
  const numberText = question.question_number + '. ';
  const formattedText = question.question_text.replace(/\\n/g, '<br>');
  return numberText + formattedText;
};

const formatOptionText = (option) => {
  const formattedOption = option.replace(/_sub_(.*?)_end_/g, '<span class="subscript">$1</span>');
  return formattedOption;
};

const optionMapping = ["A", "B", "C", "D", "E"];

const confirmSubmission = () => {
  if (confirm("Are you sure you want to submit?")) {
    submitSurvey();
  }
};

const submitSurvey = async () => {
  try {
    const userId = user.value.id;
    const surveyEntries = surveyQuestions.value.map((question, index) => ({
      user_id: userId,
      question_id: question.id,
      question_number: index + 1,
      answer: optionMapping[answers.value[question.id]],
    }));

    const { data, error } = await supabase
      .from('survey_answers')
      .upsert(surveyEntries, { onConflict: ['user_id', 'question_id'] });

    if (error) {
      console.error('Error submitting survey answers:', error.message);
      return;
    }

    alert('Survey submission successful! Thank you for your feedback.');
    //TODO, add final survey
    // router.push('/ThankYou.vue');
    console.log('route to study')
    setTimeout(() => {
      router.push('/study');
    }, 2000);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

// Submit individual answer for a question
const submitAnswer = async (question, optionIndex) => {
  try {
    const userId = user.value.id;
    const surveyEntry = {
      user_id: userId,
      question_id: question.id,
      question_number: question.question_number,
      answer: optionMapping[optionIndex],
    };

    const { data, error } = await supabase
      .from('survey_answers')
      .upsert([surveyEntry], { onConflict: ['user_id', 'question_id'] });

    if (error) {
      console.error('Error submitting the answer:', error.message);
      return;
    }

    console.log(`Answer for question ${question.question_number} submitted successfully.`);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

// need to be removed before the final release
const selectAllOption1 = () => {
  surveyQuestions.value.forEach(question => {
    answers.value[question.id] = 0;
  });
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

 /* Copy Pasted from Study.vue */
.option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
