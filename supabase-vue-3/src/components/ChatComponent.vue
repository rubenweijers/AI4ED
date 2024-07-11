<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" :class="{'user-message': message.user, 'bot-message': !message.user}">
        {{ message.text }}
      </div>
    </div>
    <div class="input-container">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Type a message..."/>
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInput: '',
      messages: []
    }
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim() === '') return;
      
      const userMessage = this.userInput;
      this.messages.push({ text: userMessage, user: true });
      this.userInput = '';

      try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
          prompt: userMessage,
          max_tokens: 150
        }, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.CHATGPT_API_KEY}`
          }
        });

        const botMessage = response.data.choices[0].text.trim();
        this.messages.push({ text: botMessage, user: false });
      } catch (error) {
        console.error("Error fetching response from OpenAI API", error);
        this.messages.push({ text: "Error fetching response from OpenAI API", user: false });
      }
    }
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
}

.user-message {
  text-align: right;
}

.bot-message {
  text-align: left;
}

.input-container {
  display: flex;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
}
</style>
