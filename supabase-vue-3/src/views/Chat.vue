<template>
    <div class="chat-view">
      <ChatComponent />
    </div>
</template>
  
<script>
  import ChatComponent from '@/components/ChatComponent.vue';
  
  export default {
    name: 'Chat',
    components: {
      ChatComponent
    }
  };
</script>
  
<style scoped>
  .chat-view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>
  