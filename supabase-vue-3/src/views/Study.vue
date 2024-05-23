<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-container">
      <h2>Study Questionnaire</h2>
      <form @submit.prevent="confirmSubmission">
        <div v-for="question in questions" :key="question.id" class="question">
          <div class="option">
            <input type="checkbox"
              :id="'question-' + question.question_number"
              :name="'question-' + question.question_number"
              v-model="answers[question.id]"
            >
          </div>
          <label :for="'question-' + question.question_number">{{ question.question_number }}. {{ question.question_text }}</label>
        </div>
        <button type="submit" class="submit-button">Submit Questionnaire</button>
      </form>
    </div>
  </div>
  <div v-else>
    <p>Please log in to start the study.</p>
    <router-link to="/login">Log in</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const user = ref(null);
const loading = ref(true);
const questions = ref([]);
const answers = ref({});
const router = useRouter();

const learningStyleQuestions = {
  activist: [2, 4, 6, 10, 17, 23, 24, 32, 34, 38, 40, 43, 45, 48, 58, 64, 71, 72, 74, 79],
  reflector: [7, 13, 15, 16, 25, 28, 29, 31, 33, 36, 39, 41, 46, 52, 55, 60, 62, 66, 67, 76],
  theorist: [1, 3, 8, 12, 14, 18, 20, 22, 26, 30, 42, 47, 51, 57, 61, 63, 68, 75, 77, 78],
  pragmatist: [5, 9, 11, 19, 21, 27, 35, 37, 44, 49, 50, 53, 54, 56, 59, 65, 69, 70, 73, 80]
};

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
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
  console.log('Raw fetched data:', data);
  if (data.length === 0) {
    console.warn('No questions found in the database.');
  } else {
    console.log('Fetched questions:', data);
  }
  questions.value = data;

  // Initialize answers with default "Unchecked"
  questions.value.forEach(question => {
    answers.value[question.id] = false;
  });
};

const confirmSubmission = () => {
  if (confirm("Are you sure you want to submit?")) {
    submitAnswers();
  }
};

const submitAnswers = async () => {
  try {
    const userId = user.value.id;
    console.log('User ID:', userId); // Log the user ID to ensure it's correct

    const answerEntries = questions.value.map(question => ({
      user_id: userId,
      question_id: question.id,
      answer: answers.value[question.id] ? 'Checked' : 'Unchecked',
      question_number: question.question_number,
    }));

    const { data: answerData, error: answerError } = await supabase.from('answers').upsert(answerEntries, { onConflict: ['user_id', 'question_id'] });
    if (answerError) {
      console.error('Error submitting answers:', answerError.message);
      return;
    }

    // Calculate learning style scores
    const scores = {
      activist: 0,
      reflector: 0,
      theorist: 0,
      pragmatist: 0
    };

    questions.value.forEach(question => {
      if (answers.value[question.id]) {
        if (learningStyleQuestions.activist.includes(question.question_number)) {
          scores.activist++;
        }
        if (learningStyleQuestions.reflector.includes(question.question_number)) {
          scores.reflector++;
        }
        if (learningStyleQuestions.theorist.includes(question.question_number)) {
          scores.theorist++;
        }
        if (learningStyleQuestions.pragmatist.includes(question.question_number)) {
          scores.pragmatist++;
        }
      }
    });

    // Determine dominant learning style
    const dominantLearningStyle = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    console.log('Scores:', scores);
    console.log('Dominant Learning Style:', dominantLearningStyle);

    // Update user profile with scores and dominant learning style
    const { data: profileData, error: profileError } = await supabase.from('profiles').update({
      activist_score: scores.activist,
      reflector_score: scores.reflector,
      theorist_score: scores.theorist,
      pragmatist_score: scores.pragmatist,
      dominant_learning_style: dominantLearningStyle
    }).eq('user_id', userId); // Ensure the column name is correct and matches user_id

    if (profileError) {
      console.error('Error updating profile:', profileError.message);
      return;
    }

    console.log('Profile updated successfully:', profileData);

    // Show success message with dominant learning style
    alert(`
    Form submission successful! 
    Your learning style is "${dominantLearningStyle}"`);

    // Proceed to the next step (e.g., pre-test)
    router.push('/pre-test');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

onMounted(() => {
  checkUser();
});
</script>

<style scoped>
.study-container {
  max-width: 1000px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.study-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: rgb(29, 29, 184); 
}

.question {
  display: flex;
  align-items: center; /* Center the checkbox vertically with the question text */
  margin-bottom: 100px; /* Increased distance between each question */
}

label {
  margin-left: 10px;
  font-weight: 600;
  color: black;
  text-transform: none; /* Make the question text not capitalized */
  font-size: 16px;
}

.option {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.3); /* Make the checkbox 30% bigger */
}

.submit-button {
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
