<template>
    <!-- <div class="logo-container" @click="redirect">
        <img src="/bookie.png" alt="Bookie Logo">
    </div> -->
    <header class="header">
      <nav class="nav">
        <a href="#examples">Examples</a>
        <a href="#contact">Contact</a>
        <router-link :to="{ name: 'Study'}">Get Started</router-link>
        <template v-if="user">
          <span class="user-name">
            <template v-for="(char, index) in user.display_name.split('')" :key="index">
              <span>{{ char }}</span>
            </template>
          </span>
          <button @click="handleLogout" class="logout-btn">Log out</button>
        </template>
        <template v-else>
          <router-link :to="{ name: 'Login'}">Log in</router-link>
          <router-link :to="{ name: 'Signup'}">Sign up</router-link>
        </template>
      </nav>
    </header>
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
    display: flex;
    align-items: center;
    font-size: 1.5em;
    font-weight: bold;
    color: black;
    font-family: 'Roboto', sans-serif;
    cursor: pointer;
    margin-right: 20px;
  }
  
  .logo-container img {
    height: 100px;
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
  }
  
  .user-name span {
    display: inline-block;
    animation-name: rainbow-flow;
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  
  @keyframes rainbow-flow {
    0% { color: #b3e5fc; }
    20% { color: #bae1ff; }
    40% { color: #e0f7fa; }
    60% { color: #baffc9; }
    80% { color: #ffffba; }
    100% { color: #ffecb3; }
  }
</style>
  