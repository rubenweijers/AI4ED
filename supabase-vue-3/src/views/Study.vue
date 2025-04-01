<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-container">
      <h2>Force Concept Inventory Test #1</h2>
      <form @submit.prevent="confirmSubmission">

        <!-- Removed the two manual text blocks from above the questions loop -->

        <div v-for="(question, index) in questions" :key="question.id" class="question-block">
          
          <!-- Insert the first manual text before question #4 images -->
          <div v-if="question.question_number === 4" class="manual-text manual-text-header">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT FOUR QUESTIONS<br><br>
              A person is sitting on a sled which is on a slope so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.
              <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing with force <i>F<span class="subscript">rocket</span></i> , hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.
            </p>
          </div>
          
          <!-- Insert the second manual text before question #28 images -->
          <div v-if="question.question_number === 28" class="manual-text manual-text-header">
            <p>
              USE THE STATEMENT AND FIGURE BELOW TO ANSWER THE NEXT THREE QUESTIONS<br><br>
              A person is sitting on a sled which is on a slope so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.
              <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing with force <i>F<span class="subscript">rocket</span></i> , hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.
              <br><br><u>This time however, they have equipped the sled with a pressurized air cannon aimed directly up the slope. Firing the cannon releases a sudden, momentary blast of air in the direction it is aimed.</u>
            </p>
          </div>

          <div class="question-images-container">
            <img v-if="question.question_number === 1" src="/fci_2/fci_q1.png" alt="Question 1 related image" class="question-image">
            <img v-if="question.question_number === 4" src="/fci_2/fci_q4-7.png" alt="Question 4-7 related image" class="question-image">
            <img v-if="question.question_number === 4" src="/fci_2/fci_q4.png" alt="Question 4 related image" class="question-image">
            <img v-if="question.question_number === 6" src="/fci_2/fci_q6.png" alt="Question 6 related image" class="question-image">
            <img v-if="question.question_number === 11" src="/fci_2/fci_q11.png" alt="Question 11 related image" class="question-image">
            <img v-if="question.question_number === 12" src="/fci_2/fci_q12.png" alt="Question 12 related image" class="question-image">
            <img v-if="question.question_number === 13" src="/fci_2/fci_q13.png" alt="Question 13 related image" class="question-image">
            <img v-if="question.question_number === 14" src="/fci_2/fci_q14.png" alt="Question 14 related image" class="question-image">
            <img v-if="question.question_number === 16" src="/fci_2/fci_q16.png" alt="Question 16 related image" class="question-image">
            <img v-if="question.question_number === 19" src="/fci_2/fci_q19.png" alt="Question 19 related image" class="question-image">
            <img v-if="question.question_number === 23" src="/fci_2/fci_q23.png" alt="Question 23 related image" class="question-image">
            <img v-if="question.question_number === 24" src="/fci_2/fci_q24.png" alt="Question 24 related image" class="question-image">
            <img v-if="question.question_number === 28" src="/fci_2/fci_q28-30.png" alt="Question 28-30 related image" class="question-image">
            <img v-if="question.question_number === 28" src="/fci_2/fci_q28.png" alt="Question 28 related image" class="question-image">
            <img v-if="question.image" :src="question.image" alt="Question related image" class="question-image">
          </div>

          <label :for="'question-' + question.question_number" v-html="formatQuestionText(question)" class="studyquestion"></label>

          <p v-if="question.additionalText" class="additional-text">{{ question.additionalText }}</p>

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
        <button @click="handleFormSubmission" class="submit-button" :disabled="!!formSubmitted.value">Submit FCI.</button>

      </form>
      <ToastNotification
          :isVisible="showToast"
          title="Submit FCI"
          message="Are you sure you want to submit your results? This action cannot be undone."
          @confirm="confirmSubmit"
          @cancel="cancelSubmit"
        />

      <ToastNotification
          :isVisible="showErrorToast"
          title="Incomplete Submission"
          :message="errorMessage"
          @confirm="closeErrorToast"
        />
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

const showErrorToast = ref(false);
const errorMessage = ref('');

const showErrorPopup = () => {
  showErrorToast.value = true;
};

const closeErrorToast = () => {
  showErrorToast.value = false;
};

const showToastNotification = () => {
  showToast.value = true;
};

const areAllQuestionsAnswered = () => {
  return questions.value.every(question => {
    const answer = answers.value[question.id];
    return answer !== null && answer !== '';
  });
};

const confirmSubmit = async () => {
  showToast.value = false;
  if (areAllQuestionsAnswered()) {
    await submitAnswers();
  } else {
    errorMessage.value = 'Please answer all questions before submitting.';
    showErrorPopup();
  }
};

const cancelSubmit = () => {
  showToast.value = false;
};

