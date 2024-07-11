<template>
    <div class="chat-container">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" :class="message.role">
          <p>{{ message.content }}</p>
        </div>
      </div>
      <div class="input-area">
        <input v-model="userMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  
  export default {
    name: 'ChatComponent',
    data() {
      return {
        userMessage: '',
        messages: []
      };
    },
    methods: {
        async sendMessage() {
            if (this.userMessage.trim() === '') return;

            // Add the user's message to the messages array
            this.messages.push({ role: 'user', content: this.userMessage });

            // Prepare the data for the API request
            const apiData = {
                model: "gpt-3.5-turbo",
                messages: [
                { role: "system", content: "You are a helpful assistant." },
                ...this.messages
                ],
                max_tokens: 150,
                temperature: 0.7
            };

            // Clear the input field
            this.userMessage = '';

            try {
                // Make the API request to OpenAI
                const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`
                }
                });

                // Add the API's response to the messages array
                this.messages.push({ role: 'assistant', content: response.data.choices[0].message.content.trim() });
            } catch (error) {
                console.error('Error communicating with the OpenAI API', error);
            }
            }
    }
  };
</script>
  
<style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
  }
  .user {
    text-align: right;
    color: blue;
  }
  .assistant {
    text-align: left;
    color: green;
  }
  .input-area {
    display: flex;
    padding: 10px;
  }
  input {
    flex: 1;
    padding: 10px;
    margin-right: 10px;
  }
  button {
    padding: 10px;
  }
</style>
  