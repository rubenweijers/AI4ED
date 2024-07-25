<template>
    <div class="belief-rating-container">
      <h2>Re-Rate Your Belief</h2>
      <p v-if="loading">Loading...</p>
      <template v-else>
        <p>Now that you've had a chance to converse with the AI, we'd like to get back to some of the questions we asked at the beginning of the survey. At the outset of this survey, you suggested that:</p>
        <div class="sentence-block">
          "{{ sentence }}"
        </div>
        <p>On a scale of 0% to 100%, please indicate your level of confidence that this statement is true.</p>
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
        <button class="submit-button" @click="submitRating">Submit</button>
        <div v-if="submissionSuccess" class="success-notification">
          Your rating has been submitted successfully!
        </div>
      </template>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '../supabase';
  
  const sentence = ref('');
  const selectedRating = ref(null);
  const submissionSuccess = ref(false);
  const loading = ref(true);
  const router = useRouter();
  
  const ratingLabels = [
    { value: 0, text: 'Definitely False' },
    { value: 25, text: 'Probably False' },
    { value: 50, text: 'Uncertain' },
    { value: 75, text: 'Probably True' },
    { value: 100, text: 'Definitely True' },
  ];
  
  const fetchSummary = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log('User not authenticated');
        router.push('/login');
        return;
      }
  
      const user = userData.user;
  
      const { data, error } = await supabase
        .from('answers_posttest')
        .select('llm_summary')
        .eq('user_id', user.id)
        .single();
  
      if (error) {
        console.error('Error fetching summary:', error);
        alert('An error occurred while fetching the summary. Please try again.');
        return;
      }
  
      if (data && data.llm_summary) {
        sentence.value = data.llm_summary;
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
  
  const submitRating = async () => {
    if (selectedRating.value === null) {
      alert('Please select a rating before submitting.');
      return;
    }
  
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log('User not authenticated');
        router.push('/login');
        return;
      }
  
      const user = userData.user;
  
      const { data, error } = await supabase
        .from('answers_posttest')
        .update({ '2_belief_rating': selectedRating.value })
        .eq('user_id', user.id);
  
      if (error) {
        console.error('Error submitting rating:', error);
        alert('An error occurred while submitting your rating. Please try again.');
        return;
      }
  
      submissionSuccess.value = true;
      setTimeout(() => {
        router.push('/Home'); // Adjust the route as needed
      }, 2000);
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