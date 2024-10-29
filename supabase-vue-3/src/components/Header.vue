<template>
  <div>
    <header class="header">
      <div class="logo-container" @click="redirect">
        <img src="/ai4edlogo-removebg.png" alt="Bookie Logo" />
      </div>
      <nav class="nav">
        <!-- Other nav items can go here -->
      </nav>
      <div class="timer" v-if="remainingTime !== null">
        Time left: {{ formattedTime }}
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../supabase';

const router = useRouter();
const route = useRoute();
const user = ref(null);
const remainingTime = ref(null); // Remaining time in seconds
let timerInterval = null; // Reference to the interval timer

const checkUser = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
};

const updateRemainingTime = () => {
  const startTime = localStorage.getItem('studyStartTime');
  if (startTime) {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000); // Elapsed time in seconds
    const totalDuration = 45 * 60; // Total duration in seconds (45 minutes)
    const timeLeft = totalDuration - elapsed;
    if (timeLeft > 0) {
      remainingTime.value = timeLeft;
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

onMounted(() => {
  checkUser();
  updateRemainingTime();
  timerInterval = setInterval(updateRemainingTime, 1000); // Update every second
});

// Clear the interval timer when the component is unmounted
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Watch for route changes to re-check user
watch(route, () => {
  checkUser();
});

const handleLogout = async () => {
  // TODO: Implement logout logic, if any
  user.value = null;
  localStorage.removeItem('user');
  localStorage.removeItem('studyStartTime'); // Clear the start time when logging out
  router.push('/login');
};

const redirect = () => {
  router.push('/');
};

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

.timer {
  font-size: 1em; /* Adjust font size as needed */
  color: #000; /* Adjust color as needed */
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
