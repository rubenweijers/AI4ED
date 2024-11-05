<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-info-container">
      <!-- <h2>Study Information</h2> -->

      <button @click="logoutUser" class="logout-button">Logout</button>

      <!-- Existing content -->
      <StudyIntro />
      <StudyInfo1 />

      <div class="consent-checkbox" :class="{ 'flash-red': isFlashing }">
        <input type="checkbox" id="consent" v-model="consentChecked">
        <label for="consent">I agree to the terms and services</label>
      </div>

      <button @click="showToastNotification" class="submit-button">
        I confirm to have read the above text.
      </button>

      <ToastNotification
        :isVisible="showToast"
        title="Proceed to Study"
        message="Are you sure you want to proceed to the study? This action cannot be undone."
        @confirm="proceedToStudy"
        @cancel="cancelProceed"
      />
    </div>
  </div>
  <div v-else>
    <p>Please log in to view study information.</p>
    <router-link to="/login">Log in</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import StudyInfo1 from '../components/StudyInfo1.vue';
import StudyIntro from '../components/StudyIntro.vue';
import ToastNotification from '../components/ToastNotification.vue';

const router = useRouter();
const loading = ref(true);
const user = ref(null);
const showToast = ref(false);
const consentChecked = ref(false);

const checkUser = async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    console.log("user.value", user.value);
  } else {
    router.push('/login'); // Redirect to login if no user is found
  }
  loading.value = false;
};

onMounted(() => {
  checkUser();
});

const isFlashing = ref(false);

const showToastNotification = () => {
  if (consentChecked.value) {
    showToast.value = true;
  } else {
    isFlashing.value = true;
    setTimeout(() => {
      isFlashing.value = false;
    }, 1000); // Flash for 1 second
  }
};

const proceedToStudy = () => {
  showToast.value = false;
  const startTime = Date.now();
  localStorage.setItem('studyStartTime', startTime.toString());
  localStorage.setItem('studyTotalDuration', (30 * 60).toString()); // 30 minutes in seconds
  localStorage.setItem('fifteenMinuteWarningDisplayed', 'false');
  localStorage.setItem('fiveMinuteWarningDisplayed', 'false');
  // Clear any previously saved answers before starting the study
  localStorage.removeItem('studyAnswers');
  localStorage.removeItem('studyAnswers2');
  localStorage.setItem('controlChatData');
  router.push('/survey');
};

const cancelProceed = () => {
  showToast.value = false;
};

// Add logoutUser function
const logoutUser = async () => {
  // Clear user data from localStorage
  localStorage.clear();
  
  // Sign out from Supabase auth (if you're using Supabase authentication)
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
  }
  // Redirect to login page
  router.push('/login');
};
</script>
  
<style scoped>
  .study-info-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    font-family: Arial, sans-serif;
    position: relative; /* Needed for positioning the logout button */
  }
  
  .study-info-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: rgb(29, 29, 184);
  }
  
  .info-block {
    background-color: #f8f8f8;
    border-left: 4px solid rgb(29, 29, 184);
    padding: 15px;
    margin-bottom: 20px;
    font-size: 18px;
    line-height: 1.4;
    color: #333;
  }
  
  @media (max-width: 600px) {
    .study-info-container {
      margin: 20px;
      padding: 15px;
    }
    
    h2 {
      font-size: 24px;
    }
    
    .info-block {
      font-size: 16px;
    }
  }

  .consent-checkbox {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.consent-checkbox input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #333;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  margin-right: 10px;
}

.consent-checkbox input[type="checkbox"]:checked {
  background-color: #333;
  position: relative;
}

.consent-checkbox input[type="checkbox"]:checked::before {
  content: '\2714';
  font-size: 14px;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.consent-checkbox label {
  font-size: 14px;
}

.consent-checkbox {
  transition: background-color 0.3s ease;
}

/* Checkbox flashing red */
.flash-red {
  animation: flash-red 1s;
}

@keyframes flash-red {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: #ffcccc;
  }
}

  .logout-button {
    position: absolute;
    top: 20px;
    right: 20px;
    /* Additional styling as needed */
    padding: 10px 15px;
    font-size: 14px;
    background-color: #f44336; /* Red background */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .logout-button:hover {
    background-color: #d32f2f; /* Darker red on hover */
  }
</style>