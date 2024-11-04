<template>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else-if="user">
      <div class="study-container">
        <h2>Force Concept Inventory.</h2>
        <button @click="selectAllOption1" class="select-all-button">Select All Option 1</button>
        <form @submit.prevent="confirmSubmission">
          <div v-for="(question, index) in questions" :key="question.id">
            <!-- Add images before the corresponding questions -->
            <img v-if="question.question_number === 5" src="/fci_q5-6.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 6" src="/fci_q6.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 7" src="/fci_q7.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 8" src="/fci_q8-11.png" alt="Question related image" class="question-image-range">
            <img v-if="question.question_number === 8" src="/fci_q8.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 12" src="/fci_q12.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 14" src="/fci_q14.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 15" src="/fci_q15-16.png" alt="Question related image" class="question-image-range">
            <img v-if="question.question_number === 17" src="/fci_q17.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 18" src="/fci_q18.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 19" src="/fci_q19.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 20" src="/fci_q20.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 21" src="/fci_q21-24.png" alt="Question related image" class="question-image-range">
            <img v-if="question.question_number === 21" src="/fci_q21.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 23" src="/fci_q23.png" alt="Question related image" class="question-image">
            <img v-if="question.question_number === 28" src="/fci_q28.png" alt="Question related image" class="question-image">
  
            <!-- Render question text with line breaks -->
            <label :for="'question-' + question.question_number" v-html="formatQuestionText(question)" class="studyquestion"></label>
  
            <!-- Conditionally render image -->
            <img v-if="question.image" :src="question.image" alt="Question related image" class="question-image">
  
            <!-- Conditionally render additional text -->
            <p v-if="question.additionalText" class="additional-text">{{ question.additionalText }}</p>
  
            <div class="option" v-for="(option, optionIndex) in getOptions(question)" :key="optionIndex">
              <label class="radio-label" :for="'question-' + question.question_number + '-' + optionIndex">
                <input type="radio"
                  :id="'question-' + question.question_number + '-' + optionIndex"
                  :name="'question-' + question.question_number"
                  :value="optionIndex"
                  v-model="answers[question.id]"
                  @change="submitAnswer(question, optionIndex)"
                >
                <span class="radio-custom"></span>
                <span class="label-text" v-html="formatOptionText(option)"></span>
              </label>
            </div>
  
            <!-- Add manual texts at specified positions -->
            <div v-if="question.question_number === 4" class="manual-text">
              <p>
                USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT TWO QUESTIONS (5 and 6).<br>
                The accompanying figure shows a frictionless channel in the shape of a segment of a circle with a center at <i>O</i>. The channel has been anchored to a frictionless horizontal table top. You are looking down at the table. Forces exerted by the air are negligible. A ball is shot at high speed into the channel at <i>p</i> and exits at <i>r</i>.
              </p>
            </div>
            <div v-if="question.question_number === 7" class="manual-text">
              <p>
                USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT FOUR QUESTIONS (8 through 11). <br>
                The figure below depicts a hockey puck sliding with constant speed <i>v<span class="subscript">o</span></i> in a straight line from point <i>a</i> to point <i>b</i> on a frictionless horizontal surface. Forces exerted by the air are negligible. You are looking down on the puck. When the puck reaches point <i>b</i>, it receives a swift horizontal kick in the direction of the heavy print arrow. Had the puck been at rest at point <i>a</i>, then the kick would have set the puck in horizontal motion with a speed <i>v<span class="subscript">k</span></i> in the direction of the kick.
              </p>
            </div>
  
            <div v-if="question.question_number === 14" class="manual-text">
              <p>
                USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT TWO QUESTIONS (15 and 16). <br>
                A large truck breaks down out on the road and receives a push back into town by a small compact car as shown in the figure below.
              </p>
            </div>
  
            <div v-if="question.question_number === 20" class="manual-text">
              <p>
                USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT FOUR QUESTIONS (21 through 24). <br>
                A rocket drifts sideways in outer space from point <i>a</i> to point <i>b</i> as shown below. The rocket is subject to no outside forces. Starting at position <i>b</i>, the rocket's engine is turned on and produces a constant thrust (force on the rocket) at right angles to the line <i>ab</i>. The constant thrust is maintained until the rocket reaches a point <i>c</i> in space.
              </p>
            </div>
  
          </div>
          <!-- Old button! --> 
          <!-- <button type="submit" class="submit-button">Submit Questionnaire</button> -->
          
          <button @click="showToastNotification" class="next-button">Submit Survey.</button>
  
          <ToastNotification
            :isVisible="showToast"
            title="Submit FCI"
            message="Are you sure you want to submit your results? This action cannot be undone."
            @confirm="confirmSubmit"
            @cancel="cancelSubmit"
          />
        </form>
        <div v-if="submissionSuccess" class="success-notification">
          <p>Submission successful!</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Please log in to start the study.</p>
      <router-link to="/login">Log in</router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '../supabase';
  import ToastNotification from '../components/ToastNotification.vue';
  
  const user = ref(null);
  const loading = ref(true);
  const questions = ref([]);
  const answers = ref({});
  const router = useRouter();
  const submissionSuccess = ref(false);
  const showToast = ref(false);
  
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
  
  const checkUser = async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
      console.log("user.value",user.value)
      await fetchQuestions();
    } else {
      router.push('/login'); // Redirect to login if no user is found
    }
    loading.value = false;
  };
  
  const fetchQuestions = async () => {
    const { data, error } = await supabase.from('questions').select('*').order('question_number', { ascending: true });
    if (error) {
      console.error('Error fetching questions:', error.message);
      return;
    }
    questions.value = data;
  
    // Initialize answers with empty string
    questions.value.forEach(question => {
      answers.value[question.id] = '';
    });
  
    // Load saved answers from localStorage
    loadSavedAnswers();
  };
  
  const getOptions = (question) => {
    return [question.option_1, question.option_2, question.option_3, question.option_4, question.option_5].filter(option => option);
  };
  
  const formatQuestionText = (question) => {
    const numberText = question.question_number + '. ';
    const formattedText = question.question_text.replace(/\\n/g, '<br>');
    return numberText + formattedText;
  };
  
  const formatOptionText = (option) => {
    const formattedOption = option.replace(/_sub_(.*?)_end_/g, '<span class="subscript">$1</span>');
    return formattedOption;
  };
  
  const optionMapping = ["A", "B", "C", "D", "E"];
  
  // const confirmSubmission = () => {
  //   if (confirm("Are you sure you want to submit?")) {
  //     submitAnswers();
  //   }
  // };
  
  const submitAnswers = async () => {
    try {
      const userId = user.value.id;
      console.log("userId",userId)
      const answerEntries = questions.value.map(question => ({
        user_id: userId,
        question_id: question.id,
        answer: optionMapping[answers.value[question.id]],
        question_number: question.question_number,
      }));
  
      const { data: answerData, error: answerError } = await supabase.from('answers_duplicate').upsert(answerEntries, { onConflict: ['user_id', 'question_id'] });
      if (answerError) {
        console.error('Error submitting answers:', answerError.message);
        return;
      }
      submissionSuccess.value = true;
      router.push('/PostTest');
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  
  const submitAnswer = async (question, optionIndex) => {
    try {
      const userId = user.value.id;
      const answerEntry = {
        user_id: userId,
        question_id: question.id,
        answer: optionMapping[optionIndex],
        question_number: question.question_number,
      };
  
      const { data, error } = await supabase
        .from('answers_duplicate')
        .upsert([answerEntry], { onConflict: ['user_id', 'question_id'] });
  
      if (error) {
        console.error('Error submitting the answer:', error.message);
        return;
      }
  
      console.log(`Answer for question ${question.question_number} submitted successfully.`);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  
  const selectAllOption1 = () => {
    questions.value.forEach(question => {
      answers.value[question.id] = 0;
    });
  };
  
  // Save answers to localStorage
  const saveAnswersToLocalStorage = () => {
    localStorage.setItem('studyAnswers', JSON.stringify(answers.value));
  };
  
  // Load answers from localStorage
  const loadSavedAnswers = () => {
    const savedAnswers = localStorage.getItem('studyAnswers');
    if (savedAnswers) {
      answers.value = JSON.parse(savedAnswers);
    }
  };
  
  // Watch for changes in answers and save to localStorage
  watch(answers, saveAnswersToLocalStorage, { deep: true });
  
  onMounted(() => {
    checkUser();
  });
  </script>
  
  <style scoped>
  .subscript {
    vertical-align: sub;
    font-size: smaller;
  }
  
  .study-info-container {
    text-align: center;
    margin: 50px auto;
    padding: 20px;
    max-width: 800px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .next-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: rgb(29, 29, 184);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .next-button:hover {
    background-color: rgb(23, 23, 250);
  }
  
  .select-all-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: rgb(29, 29, 184);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .select-all-button:hover {
    background-color: rgb(23, 23, 250);
  }
  
  .study-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    font-family: Arial, sans-serif;
  }
  
  .study-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: rgb(29, 29, 184);
  }
  
  label {
    display: block;
    color: black; /* Ensure text is black */
    /* font-size: 16px; */
    margin-bottom: 10px;
  }
  
  /* Old radio */
  /* .option {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 16px;
    padding: 5px 0;
  }
  
  .option:hover {
      background-color: #f9f9f9;
      border-radius: 10px;
    }
  
  input[type="radio"] {
    margin-right: 10px;
    margin-top: -10px;
  } */
  
  .studyquestion {
    margin-top: 60px;
    border-left: 4px solid rgb(29, 29, 184);
    padding-left: 15px;
    margin-bottom: 10px;
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
    margin: 0px 0;
    margin-top: 20px;
  }
  
  .question-image-range {
    max-width: 100%;
    margin: 0px 0;
    margin-top: -80px;
    margin-bottom: 100px; /* Increase margin to bottom */
  }
  
  .horizontal-line {
    border-top: 1px solid #ccc; /* Add horizontal line */
    margin: 20px 0;
  }
  
  .additional-text {
    font-style: italic;
    margin-bottom: 20px;
  }
  
  .manual-text {
    margin: 40px ;
    font-weight: bold;
    font-size: 16px;
    color: #333;
    margin-bottom: 100px;
  }
  
  .success-notification {
    text-align: center;
    margin: 20px auto;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border-radius: 5px;
    width: fit-content;
  }
  
  /* .question {
    margin-top: 80px;
    border-left: 4px solid rgb(29, 29, 184);
    padding-left: 10px;
    height: 50px;
    display: inline-block;
  } */
  
  </style>
  