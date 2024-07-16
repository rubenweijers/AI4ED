<template>
    <div class="chat-container">
        <div class="messages">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
                <div v-if="message.role === 'assistant'" class="assistant-message">
                    <img src="/openai.png" alt="OpenAI" class="openai-icon" />
                    <p v-html="marked(message.content)"></p>
                </div>
                <div v-else class="user-message">
                    <p>{{ message.content }}</p>
                </div>
            </div>
            <div v-if="loading" class="loading">
                <img src="/loading_spinner.gif" alt="Loading" />
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
    import { marked } from 'marked';

    export default {
        name: 'ChatComponent',
        data() {
            return {
                userMessage: '',
                messages: [],
                loading: false
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

                // Set loading state to true
                this.loading = true;

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

                    // Set loading state to false
                    this.loading = false;
                } catch (error) {
                    console.error('Error communicating with the OpenAI API', error);
                    this.loading = false;
                }
            },
            marked(content) {
                return marked(content);
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
        align-items: flex-start;
    }

    .openai-icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }

    .assistant-message .openai-icon {
    margin-right: 10px;
    margin-top: 5px;
}

    .assistant-message p {
            background: none;
            margin: 0;
            text-align: left;
        }

    .input-area {
        padding: 20px;
        background-color: #f9f9f9;
        border-top: 1px solid #ccc;
    }

    input {
        width: 25%;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 25px;
        margin-right: 10px;
        font-size: 16px;
        background-color: rgb(241, 241, 241);
        color: rgb(0, 0, 0);
    }

    button {
        padding: 15px 25px;
        background-color: #007bff;
        border: none;
        border-radius: 25px;
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

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
    }

    .loading img {
        width: 30px;
        height: 30px;
        /* animation: spin 1s linear infinite; */
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>