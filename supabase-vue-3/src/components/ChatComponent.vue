<template>
    <div class="chat-container">
        <div class="messages">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
                <div v-if="message.role === 'assistant'" class="assistant-message">
                    <img src="/openai.png" alt="OpenAI" class="openai-icon" />
                    <p>{{ message.content }}</p>
                </div>
                <div v-else class="user-message">
                    <p>{{ message.content }}</p>
                </div>
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
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        ...this.messages
                    ],
                    max_tokens: 2000,
                    temperature: 0.7
                };

                // Clear the input field
                this.userMessage = '';

                try {
                    // Make the API request to OpenAI
                    const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
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
        width: 100vw;
        margin: auto;
        font-family: Arial, sans-serif;
        background-color: white;
    }

    .messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background-color: #f9f9f9;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .message {
        width: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .user-message {
        background-color: #efefef;
        color: black;
        padding: 10px;
        border-radius: 20px;
        margin-left: auto;
        display: flex;
        justify-content: flex-end;
    }

    .assistant-message {
        display: flex;
        align-items: center;
    }

    .openai-icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }

    .assistant-message p {
        background: none;
        margin: 0;
    }

    .input-area {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 40px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

input {
    width: 25%;
    padding: 15px; /* Increased padding to make it taller */
    border: 1px solid #ccc;
    border-radius: 25px; /* Slightly increased to maintain proportion */
    margin-right: 10px;
    font-size: 16px;
    background-color: rgb(241, 241, 241);
    color: rgb(0, 0, 0);
}

button {
    padding: 15px 25px; /* Increased padding to match input height */
    background-color: #007bff;
    border: none;
    border-radius: 25px; /* Slightly increased to maintain proportion */
    color: white;
    cursor: pointer;
    font-size: 16px;
}

    button:hover {
        background-color: #0056b3;
    }

    .typing {
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        from, to {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }
</style>
