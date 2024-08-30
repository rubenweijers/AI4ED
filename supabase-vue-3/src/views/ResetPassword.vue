<template>
    <div class="reset-password">
      <form @submit.prevent="handlePasswordReset">
        <h2>Set New Password</h2>
        <input v-model="newPassword" type="password" placeholder="New Password" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" required />
        <button type="submit" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue'
  import { supabase } from '../supabase'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const newPassword = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  
  const handlePasswordReset = async () => {
    if (newPassword.value !== confirmPassword.value) {
      alert("Passwords don't match")
      return
    }
  
    try {
      loading.value = true
      const { error } = await supabase.auth.updateUser({ password: newPassword.value })
      if (error) throw error
      alert('Password updated successfully')
      router.push('/login')
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
</script>
  
<style scoped>
  .reset-password {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  input, button {
    padding: 10px;
    margin: 5px 0;
  }
</style>