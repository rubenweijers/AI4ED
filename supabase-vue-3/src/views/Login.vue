<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleLogin">
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" required />
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
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')
const consent = ref(true)

// New variables for reset password functionality
const showResetPassword = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)

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
  console.log("consent", consent.value)

  if (!consent.value) {
    console.log("consent", consent.value)
    alert('Please check the consent box before logging in.');
    return;
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
      localStorage.setItem('user', JSON.stringify({ ...user, display_name: profileData.display_name }));
      router.push({ name: 'StudyInfo' });
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

// New function for handling password reset
const handleResetPassword = async () => {
  try {
    resetLoading.value = true
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.value, {
      redirectTo: `${window.location.origin}/resetpassword`,
    })
    if (error) throw error
    alert('Password reset email sent. Check your inbox.')
    showResetPassword.value = false
  } catch (error) {
    alert(error.message)
  } finally {
    resetLoading.value = false
  }
}
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
