<template>
    <div>
      <ChatComponent />
    </div>
</template>
  
<script>
  import ChatComponent from '@/components/ChatComponent.vue'
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '../supabase';
  
  export default {
    name: 'Chat',
    components: {
      ChatComponent
    }
  }
</script>
  