<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-container">
      <h2>Force Concept Inventory Test #2</h2>
      <form @submit.prevent="confirmSubmission">
        <div v-for="(question, index) in questions" :key="question.id" class="question-block">

          <!-- Insert manual texts at specified question numbers -->
          <div v-if="question.question_number === 5" class="manual-text manual-text-header">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT TWO QUESTIONS (5 and 6).<br>
              The accompanying figure shows a frictionless channel in the shape of a segment of a circle with a center at <i>O</i>. The channel has been anchored to a frictionless horizontal table top. You are looking down at the table. Forces exerted by the air are negligible. A ball is shot at high speed into the channel at <i>p</i> and exits at <i>r</i>.
            </p>
          </div>
          <div v-if="question.question_number === 8" class="manual-text manual-text-header">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT FOUR QUESTIONS (8 through 11). <br>
              The figure below depicts a hockey puck sliding with constant speed <i>v<span class="subscript">o</span></i> in a straight line from point <i>a</i> to point <i>b</i> on a frictionless horizontal surface. Forces exerted by the air are negligible. You are looking down on the puck. When the puck reaches point <i>b</i>, it receives a swift horizontal kick in the direction of the heavy print arrow. Had the puck been at rest at point <i>a</i>, then the kick would have set the puck in horizontal motion with a speed <i>v<span class="subscript">k</span></i> in the direction of the kick.
            </p>
          </div>
          <div v-if="question.question_number === 15" class="manual-text manual-text-header">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT TWO QUESTIONS (15 and 16). <br>
              A large truck breaks down out on the road and receives a push back into town by a small compact car as shown in the figure below.
            </p>
          </div>
          <div v-if="question.question_number === 21" class="manual-text manual-text-header">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT FOUR QUESTIONS (21 through 24). <br>
              A rocket drifts sideways in outer space from point <i>a</i> to point <i>b</i> as shown below. The rocket is subject to no outside forces. Starting at position <i>b</i>, the rocket's engine is turned on and produces a constant thrust (force on the rocket) at right angles to the line <i>ab</i>. The constant thrust is maintained until the rocket reaches a point <i>c</i> in space.
            </p>
          </div>

          <!-- Group all question images together -->
          <div class="question-images-container">
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
            <img v-if="question.image" :src="question.image" alt="Question related image" class="question-image">
          </div>

          <!-- Render the question text -->
          <label :for="'question-' + question.question_number" v-html="formatQuestionText(question)" class="studyquestion"></label>
          
          <!-- Render additional text if provided -->
          <p v-if="question.additionalText" class="additional-text">{{ question.additionalText }}</p>

          <!-- Loop through answer options -->
          <div class="options-container">
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
          </div>

        </div>
        <button @click="handleFormSubmission" class="next-button">Submit FCI.</button>
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
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import ToastNotification from '../components/ToastNotification.vue';

const user = ref(null);
const profile = ref(null);
const loading = ref(true);
const questions = ref([]);
const answers = ref({});
const router = useRouter();
const submissionSuccess = ref(false);
const showToast = ref(false);
const formSubmitted = ref(false);

// --- Timer Specific Variable ---
let timerWatcherInterval = null; // Holds the interval ID

const showToastNotification = () => {
  showToast.value = true;
};

const confirmSubmit = async () => {
  showToast.value = false;
  // Check if all questions are answered before submitting manually
  const unanswered = questions.value.filter(question => answers.value[question.id] === '');
  if (unanswered.length > 0) {
    alert('Please answer all questions before submitting.');
    return;
  }
  await submitAnswers();
};

const cancelSubmit = () => {
  showToast.value = false;
};

const checkUser = async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    await fetchUserProfile();
    await checkSubmissionStatus(); // Check if already submitted *before* fetching questions/starting timer
    if (!formSubmitted.value) { // Only fetch questions if not submitted
        await fetchQuestions();
    } else {
        // If already submitted, maybe redirect immediately?
        // console.log("User already submitted, redirecting...");
        // router.push('/feedback'); // Or appropriate "already done" page
        // Or just show a message and disable the form
        loading.value = false; // Ensure loading state is handled
        return; // Stop further setup if already submitted
    }
  } else {
    router.push('/login');
  }
  loading.value = false; // Set loading false after checks/fetches
};

const fetchUserProfile = async () => {
  // No changes needed here
  const { data, error } = await supabase
    .from('2_profiles')
    .select('*')
    .eq('user_id', user.value.username)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
  } else {
    profile.value = data;
  }
};

const checkSubmissionStatus = async () => {
    // No changes needed here
  const { data, error } = await supabase
    .from('2_profiles')
    .select('has_submitted_survey') // Ensure this field name is correct for *this* survey
    .eq('user_id', user.value.username)
    .single();

  if (error) {
    console.error('Error checking submission status:', error.message);
    return;
  }

  formSubmitted.value = data?.has_submitted_survey || false;
};

