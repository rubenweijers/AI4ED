<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else class="post-test-container">
    <h2>Question Review</h2>
    <div v-if="submissionSuccess" class="success-notification">
      <p>Submission successful! Redirecting...</p>
    </div>
    <div v-else-if="incorrectQuestion">
      <p><strong>We would like to hear your reasoning for answering the following question from the test:</strong></p>
      <hr>
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
          The figure depicts a hockey puck sliding with constant speed <i>v<sub>o</sub></i> in a straight line from point "a" to point "b" on a frictionless horizontal surface. Forces exerted by the air are negligible. You are looking down on the puck. When the puck reaches point "b," it receives a swift horizontal kick in the direction of the heavy print arrow. Had the puck been at rest at point "b," then the kick would have set the puck in horizontal motion with a speed <i>v<sub>k</sub></i> in the direction of the kick.</p>
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
        <hr>
        <p><strong>Your answer was:</strong> {{ userAnswer }}</p>
        <!-- <p><strong>Correct Answer:</strong> {{ getCorrectAnswer() }}</p> -->
      </div>
      <div class="explanation">
        <p>Please explain your reasoning for this answer in at least 10 words:</p>
        <textarea v-model="explanation" rows="4" cols="50"></textarea>
      </div>
      <button @click="showToastNotification" class="submit-button">Submit</button>

        <ToastNotification
          :isVisible="showToast"
          title="Submit Explanation"
          message="Are you sure you want to submit your explanation? This action cannot be undone."
          @confirm="confirmSubmit"
          @cancel="cancelSubmit"
        />
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
import axios from 'axios';
import ToastNotification from '../components/ToastNotification.vue';

const user = ref(null);
const profile = ref(null);
const loading = ref(true);
const incorrectQuestion = ref(null);
const userAnswer = ref('');
const explanation = ref('');
const submissionSuccess = ref(false);
const router = useRouter();
const showToast = ref(false);
const optionLabels = ["A", "B", "C", "D", "E"];

// Toast notifications
const showToastNotification = () => {
  showToast.value = true;
};
const confirmSubmit = async () => {
  showToast.value = false;
  await checkValid();
};
const cancelSubmit = () => {
  showToast.value = false;
};

const checkUser = async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    await fetchUserProfile();
    await fetchIncorrectQuestion();
  } else {
    router.push('/login'); // Redirect to login if no user is found
  }
  loading.value = false;
};

const fetchUserProfile = async () => {
  const { data, error } = await supabase
    .from('profiles_duplicate')
    .select('*')
    .eq('user_id', user.value.username)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error.message);
  } else if (data === null) {
    console.error('No profile found for user');
    // Handle case where no profile is found
  } else {
    profile.value = data;
  }
};

const fetchIncorrectQuestion = async () => {
  try {
    if (!profile.value.question_queue || profile.value.question_queue.length === 0) {
      console.error('No question queue found. Please complete the FCI test first.');
      alert('No question queue found. Please complete the FCI test first.');
      router.push('/study'); // Redirect to the study page
      return;
    }

    const currentIndex = profile.value.current_question_index || 0;
    const questionQueue = profile.value.question_queue;

    if (currentIndex >= questionQueue.length) {
      // No more questions to display
      incorrectQuestion.value = null;
      return;
    }

    const nextQuestionNumber = questionQueue[currentIndex];

    // Fetch the question from 'questions_denton' table
    const { data: questionData, error: questionError } = await supabase
      .from('questions_denton')
      .select('*')
      .eq('question_number', nextQuestionNumber)
      .single();

    if (questionError) {
      console.error('Error fetching question:', questionError.message);
      return;
    }

    incorrectQuestion.value = questionData;

    // Fetch user's answer from 'answers_duplicate' table
    const { data: userAnswerData, error: userAnswerError } = await supabase
      .from('answers_duplicate')
      .select('answer')
      .eq('user_id', user.value.username)
      .eq('question_number', nextQuestionNumber)
      .single();

    if (userAnswerError) {
      console.error('Error fetching user answer:', userAnswerError.message);
      return;
    }

    userAnswer.value = userAnswerData.answer || '';
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

const isExplanationValid = () => {
  if (!explanation.value || explanation.value.trim().length === 0) {
    alert("Please provide an explanation before submitting.");
    return false;
  }

  const wordCount = explanation.value.trim().split(/\s+/).length;
  if (wordCount < 10) {
    alert("Your explanation is too short. Please provide a more detailed explanation containing at least 10 words.");
    return false;
  }

  return true;
};

const checkValid = () => {
  if (isExplanationValid()) {
    submitExplanation();
  }
};

const submitExplanation = async () => {
    try {
      // Prepare the data to upsert
      const upsertData = {
        user_id: user.value.username,
        question_number: incorrectQuestion.value.question_number,
        explanation: explanation.value,
      };

      // Perform the upsert operation
      const { data, error } = await supabase
        .from('answers_posttest_duplicate')
        .upsert(upsertData, { 
          onConflict: 'user_id,question_number',
          returning: 'minimal' 
        });

      if (error) {
        console.error('Error submitting explanation:', error.message);
        return;
      }

      // const insertedRow = data[0]; // Get the inserted or updated row

      // Call OpenAI API to summarize the explanation
      const summary = await summarizeExplanation(explanation.value);

      // Update the row with the summarized explanation
      const { error: updateError } = await supabase
        .from('answers_posttest_duplicate')
        .update({ llm_summary: summary })
        .eq('user_id', user.value.username)
        .eq('question_number', incorrectQuestion.value.question_number);

      if (updateError) {
        console.error('Error updating row with summary:', updateError.message);
        return;
      }

    // Update current_question_index
    const newIndex = profile.value.current_question_index;

    const { data: updateData, error: profileUpdateError } = await supabase
      .from('profiles_duplicate')
      .update({
        current_question_index: newIndex,
      })
      .eq('user_id', user.value.username);

    if (profileUpdateError) {
      console.error('Error updating current_question_index:', profileUpdateError.message);
    } else {
      profile.value.current_question_index = newIndex;
    }

    // Display submission success notification
    submissionSuccess.value = true;
    
    // Log user data and profile data before navigation
    console.log('User data:', user.value);
    console.log('Profile data:', profile.value);

    // Navigate to belief rating page
    await router.push('/beliefrating');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

const summarizeExplanation = async (explanation) => {
  const apiData = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Summarize the following passage, which describes a misconception, in a single sentence. Do not mention that it is a misconception, or a belief, or provide any kind of normative judgment. Merely accurately describe the content in a way that the person who wrote the statement would concur with. Frame it as an assertion. If the statement is already short, no need to change it very much. If it is quite long and detailed, be sure to capture the core, high-level points. Do not focus on the evidence provided for the belief --merely focus on the basic assertion",
      },
      { role: "user", content: explanation },
    ],
    max_tokens: 100,
    temperature: 0.7,
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
    });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error communicating with the OpenAI API', error);
    return '';
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
