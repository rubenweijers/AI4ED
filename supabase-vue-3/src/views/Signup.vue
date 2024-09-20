<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleSignUp">
      <h1>Sign Up</h1>
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="displayName" type="text" placeholder="Display Name" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="age" type="number" placeholder="Age" required />
      <select v-model="gender" required >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Non-binary</option>
        <option value="prefer_not_to_say">Prefer not to say</option>
      </select>
      <input v-model="firstLanguage" type="text" placeholder="First Language" required />
      <button type="submit" :disabled="loading">{{ loading ? 'Loading...' : 'Sign Up' }}</button>
      <p>Already have an account? <router-link to="/login">Log in!</router-link></p>
      <button @click="autoSignUp" :disabled="loading">{{ loading ? 'Loading...' : 'Auto Sign Up 5 Users' }}</button>
    </form>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import bcrypt from 'bcryptjs' // Ensure correct import as per the module documentation
import { v4 as uuidv4 } from 'uuid' // Import the uuid library

const loading = ref(false)
const username = ref('')
const password = ref('')
const displayName = ref('')
const age = ref('')
const gender = ref('')
const firstLanguage = ref('')

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// const generateRandomString = (length) => {
//   const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

const generateRandomUser = () => {
  const generatedUsername = uuidv4();
  return {
    username: generatedUsername,
    password: uuidv4(),
    displayName: generatedUsername,
    // age: Math.floor(Math.random() * 70) + 18, // Random age between 18 and 87
    // gender: ['male', 'female', 'other', 'prefer_not_to_say'][Math.floor(Math.random() * 4)],
    // firstLanguage: ['English', 'Spanish', 'French', 'German', 'Chinese'][Math.floor(Math.random() * 5)]
  }
}

const createAndDownloadTxtFile = (userDetails) => {
  let fileContent = 'Generated Users:\n\n';
  userDetails.forEach(detail => {
    fileContent += `Username: ${detail.username}, Password: ${detail.password}\n`;
  });

  const blob = new Blob([fileContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'generated_users.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const handleSignUp = async (user) => {
  try {
    loading.value = true;

    // Hash the user's password
    const hashedPassword = await hashPassword(user.password);

    // Check if username already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('profiles_duplicate')
      .select('username')
      .eq('username', user.username)
      .single();

    if (existingUser) {
      throw new Error('Username already exists');
    }
    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw existingUserError;
    }

    // Fetch the current count of participants in both groups
    const { data: treatmentCountData, error: treatmentCountError } = await supabase
      .from('profiles_duplicate')
      .select('id', { count: 'exact' })
      .eq('group', 'treatment');

    const { data: controlCountData, error: controlCountError } = await supabase
      .from('profiles_duplicate')
      .select('id', { count: 'exact' })
      .eq('group', 'control');

    if (treatmentCountError) throw treatmentCountError;
    if (controlCountError) throw controlCountError;

    const treatmentCount = treatmentCountData.length;
    const controlCount = controlCountData.length;

    let group = 'control';
    if (treatmentCount < controlCount) {
      group = 'treatment';
    } else if (treatmentCount > controlCount) {
      group = 'control';
    } else {
      group = Math.random() < 0.5 ? 'treatment' : 'control';
    }

    const now = new Date().toISOString();
    // const userId = uuidv4();

    // Insert into profiles_duplicate table with the assigned group, hashed password, and other details
    const { data: profile, error: profileError } = await supabase
      .from('profiles_duplicate')
      .insert([
        { 
          user_id: user.displayName,
          username: user.username, // do we need this? why don't we make user_id, username and display name the same?
          display_name: user.displayName,
          password: hashedPassword,
          age: user.age,
          group: group,
          created_at: now,
          gender: user.gender,
          first_language: user.firstLanguage
        }
      ]);

    if (profileError) throw profileError;

    console.log('Profile created:', profile);

    alert('User registered successfully!');
  } catch (error) {
    console.error('Error during signup:', error.message);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

const autoSignUp = async () => {
  loading.value = true;
  const userDetails = [];
  // i controls # of users to generate
  for (let i = 0; i < 10; i++) {
    const newUser = generateRandomUser();
    userDetails.push(newUser);
    await handleSignUp(newUser);
  }
  createAndDownloadTxtFile(userDetails);
  loading.value = false;
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
