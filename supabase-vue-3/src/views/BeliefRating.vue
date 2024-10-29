<template>
    <div class="belief-rating-container">
      <h2>Rate Your Belief</h2>
      <p v-if="loading">Loading...</p>
      <template v-else>
        <p>We summarized your explanation into one sentence:</p>
        <div class="sentence-block">
          "{{ sentence }}"
        </div>
        <p>How much do you believe in this summarized explanation?</p>
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
          title="Submit Belief Rating"
          message="Are you sure you want to confirm your belief rating in the statement? This action cannot be undone."
          @confirm="confirmSubmit"
          @cancel="cancelSubmit"
        />
      </template>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import ToastNotification from '../components/ToastNotification.vue';

const sentence = ref('');
const selectedRating = ref(null);
const submissionSuccess = ref(false);
const loading = ref(true);
const router = useRouter();
const showToast = ref(false);
const user = ref(null);

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

const ratingLabels = [
  { value: 0, text: 'Definitely False' },
  { value: 25, text: 'Probably False' },
  { value: 50, text: 'Uncertain' },
  { value: 75, text: 'Probably True' },
  { value: 100, text: 'Definitely True' },
];

const fetchSummary = async () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
    } else {
      console.log('User not authenticated');
      router.push('/login');
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles_duplicate')
      .select('*')
      .eq('user_id', user.value.username)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError.message);
      alert('An error occurred while fetching your data. Please try again.');
      return;
    }

    const questionQueue = profileData.question_queue;
    const currentQuestionIndex = (profileData.current_question_index || 0);

    const questionNumber = questionQueue[currentQuestionIndex];

    // Fetch the newest row based on created_at for this user and question
    const { data, error } = await supabase
      .from('answers_posttest_duplicate')
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

    if (data && data.llm_summary) {
      sentence.value = data.llm_summary;
      console.log('Summary fetched, created at:', data.created_at);
    } else {
      console.error('No summary found for the user');
      alert('No summary found. Please try again.');
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
      console.log('User not authenticated');
      router.push('/login');
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles_duplicate')
      .select('*')
      .eq('user_id', user.value.username)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError.message);
      alert('An error occurred while fetching your data. Please try again.');
      return;
    }

    const questionQueue = profileData.question_queue;
    const currentQuestionIndex = (profileData.current_question_index || 0);

    const questionNumber = questionQueue[currentQuestionIndex];

    const { data, error } = await supabase
      .from('answers_posttest_duplicate')
      .update({ 'belief_rating_1': selectedRating.value })
      .eq('user_id', user.value.username)
      .eq('question_number', questionNumber);

    if (error) {
      console.error('Error submitting rating:', error);
      alert('An error occurred while submitting your rating. Please try again.');
      return;
    }

    // // Remove chat data from localStorage
    // localStorage.removeItem('chatData');

    submissionSuccess.value = true;
    router.push('/prechat'); // Adjust the route as needed
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
};

onMounted(() => {
  fetchSummary();
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