<template>
  <div>
    <div v-if="!interactionStarted">
      <p>Your learning style is: {{ learningStyle }}</p>
      <p>You will now interact with the LLM and go through the lesson plan. You have 20 minutes to learn as much as you can to get the highest score on the test that will follow the 20 minutes.</p>
      <button @click="startInteraction" class="start-button">Start LLM Interaction</button>
    </div>
    <div v-else>
      <div class="timer">{{ minutes }}:{{ seconds }}</div>
        <h1>Learning time...</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const user = ref(null);
const learningStyle = ref('');
const interactionStarted = ref(false);
const timer = ref(1200); // 20 minutes in seconds
const minutes = ref(20);
const seconds = ref(0);
const router = useRouter();

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
    await fetchLearningStyle();
  } else {
    router.push('/login'); // Redirect to login if no user is found
  }
};

const fetchLearningStyle = async () => {
  const { data, error } = await supabase.from('profiles').select('dominant_learning_style').eq('user_id', user.value.id).single();
  if (error) {
    console.error('Error fetching learning style:', error.message);
    return;
  }
  learningStyle.value = data.dominant_learning_style;
};

const startInteraction = () => {
  interactionStarted.value = true;
  startTimer();
};

const startTimer = () => {
  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
      minutes.value = Math.floor(timer.value / 60);
      seconds.value = timer.value % 60;
    } else {
      clearInterval(interval);
      router.push('/posttest'); // Redirect to post-test page after 20 minutes
    }
  }, 1000);
};

onMounted(() => {
  checkUser();
});
</script>

<style scoped>
.content {
  margin-top: 50px;
  color: white;
}

.cta-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1d1db8;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
}

.cta-btn:hover {
  background-color: #1717fa;
  transform: translateY(-3px);
}

.timer {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: rgb(29, 29, 184);
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
}

.start-button {
  background-color: rgb(29, 29, 184);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 30px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: rgb(23, 23, 250);
  transform: translateY(-3px);
}

.lesson-plan {
  margin-top: 50px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
