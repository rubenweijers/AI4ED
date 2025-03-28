<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleSignUp">
      <h1>Sign Up</h1>
      <input v-model="displayName" type="text" placeholder="Display Name" />
      <input v-model="username" type="text" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit" :disabled="loading">{{ loading ? 'Loading...' : 'Sign Up' }}</button>
      <p>Already have an account? <router-link to="/login">Log in!</router-link></p>
      <br>
      <input v-model="numberOfUsersToGenerate" type="number" placeholder="number of users to generate" />
      <button @click="autoSignUp" :disabled="loading">{{ loading ? 'Loading...' : 'Auto Sign Up Users' }}</button>
    </form>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import bcrypt from 'bcryptjs'

const loading = ref(false)
const numberOfUsersToGenerate = ref('')

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

const generateRandomString = (length, chars) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomUser = (group) => {
  const username = generateRandomString(5, 'abcdefghijklmnopqrstuvwxyz0123456789');
  const password = generateRandomString(5, 'abcdefghijklmnopqrstuvwxyz0123456789');
  return {
    username: username,
    password: password,
    displayName: username,
    group: group,  // Use the passed group parameter instead of other
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
      .from('2_profiles')
      .select('username')
      .eq('username', user.username)
      .maybeSingle();

    if (existingUserError) {
      throw existingUserError;
    }

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const now = new Date().toISOString();

    // Insert into 2_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('2_profiles')
      .insert([
        {
          user_id: user.displayName,
          username: user.username,
          display_name: user.displayName,
          password: hashedPassword,
          group: user.group,  // Use the group from the user object
          created_at: now,
        }
      ]);

    if (profileError) throw profileError;

    const usersToGenerate = parseInt(numberOfUsersToGenerate.value, 10) || 0;
    if (usersToGenerate < 1) {
      alert('User registered successfully!');
    }

  } catch (error) {
    console.error('Error during signup:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Utility function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const autoSignUp = async () => {
  loading.value = true;
  const userDetails = [];

  const usersToGenerate = parseInt(numberOfUsersToGenerate.value, 10) || 0;

  // Calculate the number of users for each group
  const controlCount = Math.round(usersToGenerate * 0.4);           // 40% for control
  const expO3Count = Math.round(usersToGenerate * 0.3);            // 30% for experimental_o3
  const exp4oCount = usersToGenerate - controlCount - expO3Count;  // Remainder for experimental_4o

  // Create an array with the exact number of group assignments
  const groups = [
    ...Array(controlCount).fill('control'),
    ...Array(expO3Count).fill('experimental_o3'),
    ...Array(exp4oCount).fill('experimental_4o')
  ];

  // Shuffle the groups to randomize the order
  shuffle(groups);

  // Generate users with preassigned, shuffled groups
  for (let i = 0; i < usersToGenerate; i++) {
    const group = groups[i];
    const newUser = generateRandomUser(group);
    userDetails.push({ ...newUser });
    await handleSignUp(newUser);
  }

  createAndDownloadTxtFile(userDetails);
  loading.value = false;
};

// const autoSignUp = async () => {
//   loading.value = true;
//   const userDetails = [];

//   const usersToGenerate = parseInt(numberOfUsersToGenerate.value, 10) || 0;
//   let controlCount = 0;
//   let treatmentCount = 0;

//   for (let i = 0; i < usersToGenerate; i++) {
//     let group;
//     if (controlCount < usersToGenerate / 2 && treatmentCount < usersToGenerate / 2) {
//       // Randomly assign group if both are under half
//       group = Math.random() < 0.5 ? 'control' : 'treatment';
//     } else if (controlCount < usersToGenerate / 2) {
//       group = 'control';
//     } else {
//       group = 'treatment';
//     }

//     const newUser = generateRandomUser(group);

//     // Push a shallow copy of newUser to userDetails before handleSignUp
//     userDetails.push({ ...newUser });

//     await handleSignUp(newUser);

//     if (group === 'control') {
//       controlCount++;
//     } else {
//       treatmentCount++;
//     }
//   }

//   createAndDownloadTxtFile(userDetails);
//   loading.value = false;
// }
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