const fetchQuestions = async () => {
    // No changes needed here
  const { data, error } = await supabase.from('questions').select('*').order('question_number', { ascending: true });
  if (error) {
    console.error('Error fetching questions:', error.message);
    return;
  }
  questions.value = data;

  questions.value.forEach(question => {
    answers.value[question.id] = ''; // Initialize with empty string
  });

  loadSavedAnswers(); // Load any previously saved (but not submitted) answers
};

const getOptions = (question) => {
    // No changes needed here
  return [question.option_1, question.option_2, question.option_3, question.option_4, question.option_5].filter(option => option);
};

const formatQuestionText = (question) => {
    // No changes needed here
  const numberText = question.question_number + '. ';
  const formattedText = question.question_text.replace(/\\n/g, '<br>');
  return numberText + formattedText;
};

const formatOptionText = (option) => {
    // No changes needed here
  const formattedOption = option.replace(/_sub_(.*?)_end_/g, '<span class="subscript">$1</span>');
  return formattedOption;
};

const optionMapping = ["A", "B", "C", "D", "E"];

const handleFormSubmission = () => {
  // This function now triggers the confirmation popup first
  // The actual check for all answers is inside confirmSubmit
  if (formSubmitted.value) {
     // If somehow the button is clicked after submission, redirect or inform
     // console.log("Form already submitted.");
     router.push('/feedback'); // Or the correct post-submission page
  } else {
     showToastNotification(); // Show confirmation popup
  }
};


// --- Simplified Timer Functions ---

const clearTimer = () => {
  if (timerWatcherInterval) {
    clearInterval(timerWatcherInterval);
    timerWatcherInterval = null;
  }
  // Clear timer-related localStorage items
  localStorage.removeItem('studyStartTime');
  localStorage.removeItem('studyTotalDuration');
  // Optional: Clear warning flags if they are used elsewhere for this timer
  localStorage.removeItem('fifteenMinuteWarningDisplayed');
  localStorage.removeItem('fiveMinuteWarningDisplayed');
  // console.log("Timer cleared.");
};

const getRemainingTime = () => {
  const startTime = parseInt(localStorage.getItem('studyStartTime'), 10);
  const totalDuration = parseInt(localStorage.getItem('studyTotalDuration'), 10);

  // Check if timer values are valid in localStorage
  if (isNaN(startTime) || isNaN(totalDuration)) {
    // console.error("Timer values not found or invalid in localStorage.");
    return 0; // Treat as expired if values are missing/invalid
  }

  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000); // Elapsed time in seconds
  let remaining = totalDuration - elapsed;

  // Ensure remaining time doesn't go negative
  return remaining < 0 ? 0 : remaining;
};

const setupTimerWatcher = () => {
  // Clear any previous interval before starting a new one
  if (timerWatcherInterval) {
    clearInterval(timerWatcherInterval);
  }

  // console.log("Setting up timer watcher...");
  timerWatcherInterval = setInterval(() => {
    const remainingTime = getRemainingTime();
    // console.log(`Remaining time: ${remainingTime} seconds`); // For debugging

    if (remainingTime <= 0) {
      // Timer expired
      // We don't need to call clearTimer() here because submitAnswers() will call it.
      // We do need to stop the interval itself though.
      clearInterval(timerWatcherInterval);
      timerWatcherInterval = null;
      // console.log("Timer expired. Submitting answers.");
      alert('Your study time has ended. Submitting your answers now.');
      submitAnswers(); // Submit whatever answers are present
    }
    // Add warnings logic here if needed based on remainingTime
    // e.g., check for 15 min, 5 min remaining and display warnings
  }, 1000); // Check every second
};

// --- End Simplified Timer Functions ---


const submitAnswers = async () => {
  // If already submitting or submitted, prevent concurrent submissions
  if (formSubmitted.value && submissionSuccess.value) {
      // console.log("Submission already succeeded.");
      return;
  }
   if (formSubmitted.value && !submissionSuccess.value){
      // console.log("Submission in progress or previously failed and retrying.");
      // Allow retry? Or prevent? For now, let's assume retry is okay.
   }

  try {
    formSubmitted.value = true; // Mark as submitted early to prevent duplicates
    const answerEntries = questions.value.map(question => {
      const answerIndex = answers.value[question.id];
      // Handle cases where an answer might not be selected (empty string or null/undefined)
      const answer = (typeof answerIndex !== 'undefined' && answerIndex !== null && answerIndex !== '')
        ? optionMapping[answerIndex]
        : 'unanswered'; // Mark explicitly as unanswered if needed

      return {
        user_id: user.value.username,
        question_id: question.id,
        answer: answer,
        question_number: question.question_number,
      };
    });

    // console.log("Submitting answers:", answerEntries);

    const { error: answerError } = await supabase
      .from('2_answers_original') // Ensure this table name is correct
      .upsert(answerEntries, { onConflict: ['user_id', 'question_id'] });

    if (answerError) {
      console.error('Error submitting answers:', answerError.message);
      formSubmitted.value = false; // Reset submission status on error
      alert(`Failed to submit answers: ${answerError.message}`); // Inform user
      return; // Stop execution
    }

    // console.log("Answers submitted to Supabase.");

    const { error: updateError } = await supabase
      .from('2_profiles')
      .update({
          has_submitted_survey: true, // Ensure this field name is correct
          time_end_fci_2: new Date().toISOString() // Record submission time
       })
      .eq('user_id', user.value.username);

    if (updateError) {
      console.error('Error updating submission status:', updateError.message);
      // Note: Answers were submitted, but status update failed. Decide how to handle this.
      // Maybe still proceed but log the error?
      alert(`Answers submitted, but failed to update profile status: ${updateError.message}`);
      // Don't reset formSubmitted.value here, as answers *were* saved.
    } else {
        // console.log("Profile submission status updated.");
    }

    submissionSuccess.value = true; // Mark submission as fully successful
    clearTimer(); // Clear the timer *after* successful submission
    // console.log("Submission successful, navigating to feedback...");
    router.push('/feedback'); // Navigate to the next page (e.g., feedback or thank you)

  } catch (error) {
    console.error('An unexpected error occurred during submission:', error);
    formSubmitted.value = false; // Reset status on unexpected errors
    alert(`An unexpected error occurred: ${error.message}`); // Inform user
  }
};


