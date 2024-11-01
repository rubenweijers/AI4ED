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

        <!-- Add reminder text for specific question numbers -->
        <!-- Q2 -->
        <div v-if="incorrectQuestion.question_number === 2" class="reminder-text">
          <p><i>Reminder Q2: Two children are playing tug of war. There is a flag marking the middle of the rope as shown in the diagram. Currently, the children are pulling in opposite directions at magnitudes such that the flag translates to the left with a constant speed <i>v<sub>o</sub></i>.</i></p>
        </div>

        <!-- Questions 3 to 7 -->
        <div v-if="incorrectQuestion.question_number >= 3 && incorrectQuestion.question_number <= 7" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i><br>
            A person is sitting on a sled which is on a slope. The slope is so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.

              <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.
          </p>  
          </div>

        <!-- Questions 28 to 30 -->
        <div v-else-if="incorrectQuestion.question_number >= 28 && incorrectQuestion.question_number <= 30" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i> <br>
            A person is sitting on a sled which is on a slope. The slope is so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.

              <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.

              <br><br><u>This time however, they have equipped the sled with a cannon aimed directly up the slope.</u>
            </p>
        </div>

        <!-- Add images before the corresponding questions -->
        <img v-if="incorrectQuestion.question_number === 1 || incorrectQuestion.question_number === 2" src="/fci_2/fci_q1.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number >= 3 && incorrectQuestion.question_number <= 7" src="/fci_2/fci_q4-7.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 4" src="/fci_2/fci_q4.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 6" src="/fci_2/fci_q6.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 11" src="/fci_2/fci_q11.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 12" src="/fci_2/fci_q12.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 13" src="/fci_2/fci_q13.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 14" src="/fci_q14.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 16" src="/fci_2/fci_q16.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 19" src="/fci_2/fci_q19.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 23" src="/fci_2/fci_q23.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 24" src="/fci_2/fci_q24.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number >= 28 && incorrectQuestion.question_number <= 30" src="/fci_2/fci_q28-30.png" alt="Question related image" class="question-image">
        <img v-if="incorrectQuestion.question_number === 28" src="/fci_2/fci_q28.png" alt="Question related image" class="question-image">

        <label v-html="formatQuestionText(incorrectQuestion)"></label>

        <!-- Options Rendering with Conditional Labels -->
        <div v-for="(option, index) in getOptions(incorrectQuestion)" :key="index" class="option">
          <p :class="{'user-answer': userAnswer === option}">
            <template v-if="shouldDisplayLabels(incorrectQuestion.question_number)">
              <strong>{{ optionLabels[index] }}. </strong>
            </template>
            {{ option }}
          </p>
        </div>
        <hr>
        <p><strong>Your answer was:</strong> {{ userAnswer }}</p>
        <!-- Optional: Correct Answer Display -->
        <!-- <p><strong>Correct Answer:</strong> {{ getCorrectAnswer() }}</p> -->
      </div>

      <!-- Explanation Section -->
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
import { ref, onMounted, onUnmounted } from 'vue';
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

// Array of question numbers where labels should be displayed
const questionsWithLabels = [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 29, 30];

// Function to determine if labels should be displayed for a question
const shouldDisplayLabels = (questionNumber) => questionsWithLabels.includes(questionNumber);

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

    // Fetch user's answer from 'answers_denton' table
    const { data: userAnswerData, error: userAnswerError } = await supabase
      .from('answers_denton')
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
  return [
    question.option_1,
    question.option_2,
    question.option_3,
    question.option_4,
    question.option_5
  ].filter(option => option);
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
      const { error } = await supabase
        .from('answers_posttest_denton')
        .upsert(upsertData, { 
          onConflict: 'user_id,question_number',
          returning: 'minimal' 
        });

      if (error) {
        console.error('Error submitting explanation:', error.message);
        return;
      }

      // Call OpenAI API to summarize the explanation
      const summary = await summarizeExplanation(explanation.value);

      // Update the row with the summarized explanation
      const { error: updateError } = await supabase
        .from('answers_posttest_denton')
        .update({ llm_summary: summary })
        .eq('user_id', user.value.username)
        .eq('question_number', incorrectQuestion.value.question_number);

      if (updateError) {
        console.error('Error updating row with summary:', updateError.message);
        return;
      }

    // Update current_question_index
    const newIndex = profile.value.current_question_index;

    const { error: profileUpdateError } = await supabase
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
    console.log('API Key:', import.meta.env.VITE_OPENAI_API_KEY.substring(0, 5) + '...');

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error communicating with the OpenAI API', error);
    return '';
  }
};

let timerWatcherInterval;

onMounted(() => {
  checkUser();
  setupTimerWatcher();
});

const setupTimerWatcher = () => {
  timerWatcherInterval = setInterval(() => {
    const remainingTime = getRemainingTime();
    if (remainingTime <= 0) {
      clearInterval(timerWatcherInterval);
      alert('Your study time has ended. Moving to the next section.');
      router.push('/studyoriginalfci'); // Redirect to the next study phase
    }
  }, 1000);
};

const getRemainingTime = () => {
  const startTime = parseInt(localStorage.getItem('studyStartTime'), 10);
  const totalDuration = parseInt(localStorage.getItem('studyTotalDuration'), 10);
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000); // in seconds
  const timeLeft = totalDuration - elapsed;
  return timeLeft;
};

onUnmounted(() => {
  if (timerWatcherInterval) {
    clearInterval(timerWatcherInterval);
  }
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

/* .user-answer {
  background-color: #e0f7fa;
  border-left: 4px solid #00796b;
  padding-left: 8px;
} */

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
