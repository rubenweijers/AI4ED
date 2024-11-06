<template>
  <div class="chat-container">
    <!-- Question and Answer Section -->
    <div v-if="!questionAnswered">
      <div class="question">
        <!-- Display the current question -->
        <p v-html="formatQuestionText(currentQuestion)"></p>
        <!-- Display options with labels if applicable -->
        <div v-if="shouldDisplayLabels(currentQuestion.question_number)">
          <div
            v-for="(option, index) in getOptions(currentQuestion)"
            :key="index"
            class="option"
          >
            <label>
              <input
                type="radio"
                :value="option"
                v-model="selectedAnswer"
                :disabled="questionAnswered"
              />
              <strong>{{ optionLabels[index] }}. </strong>{{ option }}
            </label>
          </div>
        </div>
        <!-- Display options without labels -->
        <div v-else>
          <div
            v-for="(option, index) in getOptions(currentQuestion)"
            :key="index"
            class="option"
          >
            <label>
              <input
                type="radio"
                :value="option"
                v-model="selectedAnswer"
                :disabled="questionAnswered"
              />
              {{ option }}
            </label>
          </div>
        </div>
        <!-- Submit Answer Button -->
        <button @click="submitAnswer" :disabled="!selectedAnswer">Submit Answer</button>
      </div>
    </div>

    <!-- Chat Section -->
    <div v-else>
      <div class="messages">
        <!-- Display question and user's answer at the top of the chat -->
        <div class="question-summary">
          <p><strong>Question:</strong> <span v-html="formatQuestionText(currentQuestion)"></span></p>
          <p><strong>Your Answer:</strong> {{ selectedAnswer }}</p>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading && messages.length === 0" class="loading">
          <img src="/loading_spinner.gif" alt="Loading" />
          <p>Thinking...</p>
        </div>

        <!-- Chat Messages -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role]"
        >
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

      <!-- Input Area -->
      <div class="input-area">
        <div class="input-wrapper">
          <div class="rounds-indicator">
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
        <button v-if="isChatFinished()" @click="nextQuestion" class="next-button">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked';
import { supabase } from '../supabase';

