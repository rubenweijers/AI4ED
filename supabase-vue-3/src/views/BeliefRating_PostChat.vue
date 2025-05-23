<template>
  <div class="belief-rating-container">
    <h2>Re-Check your statement</h2>
    <p v-if="loading">Loading...</p>
    <template v-else>
      <p>Now that you've had a chance to converse with the AI, we'd like to revisit the original question. Your initial statement was:</p>
      <div class="sentence-block">
        "{{ sentence }}"
      </div>
      <!-- <p>On a scale of 0% to 100%, please indicate your level of confidence that this statement is true.</p> -->
      <p>Did you find talking with the AI helped improve your understanding of this question that you originally answered incorrectly?</p>
      <div class="rating-scale">
        <label v-for="(label, index) in ratingLabels" :key="index">
          <input
            type="radio"
            name="belief-rating"
            :value="label.value"
            v-model="selectedRating"
          />
          {{ label.text }}
        </label>
      </div>
      <button @click="showToastNotification" class="submit-button">Submit</button>
      <ToastNotification
        :isVisible="showToast"
        title="Submit Rating"
        message="Are you sure you want to confirm your rating in the statement? This action cannot be undone."
        @confirm="confirmSubmit"
        @cancel="cancelSubmit"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import ToastNotification from '../components/ToastNotification.vue';

const user = ref(null);
const sentence = ref('');
const profile = ref(null);
const selectedRating = ref(null);
const submissionSuccess = ref(false);
const loading = ref(true);
const router = useRouter();
const showToast = ref(false);

// Toast notifications
const showToastNotification = () => {
  if (profile.value.current_question_index > 0) {
    // Directly proceed without showing the toast
    confirmSubmit();
  } else {
    showToast.value = true;
  }
};

const confirmSubmit = async () => {
  showToast.value = false;
  await submitAnswers();
};

const cancelSubmit = () => {
  showToast.value = false;
};

// OLD RATINGLABELS
// const ratingLabels = [
//   { value: 0, text: 'Definitely False' },
//   { value: 25, text: 'Probably False' },
//   { value: 50, text: 'Uncertain' },
//   { value: 75, text: 'Probably True' },
//   { value: 100, text: 'Definitely True' },
// ];

const ratingLabels = [
  { value: 0, text: 'Very helpful' },
  { value: 25, text: 'Fairly helpful' },
  { value: 50, text: 'Uncertain' },
  { value: 75, text: 'Fairly unhelpful' },
  { value: 100, text: 'Very unhelpful' },
];

const checkUser = async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    // console.log("user.value", user.value);
    await fetchUserProfile();
  } else {
    router.push('/login');
  }
};

const fetchUserProfile = async () => {
  const { data, error } = await supabase
    .from('2_profiles')
    .select('*')
    .eq('user_id', user.value.username)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    alert('An error occurred while fetching your data. Please try again.');
  } else {
    profile.value = data;
  }
};

const fetchSummary = async () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
    } else {
      // console.log('User not authenticated');
      router.push('/login');
      return;
    }

    // Fetch profile data to get question queue and current index
    const { data: profileData, error: profileError } = await supabase
      .from('2_profiles')
      .select('*')
      .eq('user_id', user.value.username)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError.message);
      alert('An error occurred while fetching your data. Please try again.');
      return;
    }

    const questionQueue = profileData.question_queue;
    const currentQuestionIndex = profileData.current_question_index || 0; // Adjusted here

    const questionNumber = questionQueue[currentQuestionIndex];

    // Fetch llm_summary from posttest table for this question
    const { data, error } = await supabase
      .from('2_posttest_answers')
      // .select('llm_summary')
      .select('explanation') // GET USER EXPLANATION
      .eq('user_id', user.value.username)
      .eq('question_number', questionNumber)
      .maybeSingle(); // Use maybeSingle

    if (error) {
      console.error('Error fetching summary:', error.message);
      alert('An error occurred while fetching the summary. Please try again.');
      return;
    }

    if (data && data.explanation) {
      // sentence.value = data.llm_summary; GET LLM SUMMARY <OLD CODE>
      sentence.value = data.explanation; // GET LLM SUMMARY
    } else {
      console.error('No explanation found for the user');
      alert('No explanation found. Please try again.');
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  } finally {
    loading.value = false;
  }
};

const submitAnswers = async () => {
  if (selectedRating.value === null) {
    alert('Please select a rating before submitting.');
    return;
  }

  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
    } else {
      // console.log('User not authenticated');
      router.push('/login');
      return;
    }

    // Fetch profile data to get question queue and current index
    const { data: profileData, error: profileError } = await supabase
      .from('2_profiles')
      .select('*')
      .eq('user_id', user.value.username)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError.message);
      alert('An error occurred while fetching your data. Please try again.');
      return;
    }

    const questionQueue = profileData.question_queue;
    const currentQuestionIndex = profileData.current_question_index || 0; // Adjusted here

    const questionNumber = questionQueue[currentQuestionIndex];

    // Update belief_rating_2 in answers_posttest_denton for this question
    const { error } = await supabase
      .from('2_posttest_answers')
      .update({ belief_rating_2: selectedRating.value })
      .eq('user_id', user.value.username)
      .eq('question_number', questionNumber);

    if (error) {
      console.error('Error submitting rating:', error.message);
      alert('An error occurred while submitting your rating. Please try again.');
      return;
    }

    submissionSuccess.value = true;

    // Increment current_question_index
    const updatedIndex = (profileData.current_question_index || 0) + 1; // Adjusted here

    // Update current_question_index in profiles_duplicate
    const { error: updateError } = await supabase
      .from('2_profiles')
      .update({ current_question_index: updatedIndex })
      .eq('user_id', user.value.username); // Use .username

    if (updateError) {
      console.error('Error updating current_question_index:', updateError.message);
      alert('An error occurred while updating your progress. Please try again.');
      return;
    }

    // Check if there are more questions
    if (updatedIndex < questionQueue.length) {
      // More questions to process
      router.push('/posttest');
    } else {
      // All questions completed
      const newStartTime = Date.now();
      clearInterval(timerWatcherInterval);
      localStorage.setItem('studyStartTime', newStartTime.toString());
      localStorage.setItem('studyTotalDuration', (30 * 60).toString()); // Set to 30 minutes in seconds
      router.push('/studyoriginalfci'); // Ensure you have a ThankYou.vue component or appropriate route
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
};

let timerWatcherInterval;

onMounted(async () => {
  await checkUser();
  await fetchSummary();
  setupTimerWatcher();
  loading.value = false;
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
.belief-rating-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  font-family: Arial, sans-serif;
}

.belief-rating-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: rgb(29, 29, 184);
}

.sentence-block {
  background-color: #f0f0f0;
  border-left: 4px solid rgb(29, 29, 184);
  padding: 15px;
  margin-bottom: 20px;
  font-size: 18px;
  line-height: 1.4;
  color: #333;
}

.rating-scale {
  margin-bottom: 20px;
}

label {
  display: block;
  color: black;
  font-size: 16px;
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

.success-notification {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  margin-top: 20px;
}
</style>