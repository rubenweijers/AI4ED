<template>
    <div class="chat-view">
      <ControlChatComponent ref="controlChatComponent" />
    </div>
</template>
  
<script>
  import ControlChatComponent from '../components/ControlChatComponent.vue';
  
  export default {
    name: 'Chats',
    components: {
      ControlChatComponent,
    },
  };
</script>
  
<style scoped>
  .chat-view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
  }
</style>