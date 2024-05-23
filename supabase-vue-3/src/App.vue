<template>
  <div>
    <header class="header">
      <div class="logo-container">
        <img src="/bookie.png" alt="Bookie Logo">
        <h1 @click="redirect">ai4ed</h1>
      </div>
      <nav class="nav">
        <a href="#examples">Examples</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="actions">
        <div class="user-actions">
          <router-link :to="{ name: 'Study'}" class="begin-btn">GET STARTED</router-link>
          <div v-if="user">
            <span class="user-name">{{ user.display_name || 'User' }}</span>
            <button @click="handleLogout" class="logout-btn">Log out</button>
          </div>
          <div v-else>
            <router-link :to="{ name: 'Login'}">Log in</router-link>
            <router-link :to="{ name: 'Signup'}">Sign up</router-link>
          </div>
        </div>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const checkUser = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
}

onMounted(() => {
  checkUser();
});

const handleLogout = async () => {
  await supabase.auth.signOut()
  user.value = null
  localStorage.removeItem('user');
  router.push('/login')
}

const redirect = () => {
  router.push('/')
}
</script>


<style>
body {
  margin: 0;
  padding: 0;
  background: url('/wallpaperpurple.jpeg') no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -25px;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  padding-left: 400px;
  background-color: transparent;
}

.logo-container {
  display: flex;
  align-items: center;
  flex-grow: 0.08;
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  font-family: 'Roboto', sans-serif;
}

.logo-container img {
  height: 100px;
  margin-right: -40px;
}

.nav a {
  margin: 0 15px;
  text-decoration: none;
  color: white;
  font-family: 'Roboto', sans-serif;
  transition: color 0.3s, transform 0.3s;
}

.nav a:hover {
  color: rgb(214, 212, 212);
  transform: translateY(-3px);
}

.actions {
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  margin-left: 250px;
}

.user-actions {
  display: flex;
  align-items: center;
  margin-left: 20px; /* Adjust spacing as needed */
}

.actions a, .user-name, .logout-btn {
  margin-left: 10px;
  text-decoration: none;
  color: white;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
}

.begin-btn {
  position: relative;
  background-color: rgb(29, 29, 184);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 40px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
  text-align: right;
}

.begin-btn::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-image: url('/rocket.gif');
  background-repeat: no-repeat;
  background-size: contain;
  width: 30px;
  height: 30px;
}

.begin-btn:hover {
  background-color: rgb(23, 23, 250);
  color: white;
  transform: translateY(-3px);
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .nav, .actions {
    margin-top: 10px;
  }
}
</style>
