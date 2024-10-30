<template>
    <div class="chat-container">
        <div class="messages">
            <div v-if="loading && messages.length === 0" class="loading">
                <img src="/loading_spinner.gif" alt="Loading" />
                <p>Generating initial message...</p>
            </div>
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
                <div v-if="message.role === 'assistant'" class="assistant-message">
                    <img src="/openai.png" alt="OpenAI" class="openai-icon" />
                    <p v-html="marked(message.content)"></p>
                </div>
                <div v-else class="user-message">
                    <p>{{ message.content }}</p>
                </div>
            </div>
            <div v-if="loading && messages.length > 0" class="loading">
                <img src="/loading_spinner.gif" alt="Loading" />
            </div>
        </div>
        <div class="input-area">
            <div class="input-wrapper">
                <div class="rounds-indicator" :class="roundsIndicatorClass">
                    Inputs remaining: {{ remainingRounds }}
                </div>
                <input 
                    v-model="userMessage" 
                    @keyup.enter="sendMessage" 
                    placeholder="Type a message..." 
                    :disabled="isChatFinished()"
                />
                <button @click="sendMessage" :disabled="isChatFinished()">Send</button>
            </div>
            <button v-if="isChatFinished()" @click="confirmNextPage" class="next-button">Next</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked';
import { supabase } from '../supabase';

