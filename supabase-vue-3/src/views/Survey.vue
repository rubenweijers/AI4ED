<template>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else-if="user">
      <div class="survey-container">
        <h2>Post-Study Survey</h2>
        <p>Imported Questions</p>
        <form @submit.prevent="submitSurvey">
          <div class="survey-question" v-for="(question, index) in surveyQuestions" :key="index">
            <label :for="'question-' + index">{{ question.text }}</label>
            <div class="likert-scale" v-if="question.type === 'likert'">
              <div v-for="option in likertOptions" :key="option.value" class="likert-option">
                <input type="radio" :id="'question-' + index + '-' + option.value" :name="'question-' + index" :value="option.value" v-model="answers[index]" />
                <label :for="'question-' + index + '-' + option.value">{{ option.label }}</label>
              </div>
            </div>
            <div v-else-if="question.type === 'textarea'">
              <textarea :id="'question-' + index" v-model="answers[index]" rows="3"></textarea>
            </div>
          </div>
          <button type="submit" class="submit-button">Submit Survey</button>
        </form>
      </div>
    </div>
    <div v-else>
      <p>Please log in to complete the survey.</p>
      <router-link to="/login">Log in</router-link>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '../supabase';
  
  const user = ref(null);
  const loading = ref(true);
  const surveyQuestions = ref([
    { text: 'How would you rate your overall experience with the LLM?', type: 'likert' },
    { text: 'Please provide any comments about your overall experience.', type: 'textarea' },
    { text: "Did you feel that the model's teaching style matched your learning style?", type: 'likert' },
    { text: 'How accurately did the LLM reflect your identified learning style?', type: 'likert' },
    { text: 'Please provide any comments about how well the LLM reflected your learning style.', type: 'textarea' },
    { text: 'How useful did you find the LLM for learning the content?', type: 'likert' },
    { text: 'Do you feel that you learned more effectively with the LLM tailored to your learning style?', type: 'likert' },
    { text: 'Please provide any comments about the usefulness of the LLM for learning.', type: 'textarea' },
    { text: 'How engaging did you find the interaction with the LLM?', type: 'likert' },
    { text: 'Did you find the LLM easy to interact with?', type: 'likert' },
    { text: 'Please provide any comments about your engagement and interaction with the LLM.', type: 'textarea' },
    { text: 'Do you believe that the learning style adaptation made a difference in your learning compared to standard methods?', type: 'likert' },
    { text: 'How would you compare this experience to traditional learning methods?', type: 'likert' },
    { text: 'Please provide any comments comparing this method to traditional learning methods.', type: 'textarea' },
    { text: 'Would you use an LLM adapted to your learning style for future learning?', type: 'likert' },
    { text: 'Would you recommend this learning method to others?', type: 'likert' },
    { text: 'Please provide any suggestions for improving the LLM learning experience.', type: 'textarea' },
    { text: 'Is there anything else you would like to share about your experience with the LLM?', type: 'textarea' }
  ]);
  
  const likertOptions = [
    { value: '1', label: 'Strongly disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Neither agree nor disagree' },
    { value: '4', label: 'Agree' },
    { value: '5', label: 'Strongly agree' }
  ];
  
  const answers = ref(surveyQuestions.value.map(() => ''));
  
  const router = useRouter();
  
  const checkUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      user.value = currentUser;
    } else {
      router.push('/login'); // Redirect to login if no user is found
    }
    loading.value = false;
  };
  
  const submitSurvey = async () => {
    try {
      const userId = user.value.id;
      console.log('User ID:', userId); // Log the user ID to ensure it's correct
  
      const surveyEntries = surveyQuestions.value.map((question, index) => ({
        user_id: userId,
        question: question.text,
        answer: answers.value[index],
      }));
  
      const { data: surveyData, error: surveyError } = await supabase.from('survey').insert(surveyEntries);
      if (surveyError) {
        console.error('Error submitting survey:', surveyError.message);
        return;
      }
  
      console.log('Survey submitted successfully:', surveyData);
  
      // Show success message
      alert('Survey submission successful! Thank you for your feedback.');
  
      // Redirect to a thank you or home page
      router.push('/');
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  
  onMounted(() => {
    checkUser();
  });
</script>
  
<style scoped>
  .survey-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  
  .survey-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: rgb(29, 29, 184); 
  }
  
  .survey-question {
    margin-bottom: 20px;
  }
  
  .survey-question label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: black;
    font-size: 16px;
  }
  
  .likert-scale {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  .likert-option {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .likert-option label {
    margin-top: 5px;
    font-size: 14px;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .submit-button {
    display: block;
    margin: 20px auto 0;
    background-color: rgb(29, 29, 184);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 12px 30px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover {
    background-color: rgb(23, 23, 250);
    transform: translateY(-3px);
  }
</style>
  