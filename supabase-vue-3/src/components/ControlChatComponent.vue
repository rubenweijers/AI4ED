<template>
  <div class="chat-container">
    <!-- Question and Answer Section -->
    <div v-if="!questionAnswered">
      <!-- Ensure currentQuestion is loaded before rendering -->
      <div class="question" v-if="currentQuestion">
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
      <div v-else>
        <!-- Loading indicator or message while the question is being fetched -->
        <p>Loading question...</p>
      </div>
    </div>

    <!-- Chat Section -->
    <div v-else>
      <div class="messages">
        <!-- Display question, options, and user's answer at the top of the chat -->
        <div class="question-summary">
          <p><strong>Question:</strong> <span v-html="formatQuestionText(currentQuestion)"></span></p>
          <!-- Display options -->
          <div v-if="shouldDisplayLabels(currentQuestion.question_number)">
            <div
              v-for="(option, index) in getOptions(currentQuestion)"
              :key="index"
              class="option"
            >
              <p :class="{'user-answer': selectedAnswer === option}">
                <strong>{{ optionLabels[index] }}. </strong>{{ option }}
              </p>
            </div>
          </div>
          <!-- Display options without labels -->
          <div v-else>
            <div
              v-for="(option, index) in getOptions(currentQuestion)"
              :key="index"
              class="option"
            >
              <p :class="{'user-answer': selectedAnswer === option}">
                {{ option }}
              </p>
            </div>
          </div>
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
      user: null,
      profileData: null,
      questions: [],
      currentQuestionIndex: 0,
      currentQuestion: null,
      selectedAnswer: '',
      questionAnswered: false,
      optionLabels: ["A", "B", "C", "D", "E"],
      questionsWithLabels: [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18],
      timerWatcherInterval: null,
    };
  },
  async mounted() {
    try {
      await this.loadUserData();
      await this.loadQuestions();
      this.startTimer();
    } catch (error) {
      console.error('Error during component mounting:', error);
      alert('An error occurred while loading the component. Please try again.');
    }
  },
  beforeUnmount() {
    if (this.timerWatcherInterval) {
      clearInterval(this.timerWatcherInterval);
    }
  },
  methods: {
    // Load user data from localStorage and fetch profile from Supabase
    async loadUserData() {
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.log('User not authenticated');
        this.$router.push('/login');
        return;
      }
      this.user = JSON.parse(userData);
      console.log('User data:', this.user);

      // Fetch user profile from profiles_duplicate using display_name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles_duplicate')
        .select('*')
        .eq('display_name', this.user.username)
        .maybeSingle();

      if (profileError) {
        console.error(`Error fetching profile data: ${profileError.message}`);
        throw new Error(`Error fetching profile data: ${profileError.message}`);
      }
      if (!profileData) {
        console.error(`No profile data found for user: ${this.user.username}`);
        throw new Error(`No profile data found for user: ${this.user.username}`);
      }
      console.log('Fetched profileData:', profileData);
      this.profileData = profileData;
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
      if (this.questions.length > 0) {
        this.currentQuestion = this.questions[this.currentQuestionIndex];
      } else {
        console.error('No questions found in questions_control table');
      }
    },
    // Start the timer
    startTimer() {
      this.timerWatcherInterval = setInterval(() => {
        const remainingTime = this.getRemainingTime();
        if (remainingTime <= 0) {
          clearInterval(this.timerWatcherInterval);
          alert('Your study time has ended. Moving to the next section.');
          this.$router.push('/studyoriginalfci'); // Redirect to the next study phase
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
      });

      if (error) {
        console.error('Error saving answer:', error);
        alert('There was an error saving your answer. Please try again.');
        return;
      }

      // Include the answer_explanation and correct_answer in the system prompt
      const { answer_explanation, correct_answer } = this.currentQuestion;

      // Format the correct answer with label if labels are used
      let correctAnswerText = correct_answer;
      if (this.shouldDisplayLabels(this.currentQuestion.question_number)) {
        const correctIndex = ['A', 'B', 'C', 'D', 'E'].indexOf(correct_answer);
        const options = this.getOptions(this.currentQuestion);
        if (correctIndex >= 0 && correctIndex < options.length) {
          correctAnswerText = `${correct_answer}. ${options[correctIndex]}`;
        }
      }

      // Set up the system prompt including the question and user's answer
      this.systemPrompt = `You are a helpful assistant. Please have a three-round dialogue with the user regarding their answer to the following question:

"${this.formatQuestionText(this.currentQuestion)}"

Options:
${this.getFormattedOptions(this.currentQuestion)}

The user's answer was: "${this.selectedAnswer}". The correct answer is: "${correctAnswerText}". Here is an explanation for the correct answer: "${answer_explanation}". Focus on discussing their answer and any reasoning they might have had. Do not mention that you know the correct answer unless the user asks.`;

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
        // Scroll to bottom after AI responds
        this.$nextTick(() => {
          this.scrollToBottom();
        });
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
        alert('There was an error communicating with the AI. Please try again.');
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
        // Scroll to top when moving to the next question
        window.scrollTo(0, 0);
      } else {
        // No more questions, redirect to /Study_original_fci
        alert('You have completed all the questions.');
        this.$router.push('/Study_original_fci');
      }
    },
    // Format options for displaying in the prompt
    getFormattedOptions(question) {
      const options = this.getOptions(question);
      if (this.shouldDisplayLabels(question.question_number)) {
        return options.map((option, index) => `${this.optionLabels[index]}. ${option}`).join('\n');
      } else {
        return options.join('\n');
      }
    },
    // Markdown rendering for assistant messages
    marked(content) {
      return marked(content);
    },
    // Scroll to the bottom of the chat
    scrollToBottom() {
      const messagesContainer = this.$el.querySelector('.messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
/* General container for the entire component */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: #f4f6f8;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* Style for the question section */
.question {
  padding: 20px;
  background-color: #fff;
  border-left: 4px solid rgb(29, 29, 184);
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
  margin-bottom: 10px;
}

.question p {
  color: #333;
  font-size: 18px;
}

.option {
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.option:hover {
  background-color: #eef3fd;
}

input[type="radio"] {
  margin-right: 10px;
}

/* Style for the question summary (for displaying previously answered questions) */
.question-summary {
  background-color: #ececec;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.user-answer {
  font-weight: bold;
  background-color: #d1e7dd; /* Light green for user-selected answer */
  padding: 8px;
  border-radius: 8px;
}

/* Styling for submit button */
.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: rgb(29, 29, 184);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: rgb(23, 23, 250);
}

/* Chat message section */
.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f4f6f8;
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 10px;
  max-width: 80%;
}

.user-message {
  background-color: #efefef;
  color: black;
  padding: 12px;
  border-radius: 12px;
  align-self: flex-end;
}

.assistant-message {
  background-color: #d9e7ff;
  color: #333;
  padding: 12px;
  border-radius: 12px;
  align-self: flex-start;
  display: flex;
  align-items: center;
}

.assistant-message img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}

/* Input area for chat */
.input-area {
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 800px;
}

.rounds-indicator {
  margin-right: 15px;
  font-size: 14px;
  color: #666;
}

input[type="text"] {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  margin-right: 10px;
  background-color: #f0f4f8;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Loading spinner */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

/* Fixed Next button for navigation */
.next-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: rgb(29, 29, 184);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.next-button:hover {
  background-color: rgb(23, 23, 250);
}
</style>
