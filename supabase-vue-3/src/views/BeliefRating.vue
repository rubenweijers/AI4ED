<template>
  <div class="belief-rating-container">
    <h2>Check the Summary</h2>
    <p v-if="loading">Loading...</p>
    <template v-else>
      <p>We summarized your explanation into one sentence:</p>
      <div class="sentence-block">
        "{{ sentence }}"
      </div>
      <!-- <p>How much do you believe in this summarized explanation?</p> OLD BELIEF RATING -->
      <p>Is this an accurate summary of your reasoning?</p>
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
        title="Submit Accuracy Rating"
        message="Are you sure you want to confirm your accuracy rating in the summary? This action cannot be undone."
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

const sentence = ref('');
const profile = ref(null);
const selectedRating = ref(null);
const submissionSuccess = ref(false);
const loading = ref(true);
const router = useRouter();
const showToast = ref(false);
const user = ref(null);

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

// OLD RATING LABELS
// const ratingLabels = [
//   { value: 0, text: 'Definitely False' },
//   { value: 25, text: 'Probably False' },
//   { value: 50, text: 'Uncertain' },
//   { value: 75, text: 'Probably True' },
//   { value: 100, text: 'Definitely True' },
// ];

const ratingLabels = [
  { value: 0, text: 'Completely accurate' },
  { value: 25, text: 'Mostly accurate' },
  { value: 50, text: 'Part accurate, part inaccurate' },
  { value: 75, text: 'Mostly inaccurate' },
  { value: 100, text: 'Completely inaccurate' },
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
    const profileData = profile.value;

    if (!profileData) {
      console.error('Profile data not available');
      alert('An error occurred while fetching your data. Please try again.');
      return;
    }

    const questionQueue = profileData.question_queue;
    const currentQuestionIndex = profileData.current_question_index || 0;

    const questionNumber = questionQueue[currentQuestionIndex];

    // Fetch the newest row based on created_at for this user and question
    const { data, error } = await supabase
      .from('2_posttest_answers')
      .select('llm_summary, created_at')
      .eq('user_id', user.value.username)
      .eq('question_number', questionNumber)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching summary:', error);
      alert('An error occurred while fetching the summary. Please try again.');
      return;
    }
    // The following line is for Luke's testing purpose:
    // data.llm_summary = "I love physics"
    if (data && data.llm_summary) {
      sentence.value = data.llm_summary;
      // console.log('Summary fetched, created at:', data.created_at);
    } else {
      console.error('No summary found for the user');
      alert('No summary found. Please try again.');
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
};

const submitAnswers = async () => {
  if (selectedRating.value === null) {
    alert('Please select a rating before submitting.');
    return;
  }

  try {
    const profileData = profile.value;

    if (!profileData) {
      console.error('Profile data not available');
      alert('An error occurred while fetching your data. Please try again.');
      return;
    }

    const questionQueue = profileData.question_queue;
    const currentQuestionIndex = profileData.current_question_index || 0;

    const questionNumber = questionQueue[currentQuestionIndex];

    const { data, error } = await supabase
      .from('2_posttest_answers')
      .update({ 'belief_rating_1': selectedRating.value })
      .eq('user_id', user.value.username)
      .eq('question_number', questionNumber);

    if (error) {
      console.error('Error submitting rating:', error);
      alert('An error occurred while submitting your rating. Please try again.');
      return;
    }

    submissionSuccess.value = true;

    // Check if current question index is 0
    if (currentQuestionIndex === 0) {
      router.push('/prechat');
    } else {
      router.push('/chat');
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

.success-notification {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  margin-top: 20px;
}
</style>