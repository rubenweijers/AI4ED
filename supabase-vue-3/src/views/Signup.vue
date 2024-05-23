<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleSignUp">
      <h1>Sign Up</h1>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="displayName" type="text" placeholder="Display Name" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="age" type="number" placeholder="Age" required />
      <button type="submit" :disabled="loading">{{ loading ? 'Loading...' : 'Sign Up' }}</button>
      <p>Already have an account? <router-link to="/login">Log in!</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')
const password = ref('')
const displayName = ref('')
const age = ref('')

const handleSignUp = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) throw error;

    // Access the user object correctly
    const user = data.user;

    if (!user) {
      throw new Error('User sign-up failed: no user object returned.');
    }

    console.log('User signed up:', user);

    // Insert into profiles table
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        { user_id: user.id, display_name: displayName.value, age: age.value }
      ]);

    if (profileError) throw profileError;
    console.log('Profile created:', profile);

    alert('Check your email for the confirmation link!');
  } catch (error) {
    console.error('Error during signup:', error.message);
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