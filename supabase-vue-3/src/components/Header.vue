<template>
  <div>
    <header class="header">
      <div class="logo-container" @click="redirect">
        <img src="/ai4edlogo-removebg.png" alt="Bookie Logo">
      </div>
      <nav class="nav">
        <a href="#examples">Examples</a>
        <a href="#contact">Contact</a>
        <router-link :to="{ name: 'Study' }">Get Started</router-link>
        <template v-if="user">
          <span class="user-name">
            <template v-for="(char, index) in user.display_name.split('')" :key="index">
              <span>{{ char }}</span>
            </template>
          </span>
          <button @click="handleLogout" class="logout-btn">Log out</button>
        </template>
        <template v-else>
          <router-link :to="{ name: 'Login' }">Log in</router-link>
          <router-link :to="{ name: 'Signup' }">Sign up</router-link>
        </template>
      </nav>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()
const user = ref(null)

const checkUser = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
}

onMounted(() => {
  checkUser()
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  user.value = null
  localStorage.removeItem('user')
  router.push('/login')
}

const redirect = () => {
  router.push('/')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
  background-color: transparent;
  color: black;
  position: relative;
  top: 0.2cm;
}

.logo-container {
  position: absolute;
  left: 20px;
  display: flex;
  align-items: center;
  font-size: 1.5em;
  font-weight: bold;
  color: black;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
}

.logo-container img {
  height: 50px; /* Adjust the height as needed */
  margin-right: 10px;
}

.nav {
  display: flex;
  align-items: center;
}

.nav a, .nav .user-name, .nav .logout-btn {
  margin-left: 15px;
  text-decoration: none;
  color: #000;
  font-family: 'Roboto', sans-serif;
  transition: color 0.3s, transform 0.3s;
}

.nav a:hover, .nav .logout-btn:hover {
  color: #575757;
  transform: translateY(-3px);
}

.logout-btn {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  transition: color 0.3s, transform 0.3s;
}

.user-name span {
  display: inline-block;
  animation-name: rainbow-flow;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  font-size: 1.2em;
  color: #000;
  transition: color 0.3s, transform 0.3s;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes rainbow-flow {
  0% { color: #000; }
  10% { color: #575757; }
  20% { color: #a0a0a0; }
  30% { color: #d9d9d9; }
  40% { color: #ffffff; }
  50% { color: #d9d9d9; }
  60% { color: #a0a0a0; }
  70% { color: #575757; }
  80% { color: #000; }
  90% { color: #575757; }
  100% { color: #a0a0a0; }
}
</style>
