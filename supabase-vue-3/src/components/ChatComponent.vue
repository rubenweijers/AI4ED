<template>
    <div class="chat-container">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
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
                'Authorization': `Bearer YOUR_API_KEY`
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
    height: 100vh;
    max-width: 600px;
    margin: auto;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: Arial, sans-serif;
  }
  
  .messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f9f9f9;
  }
  
  .message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    max-width: 80%;
    word-wrap: break-word;
  }
  
  .message.user {
    align-self: flex-end;
    background-color: #007bff;
    color: white;
  }
  
  .message.assistant {
    align-self: flex-start;
    background-color: #e5e5ea;
    color: black;
  }
  
  .input-area {
    display: flex;
    padding: 10px;
    background-color: white;
    border-top: 1px solid #ccc;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 16px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
</style>
  