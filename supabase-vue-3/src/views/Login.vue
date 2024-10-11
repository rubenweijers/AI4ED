<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleLogin">
      <h1>Login</h1>
      <input v-model="username" type="text" placeholder="UserName" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">{{ loading ? 'Loading...' : 'Log In' }}</button>
      <p>Don't have an account? <router-link to="/signup">Sign up!</router-link></p>
      <p><a href="#" @click.prevent="showResetPassword = true">Forgot Password?</a></p>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="consent" />
          <a href="https://www.termsfeed.com/live/50a688ef-662a-4eb2-ace4-ded3baa4a903" target="_blank">I consent to the terms and conditions.</a>
        </label>
      </div>
    </form>

    <!-- Reset Password Modal -->
    <div v-if="showResetPassword" class="reset-password-modal">
      <form @submit.prevent="handleResetPassword">
        <h2>Reset Password</h2>
        <input v-model="resetEmail" type="email" placeholder="Enter your email" required />
        <button type="submit" :disabled="resetLoading">
          {{ resetLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
        <button @click="showResetPassword = false">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';
import bcrypt from 'bcryptjs';

const router = useRouter();
const loading = ref(false);
const username = ref('');
const password = ref('');
const consent = ref(true);

// New variables for reset password functionality
const showResetPassword = ref(false);
const resetEmail = ref('');
const resetLoading = ref(false);

const handleLogin = async () => {
  console.log("consent", consent.value);

  if (!consent.value) {
    alert('Please check the consent box before logging in.');
    return;
  }

  try {
    loading.value = true;

    // Fetch the hashed password from the database based on the username
    const { data: profile, error: profileError } = await supabase
      .from('profiles_duplicate')
      .select('id, password, display_name')
      .eq('username', username.value)
      .single();

    if (profileError || !profile) {
      throw new Error('Login failed: Username not found.');
    }

    const validPassword = await bcrypt.compare(password.value, profile.password);

    if (!validPassword) {
      throw new Error('Login failed: Incorrect password.');
    }

    // On successful authentication
    const user = { id: profile.id, username: username.value, display_name: profile.display_name };
    console.log('User logged in:', user);

    // Store user information in local storage
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to StudyInfo page
    router.push({ name: 'StudyInfo' });
  } catch (error) {
    console.error('Error during login:', error.message);
    alert(error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-password-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.reset-password-modal form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reset-password-modal input,
.reset-password-modal button {
  padding: 10px;
  margin: 5px 0;
}

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
