<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else class="post-test-container">
    <h2>Post-Test Review</h2>
    <div v-if="incorrectQuestion">
      <p>We would like to hear your reasoning for answering the following question from the test:</p>
      <div class="question">
        <img v-if="getQuestionImage(incorrectQuestion.question_number)" :src="getQuestionImage(incorrectQuestion.question_number)" alt="Question related image" class="question-image">
        <label v-html="formatQuestionText(incorrectQuestion)"></label>
        <div v-for="(option, index) in getOptions(incorrectQuestion)" :key="index" class="option">
          <p :class="{'user-answer': userAnswer === option}">
            <strong v-if="!startsWithLabel(option)">{{ optionLabels[index] }}</strong> {{ option }}
          </p>
        </div>
        <p><strong>Your answer was:</strong> {{ userAnswer }}</p>
        <!-- <p><strong>Correct Answer:</strong> {{ getCorrectAnswer() }}</p> -->
      </div>
      <div class="explanation">
        <p>Please explain your reasoning for this answer:</p>
        <textarea v-model="explanation" rows="4" cols="50"></textarea>
      </div>
      <button @click="submitExplanation" class="submit-button">Submit Explanation</button>
    </div>
    <div v-else>
      <p>No incorrect answers found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const user = ref(null);
const loading = ref(true);
const incorrectQuestion = ref(null);
const userAnswer = ref('');
const explanation = ref('');
const router = useRouter();

const optionLabels = ["A", "B", "C", "D", "E"];

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
    await fetchIncorrectQuestion();
  } else {
    router.push('/login'); // Redirect to login if no user is found
  }
  loading.value = false;
};

const fetchIncorrectQuestion = async () => {
  try {
    const { data: incorrectAnswers, error: incorrectAnswersError } = await supabase
      .from('answers')
      .select('*')
      .eq('user_id', user.value.id);

    if (incorrectAnswersError) {
      console.error('Error fetching answers:', incorrectAnswersError.message);
      return;
    }

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError.message);
      return;
    }

    const incorrect = incorrectAnswers.filter(answer => {
      const question = questions.find(q => q.question_number === answer.question_number);
      return question && question.correct_answer !== answer.answer;
    });

    if (incorrect.length > 0) {
      const randomIndex = Math.floor(Math.random() * incorrect.length);
      incorrectQuestion.value = questions.find(q => q.question_number === incorrect[randomIndex].question_number);
      userAnswer.value = incorrect[randomIndex].answer;
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

const getOptions = (question) => {
  return [question.option_1, question.option_2, question.option_3, question.option_4, question.option_5].filter(option => option);
};

const startsWithLabel = (option) => {
  return optionLabels.some(label => option.trim().startsWith(label));
};

const formatQuestionText = (question) => {
  const numberText = question.question_number + '. ';
  const formattedText = question.question_text.replace(/\\n/g, '<br>');
  return numberText + formattedText;
};

const getCorrectAnswer = () => {
  return `${incorrectQuestion.value.correct_answer}`;
};

const getQuestionImage = (questionNumber) => {
  const images = {
    5: "/fci_q5-6.png",
    6: "/fci_q6.png",
    7: "/fci_q7.png",
    8: "/fci_q8-11.png",
    12: "/fci_q12.png",
    14: "/fci_q14.png",
    15: "/fci_q15.png",
    17: "/fci_q17.png",
    18: "/fci_q18.png",
    19: "/fci_q19.png",
    20: "/fci_q20.png",
    21: "/fci_q21-24.png",
    23: "/fci_q23.png",
    28: "/fci_q28.png"
  };

  return images[questionNumber] || null;
};

const submitExplanation = async () => {
  try {
    const { data, error } = await supabase
      .from('explanations')
      .insert({
        user_id: user.value.id,
        question_id: incorrectQuestion.value.id,
        explanation: explanation.value,
      });

    if (error) {
      console.error('Error submitting explanation:', error.message);
      return;
    }

    // Redirect to a thank you page or back to a summary page
    router.push('/thank-you');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

onMounted(() => {
  checkUser();
});
</script>

<style scoped>
.post-test-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  font-family: Arial, sans-serif;
}

.post-test-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: rgb(29, 29, 184);
}

.question {
  margin-bottom: 20px;
}

label {
  display: block;
  color: black;
  font-size: 16px;
  margin-bottom: 10px;
}

.option {
  margin-left: 20px;
}

.user-answer {
  font-weight: bold;
  color: red;
}

.explanation {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  border-radius: 5px;
  padding: 10px;
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
  margin-bottom: 20px;
}
</style>
