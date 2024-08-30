<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-container">
      <h2>Force Concept Inventory</h2>
      <button @click="selectAllOption1" class="select-all-button">Select All Option 1</button>
      <form @submit.prevent="confirmSubmission">
        <div v-for="(question, index) in questions" :key="question.id" class="question">
          <!-- Add images before the corresponding questions -->
          <img v-if="question.question_number === 5" src="/fci_q5-6.png" alt="Question related image" class="question-image">
          <!-- ... (other image conditions) ... -->

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

          <!-- Add manual texts at specified positions -->
          <div v-if="question.question_number === 4" class="manual-text">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT TWO QUESTIONS (5 and 6). <br>
              The accompanying figure shows a frictionless channel in the shape of a segment of a circle with a center at <i>O</i>. The channel has been anchored to a frictionless horizontal table top. You are looking down at the table. Forces exerted by the air are negligible. A ball is shot at high speed into the channel at <i>p</i> and exits at <i>r</i>.
            </p>
          </div>
          <!-- ... (other manual texts) ... -->

        </div>
        <button type="submit" class="submit-button">Submit Questionnaire</button>
      </form>
      <div v-if="submissionSuccess" class="success-notification">
        <p>Submission successful!</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Please log in to start the study.</p>
    <router-link to="/login">Log in</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const user = ref(null);
const loading = ref(true);
const questions = ref([]);
const answers = ref({});
const router = useRouter();
const submissionSuccess = ref(false);

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
    await fetchQuestions();
  } else {
    router.push('/login');
  }
  loading.value = false;
};

const fetchQuestions = async () => {
  const { data, error } = await supabase.from('questions').select('*').order('question_number', { ascending: true });
  if (error) {
    console.error('Error fetching questions:', error.message);
    return;
  }
  questions.value = data;

  // Initialize answers with empty string
  questions.value.forEach(question => {
    answers.value[question.id] = '';
  });

  // Load saved answers from localStorage
  loadSavedAnswers();
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
    submitAnswers();
  }
};

const submitAnswers = async () => {
  try {
    const userId = user.value.id;

    const answerEntries = questions.value.map(question => ({
      user_id: userId,
      question_id: question.id,
      answer: optionMapping[answers.value[question.id]],
      question_number: question.question_number,
    }));

    const { data: answerData, error: answerError } = await supabase.from('answers').upsert(answerEntries, { onConflict: ['user_id', 'question_id'] });
    if (answerError) {
      console.error('Error submitting answers:', answerError.message);
      return;
    }
    submissionSuccess.value = true;
    setTimeout(() => {
      router.push('/PostTest');
    }, 2000);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

const submitAnswer = async (question, optionIndex) => {
  try {
    const userId = user.value.id;
    const answerEntry = {
      user_id: userId,
      question_id: question.id,
      answer: optionMapping[optionIndex],
      question_number: question.question_number,
    };

    const { data, error } = await supabase
      .from('answers')
      .upsert([answerEntry], { onConflict: ['user_id', 'question_id'] });

    if (error) {
      console.error('Error submitting the answer:', error.message);
      return;
    }

    console.log(`Answer for question ${question.question_number} submitted successfully.`);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

const selectAllOption1 = () => {
  questions.value.forEach(question => {
    answers.value[question.id] = 0;
  });
};

// Save answers to localStorage
const saveAnswersToLocalStorage = () => {
  localStorage.setItem('studyAnswers', JSON.stringify(answers.value));
};

// Load answers from localStorage
const loadSavedAnswers = () => {
  const savedAnswers = localStorage.getItem('studyAnswers');
  if (savedAnswers) {
    answers.value = JSON.parse(savedAnswers);
  }
};

// Watch for changes in answers and save to localStorage
watch(answers, saveAnswersToLocalStorage, { deep: true });

onMounted(() => {
  checkUser();
});
</script>

<style scoped>
.subscript {
  vertical-align: sub;
  font-size: smaller;
}

.study-info-container {
  text-align: center;
  margin: 50px auto;
  padding: 20px;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.next-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: rgb(29, 29, 184);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.next-button:hover {
  background-color: rgb(23, 23, 250);
}

.select-all-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: rgb(29, 29, 184);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.select-all-button:hover {
  background-color: rgb(23, 23, 250);
}

.study-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  font-family: Arial, sans-serif;
}

.study-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: rgb(29, 29, 184);
}

.question {
  margin-bottom: 100px; /* Increase space between questions */
}

label {
  display: block;
  color: black; /* Ensure text is black */
  font-size: 16px;
  margin-bottom: 10px;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

input[type="radio"] {
  margin-right: 10px;
}

.submit-button {
  display: block;
  width: 100%;
  background-color: rgb(29, 29, 184);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: rgb(23, 23, 250);
}

.question-image {
  max-width: 100%;
  margin: 0px 0;
}

.question-image-range {
  max-width: 100%;
  margin: 0px 0;
  margin-top: -80px;
  margin-bottom: 100px; /* Increase margin to bottom */
}

.horizontal-line {
  border-top: 1px solid #ccc; /* Add horizontal line */
  margin: 20px 0;
}

.additional-text {
  font-style: italic;
  margin-bottom: 20px;
}

.manual-text {
  margin: 40px ;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.success-notification {
  text-align: center;
  margin: 20px auto;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  width: fit-content;
}
</style>
