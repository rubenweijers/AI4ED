<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="user">
    <div class="study-info-container">
      <h2>Study Information</h2>
      <StudyIntro />
      <StudyInfo1 />
      
      <button @click="showToastNotification" class="next-button">I confirm to have read the above text.</button>
    
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

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    user.value = currentUser;
  } else {
    router.push('/login');
  }
  loading.value = false;
};

onMounted(() => {
  checkUser();
});

const showToastNotification = () => {
  showToast.value = true;
};

const proceedToStudy = () => {
  showToast.value = false;
  router.push('/survey');
};

const cancelProceed = () => {
  showToast.value = false;
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
    font-size: 18px;
  }
  
  .next-button:hover {
    background-color: rgb(23, 23, 250);
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
</style>