<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleLogin">
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">{{ loading ? 'Loading...' : 'Log In' }}</button>
      <p>Don't have an account? <router-link to="/signup">Sign up!</router-link></p>
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
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

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
      router.push('/study'); // Redirect to home page or any other page after successful login
      // Use setTimeout to delay the refresh slightly after the push
      setTimeout(() => {
        window.location.replace('/study');
      }, 100);
    } else {
      throw new Error('Profile fetch failed.');
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
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
