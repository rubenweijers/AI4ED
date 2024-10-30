<template>
  <div>
    <header class="header">
      <nav class="nav">
        <!-- Display the timer if it's active -->
        <div v-if="remainingTime !== null" class="timer">
          Time left: {{ formattedTime }}
        </div>
      </nav>
    </header>
    <!-- Notification Modal -->
    <div v-if="showNotification" class="modal-overlay">
      <div class="modal">
        <h3>Time Warning</h3>
        <p>{{ notificationMessage }}</p>
        <button @click="closeNotification">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const user = ref(null);
const remainingTime = ref(null); // Remaining time in seconds
let timerInterval = null; // Reference to the interval timer

// New reactive variables for warnings
const fifteenMinuteWarningDisplayed = ref(JSON.parse(localStorage.getItem('fifteenMinuteWarningDisplayed')) || false);
const fiveMinuteWarningDisplayed = ref(JSON.parse(localStorage.getItem('fiveMinuteWarningDisplayed')) || false);

// Variables for notification
const showNotification = ref(false);
const notificationMessage = ref('');

const checkUser = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
};

const updateRemainingTime = () => {
  const startTime = localStorage.getItem('studyStartTime');
  const totalDuration = localStorage.getItem('studyTotalDuration');
  if (startTime && totalDuration) {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000); // Elapsed time in seconds
    const totalDurationSeconds = parseInt(totalDuration, 10); // Total duration in seconds
    const timeLeft = totalDurationSeconds - elapsed;
    if (timeLeft > 0) {
      remainingTime.value = timeLeft;

      // Check for 15-minute warning
      if (timeLeft <= 15 * 60 && !fifteenMinuteWarningDisplayed.value) {
        displayWarning('15');
        fifteenMinuteWarningDisplayed.value = true;
      }

      // Check for 5-minute warning
      if (timeLeft <= 5 * 60 && !fiveMinuteWarningDisplayed.value) {
        displayWarning('5');
        fiveMinuteWarningDisplayed.value = true;
      }
    } else {
      remainingTime.value = 0;
      clearInterval(timerInterval);
      // Handle timer expiration (e.g., log out the user or display a message)
      alert('Your study time has ended.');
      handleLogout();
    }
  } else {
    remainingTime.value = null;
  }
};

// Function to display warnings
const displayWarning = (minutesLeft) => {
  notificationMessage.value = `You have ${minutesLeft} minutes remaining in your study time.`;
  showNotification.value = true;

  if (minutesLeft === '15') {
    fifteenMinuteWarningDisplayed.value = true;
    localStorage.setItem('fifteenMinuteWarningDisplayed', 'true');
  } else if (minutesLeft === '5') {
    fiveMinuteWarningDisplayed.value = true;
    localStorage.setItem('fiveMinuteWarningDisplayed', 'true');
  }
};

const closeNotification = () => {
  showNotification.value = false;
};

onMounted(() => {
  checkUser();
  updateRemainingTime();
  timerInterval = setInterval(updateRemainingTime, 1000); // Update every second
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Watch for route changes to re-check user
watch(route, () => {
  checkUser();
});

// Computed property to format the remaining time as MM:SS
const formattedTime = computed(() => {
  if (remainingTime.value !== null) {
    const minutes = Math.floor(remainingTime.value / 60);
    const seconds = remainingTime.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return '';
  }
});

const handleLogout = () => {
  // TODO: Implement logout logic, if any
  user.value = null;
  localStorage.removeItem('user');
  localStorage.removeItem('studyStartTime'); // Clear the start time when logging out
  localStorage.removeItem('studyTotalDuration'); // Clear the total duration
  router.push('/login');
};

const redirect = () => {
  router.push('/');
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: transparent; /* Fully transparent */
  color: black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border: none;
  box-shadow: none;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal h3 {
  margin-top: 0;
}

.modal button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.modal button:hover {
  background-color: #0056b3;
}

.timer {
  margin-right: 15px;
  font-size: 1em;
  color: #000;
  font-family: 'Roboto', sans-serif;
  display: flex;
  align-items: center;
}

.logo-container {
  position: absolute;
  left: 20px;
  display: flex;
  align-items: center;
  font-size: 1.5em;
  font-weight: bold;
  color: black;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
}

.logo-container img {
  height: 50px; /* Adjust the height as needed */
  margin-right: 10px;
}

.nav {
  display: flex;
  align-items: center;
}

.nav a,
.nav .user-name,
.nav .logout-btn {
  margin-left: 15px;
  text-decoration: none;
  color: #000;
  font-family: 'Roboto', sans-serif;
  transition: color 0.3s, transform 0.3s;
}

.nav a:hover,
.nav .logout-btn:hover {
  color: #575757;
  transform: translateY(-3px);
}

.logout-btn {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  transition: color 0.3s, transform 0.3s;
}

.user-name span {
  display: inline-block;
  animation-name: rainbow-flow;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  font-size: 1.2em;
  color: #000;
  transition: color 0.3s, transform 0.3s;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes rainbow-flow {
  0% {
    color: #000;
  }
  10% {
    color: #575757;
  }
  20% {
    color: #a0a0a0;
  }
  30% {
    color: #d9d9d9;
  }
  40% {
    color: #ffffff;
  }
  50% {
    color: #d9d9d9;
  }
  60% {
    color: #a0a0a0;
  }
  70% {
    color: #575757;
  }
  80% {
    color: #000;
  }
  90% {
    color: #575757;
  }
  100% {
    color: #a0a0a0;
  }
}
</style>
