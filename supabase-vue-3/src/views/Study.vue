<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-container">
      <h2>Study Questionnaire</h2>
      <form @submit.prevent="confirmSubmission">
        <div v-for="(question, index) in questions" :key="question.id" class="question">

          <!-- Add images before the corresponding questions -->
          <img v-if="question.question_number === 5" src="/fci_q5-6.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 6" src="/fci_q6.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 8" src="/fci_q8-11.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 12" src="/fci_q12.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 14" src="/fci_q14.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 15" src="/fci_q15.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 17" src="/fci_q17.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 18" src="/fci_q18.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 19" src="/fci_q19.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 20" src="/fci_q20.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 21" src="/fci_q21-24.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 23" src="/fci_q23.png" alt="Question related image" class="question-image">
          <img v-if="question.question_number === 28" src="/fci_q28.png" alt="Question related image" class="question-image">

          <!-- Render question text with line breaks -->
          <label :for="'question-' + question.question_number" v-html="formatQuestionText(question)"></label>

          <!-- Conditionally render image -->
          <img v-if="question.image" :src="question.image" alt="Question related image" class="question-image">

          <!-- Conditionally render additional text -->
          <p v-if="question.additionalText" class="additional-text">{{ question.additionalText }}</p>

          <div class="option" v-for="(option, index) in getOptions(question)" :key="index">
            <input type="checkbox"
              :id="'question-' + question.question_number + '-' + index"
              :name="'question-' + question.question_number"
              :value="option"
              v-model="answers[question.id]"
            >
            <label :for="'question-' + question.question_number + '-' + index">{{ option }}</label>
          </div>

          <!-- Add manual texts at specified positions -->
          <div v-if="question.question_number === 4" class="manual-text">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT TWO QUESTIONS (5 and 6). <br>
              The accompanying figure shows a frictionless channel in the shape of a segment of a circle with a center at "O". The channel has been anchored to a frictionless horizontal table top. You are looking down at the table. Forces exerted by the air are negligible. A ball is shot at high speed into the channel at "p" and exits at "r."
            </p>
          </div>

          <div v-if="question.question_number === 7" class="manual-text">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT FOUR QUESTIONS (8 through 11). <br>
              The figure depicts a hockey puck sliding with constant speed v_o in a straight line from point "a" to point "b" on a frictionless horizontal surface. Forces exerted by the air are negligible. You are looking down on the puck. When the puck reaches point "b," it receives a swift horizontal kick in the direction of the heavy print arrow. Had the puck been at rest at point "b," then the kick would have set the puck in horizontal motion with a speed v_k in the direction of the kick.
            </p>
          </div>

          <div v-if="question.question_number === 14" class="manual-text">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT TWO QUESTIONS (15 and 16). <br>
              A large truck breaks down out on the road and receives a push back into town by a small compact car as shown in the figure below.
            </p>
          </div>

          <div v-if="question.question_number === 20" class="manual-text">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT FOUR QUESTIONS (21 through 24). <br>
              A rocket drifts sideways in outer space from point "a" to point "b" as shown below. The rocket is subject to no outside forces. Starting at position "b", the rocket's engine is turned on and produces a constant thrust (force on the rocket) at right angles to the line "ab". The constant thrust is maintained until the rocket reaches a point "c" in space.
            </p>
          </div>

        </div>
        <button type="submit" class="submit-button">Submit Questionnaire</button>
      </form>
    </div>
  </div>
  <div v-else>
    <p>Please log in to start the study.</p>
    <router-link to="/login">Log in</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const user = ref(null);
const loading = ref(true);
const questions = ref([]);
const answers = ref({});
const router = useRouter();

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
    await fetchQuestions();
  } else {
    router.push('/login'); // Redirect to login if no user is found
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

  // Initialize answers with default "Unchecked"
  questions.value.forEach(question => {
    answers.value[question.id] = [];
  });
};

const getOptions = (question) => {
  // Fetch options from the question object
  return [question.option_1, question.option_2, question.option_3, question.option_4, question.option_5].filter(option => option);
};

const formatQuestionText = (question) => {
  const numberText = question.question_number + '. ';
  // Explicitly replace \n with <br> and log the result for debugging
  const formattedText = question.question_text.replace(/\\n/g, '<br>');
  console.log('Formatted Text:', formattedText); // Debugging line
  return numberText + formattedText;
};

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
      answer: answers.value[question.id].join(', '),
      question_number: question.question_number,
    }));

    const { data: answerData, error: answerError } = await supabase.from('answers').upsert(answerEntries, { onConflict: ['user_id', 'question_id'] });
    if (answerError) {
      console.error('Error submitting answers:', answerError.message);
      return;
    }

    // Navigate to a summary or completion page
    router.push('/summary'); // Assuming you have a summary or completion page
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

onMounted(() => {
  checkUser();
});
</script>

<style scoped>
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
  margin-bottom: 40px; /* Increase space between questions */
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

input[type="checkbox"] {
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
  margin: 20px 0;
}

.additional-text {
  font-style: italic;
  margin-bottom: 20px;
}

.manual-text {
  margin: 20px 0;
  font-weight: bold;
  font-size: 14px;
  color: #333;
}
</style>
