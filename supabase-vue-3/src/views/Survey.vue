<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="survey-container">
      <h2>Short Survey on your AI-related opinions.</h2>
      <!-- need to be removed before the final release -->
      <!-- <button @click="selectAllOption1" class="select-all-button">Select All Option 1</button> -->
      <form @submit.prevent="confirmSubmission">
        <div class="question" v-for="(question, index) in surveyQuestions" :key="index">
          <!-- Render question text with line breaks -->
          <div class="question-text">
            <label :for="'question-' + question.question_number" v-html="formatQuestionText(question)"></label>
          </div>

          <!-- Conditionally render image -->
          <img v-if="question.image" :src="question.image" alt="Question related image" class="question-image">

          <!-- Conditionally render additional text -->
          <p v-if="question.additionalText" class="additional-text">{{ question.additionalText }}</p>

          <div class="option" v-for="(option, optionIndex) in getOptions(question)" :key="optionIndex">
            <label class="radio-label" :for="'question-' + question.question_number + '-' + optionIndex">
              <input type="radio"
                :id="'question-' + question.question_number + '-' + optionIndex"
                :name="'question-' + question.question_number"
                :value="optionIndex"
                v-model="answers[question.id]"
              >
              <span class="radio-custom"></span>
              <span class="label-text" v-html="formatOptionText(option)"></span>
            </label>
          </div>
        </div>

        <!-- Old button -->
        <!-- <button type="submit" class="submit-button">Submit Survey and Take the FCI</button> -->

        <button @click="handleFormSubmission" class="submit-button" :disabled="!!formSubmitted.value">Submit Survey and Proceed to FCI.</button>

        <ToastNotification
          :isVisible="showToast"
          title="Submit Survey"
          message="Are you sure you want to submit the survey? This action cannot be undone."
          @confirm="confirmSubmit"
          @cancel="cancelSubmit"
        />
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
import ToastNotification from '../components/ToastNotification.vue';

const user = ref(null);
const loading = ref(true);
const surveyQuestions = ref([]);
const answers = ref([]);
const showToast = ref(false);
const router = useRouter();
const formSubmitted = ref(false);  // New state to track form submission

// Toast notifications
const showToastNotification = () => {
  showToast.value = true;
};

const confirmSubmit = async () => {
  showToast.value = false;
  await submitAnswers();
};

const cancelSubmit = () => {
  showToast.value = false;
};

const checkUser = async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    // console.log("user.value", user.value);
    await checkSubmissionStatus();
  } else {
    router.push('/login'); // Redirect to login if no user is found
  }
};

const checkSubmissionStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles_duplicate')
      .select('has_submitted_survey')
      .eq('user_id', user.value.username)
      .single();

    if (error) {
      console.error('Error checking submission status:', error.message);
      return;
    }

    formSubmitted.value = data?.has_submitted_survey || false;
  } catch (error) {
    console.error('Error checking submission status:', error);
  }
};

const handleFormSubmission = () => {
  if (formSubmitted.value) {
    // console.log('Form has already been submitted.');
    // alert('The form has already been submitted.');
    router.push('/study');
  } else {
    confirmSubmit();
  }
};

const fetchQuestions = async () => {
  try {
    const { data, error } = await supabase
      .from('survey_questions')
      .select('*')
      .order('question_number', { ascending: true });

    if (error) throw error;

    surveyQuestions.value = data || [];
    answers.value = Object.fromEntries(data.map(q => [q.id, '']));
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Handle the error appropriately, e.g., set an error state
  } finally {
    loading.value = false;
  }
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

const submitAnswers = async () => {
  try {
    formSubmitted.value = true;  // Mark the form as submitted
    const surveyEntries = surveyQuestions.value.map((question, index) => ({
      user_id: user.value.username,
      question_id: question.id,
      question_number: index + 1,
      answer: optionMapping[answers.value[question.id]],
    }));

    const { data, error } = await supabase
      .from('survey_answers_duplicate')
      .upsert(surveyEntries, { onConflict: ['user_id', 'question_id'] });

    if (error) {
      console.error('Error submitting survey answers:', error.message);
      formSubmitted.value = false;  // Re-enable the form if there is an error
      return;
    }

    // Update user's submission status on the server
    const { error: updateError } = await supabase
      .from('profiles_duplicate')
      .update({ has_submitted_survey: true })
      .eq('display_name', user.value.username);

    if (updateError) {
      console.error('Error updating submission status:', updateError.message);
      return;
    }

    router.push('/study');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    formSubmitted.value = false;  // Re-enable the form if there is an error
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
  margin-bottom: 60px;
}

.question-text {
  border-left: 4px solid rgb(29, 29, 184);
  padding-left: 15px;
  margin-bottom: 10px;
}
  
  .submit-button:hover {
    background-color: rgb(23, 23, 250);
  }
</style>