// --- Local Storage for Answers ---

const saveAnswersToLocalStorage = () => {
  // Only save if the form hasn't been successfully submitted
  if (!submissionSuccess.value) {
    localStorage.setItem('studyAnswers2', JSON.stringify(answers.value));
  } else {
    // Optionally clear saved answers after successful submission
    localStorage.removeItem('studyAnswers2');
  }
};

const loadSavedAnswers = () => {
  // Only load if the form hasn't been submitted yet
  if (!formSubmitted.value) {
    const savedAnswers = localStorage.getItem('studyAnswers2');
    if (savedAnswers) {
      try {
        answers.value = JSON.parse(savedAnswers);
      } catch (e) {
        console.error("Error parsing saved answers from localStorage", e);
        localStorage.removeItem('studyAnswers2'); // Clear corrupted data
      }
    }
  }
};

// Watch answers to save them progressively
watch(answers, saveAnswersToLocalStorage, { deep: true });


// --- Lifecycle Hooks ---

onMounted(async () => {
  // console.log("Component mounted. Checking user and setting up timer.");
  await checkUser(); // Check user, profile, and submission status first

  // Only set up the timer if the user hasn't already submitted
  if (!formSubmitted.value) {
    // console.log("Form not submitted. Initializing timer...");
    // --- Start New 30-Minute Timer ---
    const totalDuration = 30 * 60; // 30 minutes in seconds
    const newStartTime = Date.now();
    localStorage.setItem('studyStartTime', newStartTime.toString());
    localStorage.setItem('studyTotalDuration', totalDuration.toString());
    // Reset warning flags (optional, depending on if you use them)
    localStorage.setItem('fifteenMinuteWarningDisplayed', 'false');
    localStorage.setItem('fiveMinuteWarningDisplayed', 'false');
    // console.log(`Timer started. Start time: ${newStartTime}, Duration: ${totalDuration}s`);
    // --- End New Timer ---

    setupTimerWatcher(); // Start watching the timer
  } else {
    // console.log("Form already submitted. Timer not started.");
    // Optionally, redirect or show a message if already submitted
    router.push('/feedback'); // Redirect if already done
  }
});

onUnmounted(() => {
  // console.log("Component unmounting. Clearing timer.");
  // Clean up the timer interval and related localStorage when the component is destroyed
  clearTimer();
});

// --- Development/Helper Functions (Keep if needed) ---
const submitAnswer = async (question, optionIndex) => {
  // This saves individual answers immediately - useful for robustness but can increase DB load.
  // Consider if this is necessary alongside saving all answers to localStorage.
  // Ensure it doesn't conflict with the final submission logic.
  // Maybe only enable this if `saveAnswersToLocalStorage` fails?

  // Basic implementation (ensure table/column names match final submission):
  const answerEntry = {
    user_id: user.value.username,
    question_id: question.id,
    answer: optionMapping[optionIndex],
    question_number: question.question_number,
  };

  const { error } = await supabase
    .from('2_answers_original') // Ensure correct table
    .upsert([answerEntry], { onConflict: ['user_id', 'question_id'] });

  if (error) {
    console.error('Error submitting single answer:', error.message);
  } else {
    // console.log(`Answer for question ${question.question_number} saved individually.`);
  }
};

const selectAllOption1 = () => { // For testing/debugging
  questions.value.forEach(question => {
    answers.value[question.id] = 0; // 0 corresponds to Option A
  });
};


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
  margin-bottom: 10px;
}

/* Old radio buttons - Left aligned and instant update */
.option {
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
  margin-top: -2px;
  cursor: pointer;
  accent-color: rgb(29, 29, 184); /* Ensures immediate color update */
}

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
  display: block;
}

.radio-label {
  display: block;
  width: 100%;
  cursor: pointer;
}

.question-block {
  margin-top: 30px; /* Added top margin for spacing */
  margin-bottom: 100px;
}

.additional-text {
  font-style: italic;
  margin-bottom: 20px;
}

.manual-text {
  margin: 40px 0;
  padding: 15px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 5px;
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  font-weight: bold;
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

</style>