const checkUser = async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    // console.log("user.value", user.value);
    await fetchUserProfile();
    await checkSubmissionStatus();
    await fetchQuestions();
  } else {
    router.push('/login');
  }
  loading.value = false;
};

const fetchUserProfile = async () => {
  const { data, error } = await supabase
    .from('2_profiles')
    .select('*')
    .eq('user_id', user.value.username)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
  } else {
    profile.value = data;

    // Check if the user is in the "treatment" or "control" group and set the route accordingly
    if (profile.value.group === 'control') {
      profile.value.routePath = '/TestPost';
    } else if (['experimental_4o', 'experimental_o3'].includes(profile.value.group)) { // Push users to posttest for experimental group
      profile.value.routePath = '/PostTest';
    }
  }
};

const checkSubmissionStatus = async () => {
  try {
      const { data, error } = await supabase
    .from('2_profiles')
    .select('has_submitted_study_one')
    .eq('user_id', user.value.username)
    .single();

    if (error) {
      console.error('Error checking submission status:', error.message);
      return;
    }

    formSubmitted.value = data?.has_submitted_study_one || false;
  } catch (error) {
    console.error('Error checking submission status:', error);
  }
};


const fetchQuestions = async () => {
  try {
    const { data, error } = await supabase
      .from('questions_modified')
      .select('*')
      .order('question_number', { ascending: true });

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('No questions data fetched.');
    }

    questions.value = data;

    // Initialize answers to null
    questions.value.forEach(question => {
      answers.value[question.id] = null;
    });

    loadSavedAnswers();
  } catch (error) {
    console.error('Error in fetchQuestions:', error);
  } finally {
    loading.value = false;
  }
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

const correctAnswers = {
    1: 'C',  2: 'D',  3: 'E',  4: 'A',  5: 'B',
    6: 'C',  7: 'A',  8: 'A',  9: 'A', 10: 'A',
   11: 'B', 12: 'C', 13: 'B', 14: 'A', 15: 'E',
   16: 'D', 17: 'B', 18: 'C', 19: 'C', 20: 'A',
   21: 'C', 22: 'A', 23: 'D', 24: 'D', 25: 'C',
   26: 'B', 27: 'D', 28: 'A', 29: 'E', 30: 'D'
};

// TIMER WATCHER
let timerWatcherInterval;

