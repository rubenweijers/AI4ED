<template>
  <div class="chat-container">
    <div class="chat-box" v-for="(message, index) in chatHistory" :key="index">
      <div class="user-message" v-if="message.role === 'user'">{{ message.content }}</div>
      <div class="assistant-message" v-else>{{ message.content }}</div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      chatHistory: [],
      newMessage: '',
      backendUrl: 'https://ai4ed.vercel.app/api/predict'
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() === '') return;

      const userMessage = { role: 'user', content: this.newMessage };
      this.chatHistory.push(userMessage);

      try {
        const response = await axios.post(this.backendUrl, {
          message: this.newMessage,
          history: this.chatHistory
        });

        const assistantMessage = { role: 'assistant', content: response.data };
        this.chatHistory.push(assistantMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      this.newMessage = '';
    }
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: flex-end;
}
.chat-box {
  padding: 10px;
}
.user-message {
  background-color: #dcf8c6;
  align-self: flex-end;
}
.assistant-message {
  background-color: #ece5dd;
  align-self: flex-start;
}
input {
  padding: 10px;
  border: 1px solid #ddd;
  width: 100%;
}
</style>
