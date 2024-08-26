<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleLogin">
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <!-- Button is disabled if loading or consent is not checked -->
      <button type="submit" :disabled="loading ">{{ loading ? 'Loading...' : 'Log In' }}</button>
      <p>Don't have an account? <router-link to="/signup">Sign up!</router-link></p>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="consent" />
          <a href="https://www.termsfeed.com/live/50a688ef-662a-4eb2-ace4-ded3baa4a903" target="_blank">I consent to the terms and conditions.</a>
        </label>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')
const consent = ref(true)

const fetchUserProfile = async (userId) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('user_id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  return profileData;
}

const handleLogin = async () => {
  console.log("consent",consent.value)

  if (!consent.value) {
    console.log("consent",consent.value)
    alert('Please check the consent box before logging in.');
    return; // Exit the function early if consent is not given
  }

  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    const user = data.user;

    if (!user) {
      throw new Error('Login failed: no user object returned.');
    }

    console.log('User logged in:', user);

    const profileData = await fetchUserProfile(user.id);

    if (profileData) {
      // Save user and profile data to local storage or global state
      localStorage.setItem('user', JSON.stringify({ ...user, display_name: profileData.display_name }));
      // Redirect to study page after successful login
      router.push({ name: 'Study' });
    } else {
      throw new Error('Profile fetch failed.');
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    alert(error.message);
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding-top: -20; /* Move form closer to the top */
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
}

.auth-form input {
  padding: 0.5rem;
  font-size: 1rem;
  background-color: white; /* Make input forms white */
  border: 1px solid #ccc;
  border-radius: 4px;
  color: black;
}

.auth-form button {
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}

.auth-form p {
  text-align: center;
}
</style>