const setupTimerWatcher = () => {
  timerWatcherInterval = setInterval(() => {
    const remainingTime = getRemainingTime();
    if (remainingTime <= 0) {
      clearInterval(timerWatcherInterval);
      alert('Your study time has ended. Submitting your answers now.');
      submitAnswers();
    }
  }, 1000); // Check every second
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

const optionMapping = ["A", "B", "C", "D", "E"];

// Use the routePath in the handleFormSubmission function
const handleFormSubmission = () => {
  if (formSubmitted.value) {
    // console.log('Form has already been submitted.');
    // alert('The form has already been submitted.');
    router.push(profile.value.routePath);  // Use the determined route
  } else {
    if (areAllQuestionsAnswered()) {
      showToastNotification();
    } else {
      errorMessage.value = 'Please answer all questions before submitting.';
      showErrorPopup();
    }
  }
};


const submitAnswers = async () => {
  try {
    formSubmitted.value = true;
    const answerEntries = questions.value.map(question => {
      const answerIndex = answers.value[question.id];
      let answer = '';
      if (typeof answerIndex !== 'undefined' && answerIndex !== null && answerIndex !== '') {
        answer = optionMapping[answerIndex];
      } else {
        answer = 'unanswered';
      }
      return {
        user_id: user.value.username,
        question_id: question.id,
        answer: answer,
        question_number: question.question_number,
      };
    });

    const { data: answerData, error: answerError } = await supabase
      .from('2_answers_modified')
      .upsert(answerEntries, { onConflict: ['user_id', 'question_id'] });

    if (answerError) {
      console.error('Error submitting answers:', answerError.message);
      formSubmitted.value = false;
      return;
    }

    // If you need to generate a question queue, ensure it uses the correct tables
    await generateQuestionQueue(); // Adjust if necessary

    const { error: updateError } = await supabase
      .from('2_profiles')
      .update({ has_submitted_study_one: true,
        time_end_fci_1: new Date().toISOString()
       })
      .eq('user_id', user.value.username);

    if (updateError) {
      console.error('Error updating submission status:', updateError.message);
      return;
    }

    // Reset the timer to 30 minutes
    const newStartTime = Date.now();
    localStorage.setItem('studyStartTime', newStartTime);
    localStorage.setItem('studyTotalDuration', (40 * 60).toString()); // Set total duration to 35 minutes in seconds
    localStorage.setItem('fifteenMinuteWarningDisplayed', 'false');
    localStorage.setItem('fiveMinuteWarningDisplayed', 'false');

    submissionSuccess.value = true;
    router.push(profile.value.routePath);  // Use the determined route
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    formSubmitted.value = false;
  }
};

const submitAnswer = async (question, optionIndex) => {
  try {
    const answerEntry = {
      user_id: user.value.username,
      question_id: question.id,
      answer: optionMapping[optionIndex],
      question_number: question.question_number,
    };

    const { data, error } = await supabase
      .from('2_answers_modified') // Changed from 'answers_denton' to 2_answers_modified
      .upsert([answerEntry], { onConflict: ['user_id', 'question_id'] });

    if (error) {
      console.error('Error submitting the answer:', error.message);
      return;
    }

    // console.log(`Answer for question ${question.question_number} submitted successfully.`);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

const selectAllOption1 = () => {
  questions.value.forEach(question => {
    answers.value[question.id] = 0;
  });
};

const saveAnswersToLocalStorage = () => {
  localStorage.setItem('studyAnswers', JSON.stringify(answers.value));
};

const loadSavedAnswers = () => {
  const savedAnswers = localStorage.getItem('studyAnswers');
  if (savedAnswers) {
    answers.value = JSON.parse(savedAnswers);
  }
};

watch(answers, saveAnswersToLocalStorage, { deep: true });

// const generateQuestionQueue = async () => {
//   try {
//     // console.log('Starting queue generation');
    
//     // Fetch all user's answers
//     const { data: userAnswers, error: userAnswersError } = await supabase
//       .from('answers_denton')
//       .select('question_number, answer')
//       .eq('user_id', user.value.username);

//     if (userAnswersError) {
//       console.error('Error fetching user answers:', userAnswersError.message);
//       return;
//     }

//     // console.log('User answers:', userAnswers);

//     if (!userAnswers || userAnswers.length === 0) {
//       console.log('No user answers found');
//       return;
//     }

//     // Filter out unanswered questions
//     const answeredUserAnswers = userAnswers.filter(answer => answer.answer !== 'unanswered');

//     if (answeredUserAnswers.length === 0) {
//       console.log('No answered questions to process.');
//       return;
//     }

//     // Fetch correct answers for the answered questions from 'questions_denton'
//     const answeredQuestionNumbers = answeredUserAnswers.map(a => a.question_number);

//     const { data: questionsData, error: questionsError } = await supabase
//       .from('questions_denton')
//       .select('*')
//       .in('question_number', answeredQuestionNumbers);

//     if (questionsError) {
//       console.error('Error fetching questions:', questionsError.message);
//       return;
//     }

//     // console.log('Questions data:', questionsData);

//     if (!questionsData || questionsData.length === 0) {
//       console.log('No questions data found for answered questions.');
//       return;
//     }

//     // Determine incorrect answers by comparing user's answer with correct answer
//     const incorrectQuestionNumbers = [];

//     for (const userAnswer of answeredUserAnswers) {
//       const question = questionsData.find(q => q.question_number === userAnswer.question_number);
//       if (question && question.correct_answer !== userAnswer.answer) {
//         incorrectQuestionNumbers.push(userAnswer.question_number);
//       }
//     }

//     // console.log('Incorrect question numbers:', incorrectQuestionNumbers);

//     if (incorrectQuestionNumbers.length === 0) {
//       // console.log('User got all answers correct, no question queue to generate.');
//       return;
//     }

//     // Fetch incorrect questions' data
//     const { data: incorrectQuestions, error: incorrectQuestionsError } = await supabase
//       .from('questions_denton')
//       .select('*')
//       .in('question_number', incorrectQuestionNumbers);

//     if (incorrectQuestionsError) {
//       console.error('Error fetching incorrect questions:', incorrectQuestionsError.message);
//       return;
//     }

//     const questionsByNumberInCategory = {};

//     for (const question of incorrectQuestions) {
//       const n = question.question_number_in_category;
//       if (!questionsByNumberInCategory[n]) {
//         questionsByNumberInCategory[n] = [];
//       }
//       questionsByNumberInCategory[n].push(question);
//     }

//     const questionQueue = [];

//     const nValues = Object.keys(questionsByNumberInCategory).map(Number).sort((a, b) => a - b);

//     for (const n of nValues) {
//       const questionsAtN = questionsByNumberInCategory[n];
//       questionsAtN.sort(() => Math.random() - 0.5);

//       for (const question of questionsAtN) {
//         questionQueue.push(question.question_number);
//       }
//     }

//     // Attempting to update profile with the new question queue
//     const { data: updateData, error: updateError } = await supabase
//       .from('profiles_duplicate')
//       .update({
//         question_queue: questionQueue,
//         current_question_index: 0,
//       })
//       .eq('user_id', user.value.username);

//     if (updateError) {
//       console.error('Error updating user profile:', updateError.message);
//       return;
//     }

//     console.log('Profile updated with new question queue.');

//     // Update profile.value
//     if (profile.value) {
//       profile.value.question_queue = questionQueue;
//       profile.value.current_question_index = 0;
//     }

//     // Optional: Verify the update after a short delay
//     await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
//     const { data: updatedProfile, error: checkError } = await supabase
//       .from('profiles_duplicate')
//       .select('question_queue')
//       .eq('user_id', user.value.username)
//       .single();

//     if (checkError) {
//       console.error('Error checking updated profile:', checkError);
//     } else {
//       // console.log('Updated question_queue after delay:', updatedProfile.question_queue);
//     }

//   } catch (error) {
//     console.error('An unexpected error occurred:', error);
//   }
// };

// NEW WAY TO GENERATE QUESTION QUEUE
const generateQuestionQueue = async () => {
  try {
    // Step 1: Fetch all user's answers
    const { data: userAnswers, error: userAnswersError } = await supabase
      .from('2_answers_modified')
      .select('question_number, answer')
      .eq('user_id', user.value.username);

    if (userAnswersError) {
      console.error('Error fetching user answers:', userAnswersError.message);
      return;
    }

    if (!userAnswers || userAnswers.length === 0) {
      // console.log('No user answers found');
      return;
    }

    // Filter out unanswered questions
    const answeredUserAnswers = userAnswers.filter(answer => answer.answer !== 'unanswered');

    if (answeredUserAnswers.length === 0) {
      // console.log('No answered questions to process.');
      return;
    }

    // Fetch correct answers for answered questions
    const answeredQuestionNumbers = answeredUserAnswers.map(a => a.question_number);

    const { data: questionsData, error: questionsError } = await supabase
      .from('questions_modified')
      .select('question_number, correct_answer, misconception_category')
      .in('question_number', answeredQuestionNumbers);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError.message);
      return;
    }

    if (!questionsData || questionsData.length === 0) {
      // console.log('No questions data found for answered questions.');
      return;
    }

    // Determine incorrect answers
    const incorrectQuestions = [];

    for (const userAnswer of answeredUserAnswers) {
      const question = questionsData.find(q => q.question_number === userAnswer.question_number);
      if (question && question.correct_answer !== userAnswer.answer) {
        incorrectQuestions.push(question);
      }
    }

    if (incorrectQuestions.length === 0) {
      // console.log('User got all answers correct, no question queue to generate.');
      return;
    }

    // Step 2: Prepare a dictionary of questions by misconception category
    const questionsByCategory = {};

    for (const question of incorrectQuestions) {
      const categories = question.misconception_category.replace(/[\[\]\s]/g, '').split(',');
      for (const category of categories) {
        if (!questionsByCategory[category]) {
          questionsByCategory[category] = [];
        }
        questionsByCategory[category].push(question);
      }
    }

    // Step 3: Generate question queue by sampling categories with replacement
    const questionQueue = [];
    const usedQuestions = new Set();

    // We will loop until we reach a desired length for our question queue
    while (Object.keys(questionsByCategory).some(category => questionsByCategory[category].length > 0)) {
      // Sample a category with replacement
      const availableCategories = Object.keys(questionsByCategory).filter(category => questionsByCategory[category].length > 0);
      const sampledCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];

      // Filter questions within the sampled category that haven't been used
      const eligibleQuestions = questionsByCategory[sampledCategory].filter(q => !usedQuestions.has(q.question_number));

      if (eligibleQuestions.length > 0) {
        // Randomly select one question from the eligible questions
        const sampledQuestion = eligibleQuestions[Math.floor(Math.random() * eligibleQuestions.length)];
        
        // Add the question to the queue
        questionQueue.push(sampledQuestion.question_number);
        usedQuestions.add(sampledQuestion.question_number);
        
        // Remove the question from all categories it belongs to
        const questionCategories = sampledQuestion.misconception_category.replace(/[\[\]\s]/g, '').split(',');
        for (const cat of questionCategories) {
          questionsByCategory[cat] = questionsByCategory[cat].filter(q => q.question_number !== sampledQuestion.question_number);
        }
      }
    }

    // Step 4: Update user profile with the generated question queue
    const { data: updateData, error: updateError } = await supabase
      .from('2_profiles')
      .update({
        question_queue: questionQueue,
        current_question_index: 0,
      })
      .eq('user_id', user.value.username);

    if (updateError) {
      console.error('Error updating user profile:', updateError.message);
      return;
    }

    // console.log('Profile updated with new question queue.');

    // Update profile.value
    if (profile.value) {
      profile.value.question_queue = questionQueue;
      profile.value.current_question_index = 0;
    }

  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};


onMounted(() => {
  checkUser();
  setupTimerWatcher();
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

.question-block {
  margin-top: 30px; /* Added top margin for spacing */
  margin-bottom: 50px;
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