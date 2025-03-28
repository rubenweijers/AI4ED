<template>
    <div class="feedback-container">
      <h2>We would really appreciate your feedback!</h2>
      <p>Before going to the final page, please help us improve by leaving comments or suggestions about your experience:</p>
      <textarea
        v-model="feedbackText"
        placeholder="Enter your feedback here..."
        rows="10"
      ></textarea>
      <button @click="submitFeedback" :disabled="isSubmitting">Submit Feedback</button>
    </div>
</template>
  
<script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '../supabase';
  
  export default {
    name: 'Feedback',
    setup() {
      const feedbackText = ref('');
      const isSubmitting = ref(false);
      const router = useRouter();
      const user = ref(null);
  
      const checkUser = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
          user.value = JSON.parse(userData);
        } else {
          router.push('/login');
        }
      };
  
      const submitFeedback = async () => {
        if (feedbackText.value.trim() === '') {
          alert('Please enter your feedback before submitting.');
          return;
        }
        isSubmitting.value = true;
  
        try {
          // Update the 'feedback' column in 'profiles_duplicate' table
          const { error } = await supabase
            .from('2_profiles')
            .update({ feedback: feedbackText.value })
            .eq('user_id', user.value.username);
  
          if (error) {
            console.error('Error submitting feedback:', error.message);
            alert('An error occurred while submitting your feedback. Please try again.');
            isSubmitting.value = false;
            return;
          }
  
          // Redirect to thankyou.vue
          router.push('/thankyou');
        } catch (error) {
          console.error('An unexpected error occurred:', error);
          alert('An unexpected error occurred. Please try again.');
          isSubmitting.value = false;
        }
      };
  
      onMounted(() => {
        checkUser();
      });
  
      return { feedbackText, submitFeedback, isSubmitting };
    },
  };
  </script>
  
  <style scoped>
  .feedback-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    font-family: Arial, sans-serif;
  }
  
  .feedback-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: rgb(29, 29, 184);
  }
  
  .feedback-container textarea {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
  }
  
  .feedback-container button {
    display: block;
    width: 100%;
    background-color: rgb(29, 29, 184);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .feedback-container button:hover {
    background-color: rgb(23, 23, 250);
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
  