export default {
    name: 'ChatComponent',
    data() {
        return {
            userMessage: '',
            messages: [],
            loading: false,
            systemPrompt: '',
            userBeliefLevel: null,
            questionText: '',
            explanation: '',
            initialSystemMessage: '',
            remainingRounds: 3,
            lastMessageTime: null,
            firstMsgTime: null,
            user: null,
            profileData: null, // Add profileData to access question queue
        };
    },
    async mounted() {
        await this.loadDataAndSetSystemPrompt();
        this.$nextTick(() => {
            this.scrollToBottom();
        });
    },
    methods: {
        clearChatData() {
            localStorage.removeItem('chatData');
            this.userMessage = '';
            this.messages = [];
            this.loading = false;
            this.systemPrompt = '';
            this.userBeliefLevel = null;
            this.questionText = '';
            this.explanation = '';
            this.initialSystemMessage = '';
            this.remainingRounds = 3;
            this.lastMessageTime = null;
            this.firstMsgTime = null;
            },
        async loadDataAndSetSystemPrompt() {
            const storedData = localStorage.getItem('chatData');
            if (storedData) {
                const {
                    userBeliefLevel,
                    questionText,
                    explanation,
                    systemPrompt,
                    initialSystemMessage,
                    messages,
                    remainingRounds,
                } = JSON.parse(storedData);
                this.userBeliefLevel = userBeliefLevel;
                this.questionText = questionText;
                this.explanation = explanation;
                this.systemPrompt = systemPrompt;
                this.initialSystemMessage = initialSystemMessage;
                this.messages = messages || [{ role: 'assistant', content: this.initialSystemMessage }];
                this.remainingRounds = remainingRounds !== undefined ? remainingRounds : 3; // Default to 3 if not set
            } else {
                await this.fetchDataAndSetSystemPrompt();
            }
        },

        async fetchDataAndSetSystemPrompt() {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      console.log('User not authenticated');
      this.$router.push('/login');
      return;
    }

    // Fetch profile data to get question queue and current index
    console.log('Fetching profile data for user:', this.user.username);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles_duplicate')
      .select('*')
      .eq('user_id', this.user.username)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile data:', profileError.message);
      alert('No profile data found. Please complete the previous steps first.');
      this.$router.push('/study'); // Redirect to the appropriate page
      return;
    }

    if (!profileData) {
      console.error('No profile data found for user:', this.user.username);
      alert('No profile data found. Please complete the previous steps first.');
      this.$router.push('/study');
      return;
    }

    this.profileData = profileData;

    const questionQueue = this.profileData.question_queue;
    const currentQuestionIndex = this.profileData.current_question_index || 0;

    // Check if questionQueue is valid and has the next question
    if (!questionQueue || questionQueue.length === 0) {
      console.error('Question queue is empty.');
      alert('No questions to display. Please complete the previous steps.');
      this.$router.push('/study');
      return;
    }

    if (currentQuestionIndex >= questionQueue.length) {
      console.error('No more questions left.');
      alert('You have completed all the questions. Thank you!');
      this.$router.push('/completion'); // Redirect to a completion page
      return;
    }

    const questionNumber = questionQueue[currentQuestionIndex];

    // Ensure questionNumber is defined
    if (questionNumber === undefined) {
      console.error('Question number is undefined.');
      alert('An error occurred. Please try again later.');
      return;
    }

    // Fetch answer data
    console.log('Fetching answer data for user:', this.user.username, 'and question number:', questionNumber);
    const { data: answerData, error: answerError } = await supabase
      .from('answers_posttest_denton')
      .select('belief_rating_1, llm_summary')
      .eq('user_id', this.user.username)
      .eq('question_number', questionNumber)
      .maybeSingle();

    if (answerError) {
      console.error('Error fetching answer data:', answerError.message);
      alert('An error occurred while fetching answer data.');
      return;
    }

    if (!answerData) {
      console.error('No answer data found for this user and question number.');
      alert('No answer data found. Please complete the previous steps first.');
      return;
    }

    this.userBeliefLevel = answerData.belief_rating_1;
    this.explanation = answerData.llm_summary;

    // Fetch question data
    console.log('Fetching question data for question number:', questionNumber);
    const { data: questionData, error: questionError } = await supabase
      .from('questions_denton')
      .select('question_text')
      .eq('question_number', questionNumber)
      .maybeSingle();

    if (questionError) {
      console.error('Error fetching question data:', questionError.message);
      alert('An error occurred while fetching question data.');
      return;
    }

    if (!questionData) {
      console.error('No question data found for question number:', questionNumber);
      alert('No question data found. Please contact support.');
      return;
    }

    this.questionText = questionData.question_text;

    // Set the system prompt
    this.systemPrompt = `Your goal is to very effectively persuade users to rethink and correct their misconception about the physics concept related to the question they got wrong on the Force Concept Inventory test. You will be having a conversation with a person who, on a psychometric survey, expressed a belief level of ${this.userBeliefLevel} out of 100 (where 0 is Definitely False, 50 is Uncertain, and 100 is Definitely True) in their incorrect answer. The specific question they got wrong is: ${this.questionText}. Further, we asked the user to provide an open-ended response explaining their reasoning, which is summarized as follows: ${this.explanation}. Please generate a response that will persuade the user that their understanding is incorrect, based on their own reasoning. Create a conversation that allows individuals to reflect on, and change, their beliefs. Use simple language that an average person will be able to understand.`;

    await this.generateInitialAIMessage();

    this.saveChatData();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
},
        async generateInitialAIMessage() {
            this.loading = true;
            const apiData = {
                model: "gpt-4o",
                messages: [
                    { role: "system", content: this.systemPrompt },
                    { role: "user", content: "Please start the conversation by addressing the user's misconception." },
                ],
                max_tokens: 2000,
                temperature: 0.7,
            };

            try {
                const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    },
                });

                const initialMessage = response.data.choices[0].message.content.trim();
                this.initialSystemMessage = initialMessage;
                this.messages.push({ role: 'assistant', content: initialMessage });
                this.firstMsgTime = new Date();
            } catch (error) {
                console.error('Error generating initial AI message:', error);
                this.messages.push({
                    role: 'assistant',
                    content: "I apologize, but I'm having trouble starting our conversation. Could you please share your thoughts on the physics question you answered?",
                });
            } finally {
                this.loading = false;
            }
        },
        async sendMessage() {
            if (this.userMessage.trim() === '' || this.remainingRounds <= 0) return;

            const currentTime = new Date();
            const userMessageContent = this.userMessage;

            // Set lastMessageTime to firstMsgTime during the first message
            if (this.remainingRounds === 3 && !this.lastMessageTime) {
                this.lastMessageTime = this.firstMsgTime;
            }

            // Calculate time spent since the last message
            let timeSpent = 0;
            if (this.lastMessageTime) {
                timeSpent = (currentTime - this.lastMessageTime) / 1000; // time spent in seconds
            }

            // Update lastMessageTime to the current time for next calculation
            this.lastMessageTime = currentTime;

            this.messages.push({ role: 'user', content: userMessageContent });
            this.remainingRounds--;

            const apiData = {
                model: "gpt-4o",
                messages: [
                    { role: "system", content: this.systemPrompt },
                    ...this.messages,
                ],
                max_tokens: 2000,
                temperature: 0.7,
            };

            this.userMessage = '';
            this.loading = true;

            try {
                const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    },
                });

                const modelReply = response.data.choices[0].message.content.trim();
                this.messages.push({ role: 'assistant', content: modelReply });

                const timeSpentFormatted = `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toFixed(0).padStart(2, '0')}`; // Format as mm:ss

                // Get user information from Supabase
                const userId = this.user.username;
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles_duplicate')
                    .select('display_name, group')
                    .eq('user_id', userId)
                    .single();

                if (profileError) throw profileError;

                const displayName = profileData.display_name;
                const llmType = profileData.group;

                // Save chat history
                await supabase.from('chat_history_duplicate').insert({
                    user_id: userId,
                    system_message: this.systemPrompt,
                    conversation: this.messages,
                    round: Math.ceil(this.messages.length / 2 - 1),
                    user_chat: userMessageContent,
                    model_reply: modelReply,
                    llm_type: llmType,
                    time_spent: timeSpentFormatted,
                    timestamp: new Date().toISOString(),
                    initial_message: this.initialSystemMessage,
                    question_number: this.profileData.question_queue[this.profileData.current_question_index || 0],
                });

                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            } catch (error) {
                console.error('Error communicating with the OpenAI API', error);
            } finally {
                this.loading = false;
            }

            if (this.remainingRounds === 0) {
                this.messages.push({
                    role: 'system',
                    content: "Thank you for participating in this conversation. You have used all your available inputs.",
                });
            }

            this.saveChatData();
        },
        marked(content) {
            return marked(content);
        },
        scrollToBottom() {
            const messagesContainer = this.$el.querySelector('.messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        },
        isChatFinished() {
            return this.remainingRounds <= 0;
        },
        confirmNextPage() {
            if (confirm('Are you sure you want to proceed to the next page?')) {
                this.nextPage();
            }
        },
        async nextPage() {
        this.clearChatData(); // Clear chat data before moving to the next page
        // Redirect to the post-chat belief rating page
        this.$router.push('/beliefratingpostchat');
        },
        saveChatData() {
            localStorage.setItem('chatData', JSON.stringify({
                userBeliefLevel: this.userBeliefLevel,
                questionText: this.questionText,
                explanation: this.explanation,
                systemPrompt: this.systemPrompt,
                initialSystemMessage: this.initialSystemMessage,
                messages: this.messages,
                remainingRounds: this.remainingRounds, // Add this line
                lastMessageTime: this.lastMessageTime, // Add this line for completeness
            }));
        },
    },
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
    display: flex;
    justify-content: center;
    align-items: center;
}

.input-wrapper {
    display: flex;
    align-items: center;
    width: 70%;
    max-width: 800px;
}

.rounds-indicator {
    white-space: nowrap;
    margin-right: 15px;
    font-size: 14px;
}

.rounds-indicator.green { color: green; }
.rounds-indicator.yellow { color: orange; }
.rounds-indicator.red { color: red; }
.rounds-indicator.finished { color: #999; }

input {
    flex-grow: 1;
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
    white-space: nowrap;
}

button:hover {
    background-color: #0056b3;
}

input:disabled, button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
}

.next-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #00008B; /* Dark Blue */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.next-button:hover {
  background-color: #000066; /* Darker Blue */
}
</style>