export default {
  name: 'ControlChatComponent',
  data() {
    return {
      userMessage: '',
      messages: [],
      loading: false,
      systemPrompt: '',
      remainingRounds: 3,
      lastMessageTime: null,
      user: null,
      questions: [],
      currentQuestionIndex: 0,
      currentQuestion: null,
      selectedAnswer: '',
      questionAnswered: false,
      optionLabels: ["A", "B", "C", "D", "E"],
      questionsWithLabels: [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18], // Update this array based on your labeled questions
      timerWatcherInterval: null,
      totalQuestions: 18, // Total number of questions
    };
  },
  async mounted() {
    await this.loadUserData();
    await this.loadQuestions();
    this.startTimer();
  },
  beforeUnmount() {
    if (this.timerWatcherInterval) {
      clearInterval(this.timerWatcherInterval);
    }
  },
  methods: {
    // Load user data from localStorage
    async loadUserData() {
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.log('User not authenticated');
        this.$router.push('/login');
        return;
      }
      this.user = JSON.parse(userData);
    },
    // Load questions from Supabase
    async loadQuestions() {
      const { data: questionsData, error } = await supabase
        .from('questions_control')
        .select('*')
        .order('question_number', { ascending: true });

      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }

      this.questions = questionsData;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    },
    // Start the timer
    startTimer() {
      // Start time and duration should be stored in localStorage
      this.timerWatcherInterval = setInterval(() => {
        const remainingTime = this.getRemainingTime();
        if (remainingTime <= 0) {
          clearInterval(this.timerWatcherInterval);
          alert('Your study time has ended. Moving to the next section.');
          this.$router.push('/Study_original_fci'); // Redirect to the next study phase
        }
      }, 1000);
    },
    // Calculate remaining time
    getRemainingTime() {
      const startTime = parseInt(localStorage.getItem('studyStartTime'), 10);
      const totalDuration = parseInt(localStorage.getItem('studyTotalDuration'), 10);
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000); // in seconds
      const timeLeft = totalDuration - elapsed;
      return timeLeft;
    },
    // Format question text
    formatQuestionText(question) {
      const numberText = question.question_number + '. ';
      const formattedText = question.question_text.replace(/\\n/g, '<br>');
      return numberText + formattedText;
    },
    // Get options for the current question
    getOptions(question) {
      return [
        question.option_1,
        question.option_2,
        question.option_3,
        question.option_4,
        question.option_5,
      ].filter((option) => option);
    },
    // Determine if labels should be displayed for a question
    shouldDisplayLabels(questionNumber) {
      return this.questionsWithLabels.includes(questionNumber);
    },
    // Submit the selected answer
    async submitAnswer() {
      // Save the answer to answers_control table
      const { error } = await supabase.from('answers_control').insert({
        user_id: this.user.username,
        question_number: this.currentQuestion.question_number,
        answer: this.selectedAnswer,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error('Error saving answer:', error);
        return;
      }

      // Set up the system prompt including the question and user's answer
      this.systemPrompt = `You are a helpful assistant. Please have a three-round dialogue with the user regarding their answer to the following question: "${this.formatQuestionText(this.currentQuestion)}". The user's answer was: "${this.selectedAnswer}". Focus on discussing their answer and any reasoning they might have had.`;

      this.remainingRounds = 3;
      this.messages = [];
      this.questionAnswered = true;

      // Generate initial AI message
      await this.generateInitialAIMessage();
    },
    // Generate the initial AI message
    async generateInitialAIMessage() {
      this.loading = true;
      const apiData = {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: this.systemPrompt },
          {
            role: 'user',
            content: 'Please start the conversation by discussing the question and my answer.',
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      };

      try {
        const response = await axios.post('/api/openai', apiData);
        const initialMessage = response.data.choices[0].message.content.trim();
        this.messages.push({ role: 'assistant', content: initialMessage });
      } catch (error) {
        console.error('Error generating initial AI message:', error);
        this.messages.push({
          role: 'assistant',
          content: "I apologize, but I'm having trouble starting our conversation.",
        });
      } finally {
        this.loading = false;
      }
    },
    // Send a message in the chat
    async sendMessage() {
      if (this.userMessage.trim() === '' || this.remainingRounds <= 0) return;

      const userMessageContent = this.userMessage;

      this.messages.push({ role: 'user', content: userMessageContent });
      this.remainingRounds--;

      const apiData = {
        model: 'gpt-4o',
        messages: [{ role: 'system', content: this.systemPrompt }, ...this.messages],
        max_tokens: 2000,
        temperature: 0.7,
      };

      this.userMessage = '';
      this.loading = true;

      try {
        const response = await axios.post('/api/openai', apiData);
        const aiMessage = response.data.choices[0].message.content.trim();
        this.messages.push({ role: 'assistant', content: aiMessage });

        // Optionally, save chat history
        await supabase.from('control_chat_history').insert({
          user_id: this.user.username,
          question_number: this.currentQuestion.question_number,
          conversation: this.messages,
          timestamp: new Date().toISOString(),
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
          content:
            'Thank you for participating in this conversation. You have used all your available inputs.',
        });
      }
    },
    // Check if the chat is finished
    isChatFinished() {
      return this.remainingRounds <= 0;
    },
    // Proceed to the next question
    nextQuestion() {
      if (this.currentQuestionIndex + 1 < this.questions.length) {
        this.currentQuestionIndex++;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.selectedAnswer = '';
        this.questionAnswered = false;
        this.userMessage = '';
        this.messages = [];
      } else {
        // No more questions, redirect to /Study_original_fci
        alert('You have completed all the questions.');
        this.$router.push('/Study_original_fci');
      }
    },
    // Markdown rendering for assistant messages
    marked(content) {
      return marked(content);
    },
    // Scroll to the bottom of the chat
    scrollToBottom() {
      const messagesContainer = this.$el.querySelector('.messages');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: white;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
}

.message {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 10px;
}

.user-message {
  background-color: #efefef;
  color: black;
  padding: 10px;
  border-radius: 20px;
  margin-left: auto;
  max-width: 70%;
}

.assistant-message {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
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

.input-wrapper {
  display: flex;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.rounds-indicator {
  white-space: nowrap;
  margin-right: 15px;
  font-size: 14px;
}

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

.next-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #00008B;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

input:disabled,
button:disabled {
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

.next-button:hover {
  background-color: #000066; /* Darker Blue */
}

.option {
  margin-bottom: 10px;
}

.question {
  padding: 20px;
  background-color: #f9f9f9;
}

.question-summary {
  background-color: #ececec;
  padding: 10px;
  margin-bottom: 10px;
}
</style>