<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else class="post-test-container">
    <h2>Post-Test Review</h2>
    <div v-if="submissionSuccess" class="success-notification">
      <p>Submission successful! Redirecting...</p>
    </div>
    <div v-else-if="incorrectQuestion">
      <p><strong>We would like to hear your reasoning for answering the following question from the test:</strong></p>
      <div class="question">

        <!-- Add reminder text for question numbers 26 and 27 -->
        <div v-if="incorrectQuestion.question_number === 26 || incorrectQuestion.question_number === 27" class="reminder-text">
          <p><i>Reminder Q25: A woman exerts a constant horizontal force on a large box. As a result, the box moves across a horizontal floor at a constant speed "vo"</i></p>
        </div>

        <div v-if="incorrectQuestion.question_number >= 5 && incorrectQuestion.question_number <= 6" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i><br>
          The accompanying figure shows a frictionless channel in the shape of a segment of a circle with a center at "O". The channel has been anchored to a frictionless horizontal table top. You are looking down at the table. Forces exerted by the air are negligible. A ball is shot at high speed into the channel at "p" and exits at "r."</p>
        </div>

        <div v-else-if="incorrectQuestion.question_number >= 8 && incorrectQuestion.question_number <= 11" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i> <br>
          The figure depicts a hockey puck sliding with constant speed <Katex :expression="'v_o'" /> in a straight line from point "a" to point "b" on a frictionless horizontal surface. Forces exerted by the air are negligible. You are looking down on the puck. When the puck reaches point "b," it receives a swift horizontal kick in the direction of the heavy print arrow. Had the puck been at rest at point "b," then the kick would have set the puck in horizontal motion with a speed <Katex :expression="'v_k'" /> in the direction of the kick.</p>
        </div>

        <div v-else-if="incorrectQuestion.question_number >= 15 && incorrectQuestion.question_number <= 16" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i><br>
          A large truck breaks down out on the road and receives a push back into town by a small compact car as shown in the figure below.</p>
        </div>

        <div v-else-if="incorrectQuestion.question_number >= 21 && incorrectQuestion.question_number <= 24" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i> <br>
          A rocket drifts sideways in outer space from point "a" to point "b" as shown below. The rocket is subject to no outside forces. Starting at position "b", the rocket's engine is turned on and produces a constant thrust (force on the rocket) at right angles to the line "ab". The constant thrust is maintained until the rocket reaches a point "c" in space.</p>
        </div>

        <!-- Add images before the corresponding questions -->
        <img v-if="incorrectQuestion.question_number === 5 || incorrectQuestion.question_number === 6" src="/fci_q5-6.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 6" src="/fci_q6.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 7" src="/fci_q7.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 8" src="/fci_q8.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number >= 8 && incorrectQuestion.question_number <= 11" src="/fci_q8-11.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 12" src="/fci_q12.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 14" src="/fci_q14.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number >= 15 && incorrectQuestion.question_number <= 16" src="/fci_q15-16.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 17" src="/fci_q17.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 18" src="/fci_q18.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 19" src="/fci_q19.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 20" src="/fci_q20.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number >= 21 && incorrectQuestion.question_number <= 24" src="/fci_q21-24.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 23" src="/fci_q23.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 28" src="/fci_q28.png" alt="Question related image" class="question-image">
      

      

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
      <button @click="confirmSubmission" class="submit-button">Submit Explanation</button>
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
const submissionSuccess = ref(false);
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

const confirmSubmission = () => {
  if (confirm("Are you sure you want to submit?")) {
    submitExplanation();
  }
};

const submitExplanation = async () => {
  try {
    const { data, error } = await supabase
      .from('answers_posttest')
      .upsert({
        user_id: user.value.id,
        question_id: incorrectQuestion.value.id,
        question_number: incorrectQuestion.value.question_number,
        explanation: explanation.value,
      }, { onConflict: ['user_id', 'question_id'] });

    if (error) {
      console.error('Error submitting explanation:', error.message);
      return;
    }

    // Display submission success notification
    submissionSuccess.value = true;
    // Navigate to thank you page after a delay
    setTimeout(() => {
      router.push('/chat');
    }, 2000); // Delay for 2 seconds to show the success notification
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

.success-notification {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
