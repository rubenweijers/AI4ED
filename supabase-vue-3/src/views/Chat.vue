<template>
  <div class="chat-view">
    <ChatComponent ref="chatComponent" />
    <!-- <DeleteDataComponent @data-deleted="handleDataDeleted" class="delete-button" /> -->
  </div>
</template>

<script>
import ChatComponent from '../components/ChatComponent.vue';
// import DeleteDataComponent from '../components/DeleteDataComponent.vue';

export default {
  name: 'Chat',
  components: {
    ChatComponent,
    DeleteDataComponent
  },
  methods: {
    handleDataDeleted() {
      // Reset the ChatComponent
      if (this.$refs.chatComponent) {
        this.$refs.chatComponent.handleDataDeleted();
      }
    }
  }
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

.delete-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
}
</style>
