<template>
  <div class="chat-container">
    <!-- Question and Answer Section -->
    <div v-if="!questionAnswered">
      <!-- Ensure currentQuestion is loaded before rendering -->
      <div class="survey-container" v-if="currentQuestion">
        <div class="survey-question">
          <!-- Display the current question -->
          <div class="question-text">
            <p v-html="formatQuestionText(currentQuestion)"></p>
          </div>
          <!-- Display options with labels if applicable -->
          <div v-if="shouldDisplayLabels(currentQuestion.question_number)">
            <div
              v-for="(option, index) in getOptions(currentQuestion)"
              :key="index"
              class="option"
            >
              <label class="radio-label" :for="'question-' + currentQuestion.question_number + '-' + index">
                <input
                  type="radio"
                  :id="'question-' + currentQuestion.question_number + '-' + index"
                  :name="'question-' + currentQuestion.question_number"
                  :value="option"
                  v-model="selectedAnswer"
                  :disabled="questionAnswered"
                >
                <span class="radio-custom"></span>
                <span class="label-text">
                  <strong>{{ optionLabels[index] }}. </strong>{{ option }}
                </span>
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
              <label class="radio-label" :for="'question-' + currentQuestion.question_number + '-' + index">
                <input
                  type="radio"
                  :id="'question-' + currentQuestion.question_number + '-' + index"
                  :name="'question-' + currentQuestion.question_number"
                  :value="option"
                  v-model="selectedAnswer"
                  :disabled="questionAnswered"
                >
                <span class="radio-custom"></span>
                <span class="label-text">
                  {{ option }}
                </span>
              </label>
            </div>
          </div>
          <!-- Submit Answer Button -->
          <button @click="submitAnswer" :disabled="!selectedAnswer" class="submit-button">Submit Answer</button>
        </div>
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
        <div class="input-content">
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
          <button v-if="isChatFinished()" @click="nextQuestion" class="next-button">Next Question</button>
        </div>
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

      ------End of Question Statement------

      The user's answer was: "${this.selectedAnswer}". The correct answer is: "${correctAnswerText}". Here is an explanation for the correct answer: "${answer_explanation}". 

      Your goal is to inform the user of the correct answer as well as provide additional relevant information. Ask them their reasoning for choosing that question and discuss their answer. Use simple, clear language that an average person will be able to follow, and structure the conversation so they gain new knowledge on the topic at each step. At the end of each message, provide additional questions on the topic to spur further discussion and increase the knowledge of the topic for the user. `;

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
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Occupy full viewport height */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: white;
  overflow: hidden; /* Hide overflow */
}

.survey-container {
  max-width: 800px;
  margin: 0 auto 10px; /* Remove top margin */
  padding: 0 30px 30px; /* Remove top padding */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.survey-question {
  margin-bottom: 40px;
}

.question-text {
  border-left: 4px solid rgb(29, 29, 184);
  padding-left: 15px;
  margin-bottom: 10px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;
}

.submit-button:hover {
  background-color: rgb(23, 23, 250);
}

.option {
  margin-bottom: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 10px;
}

.label-text {
  font-size: 16px;
}

.messages {
  flex: 1; /* Allow messages area to expand */
  padding: 20px 20px 10px;
  padding-bottom: 100px; /* Space for input bar */
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Allow scrolling */
}

.message {
  width: 100%;
  max-width: 800px;
  margin: 5px auto 10px;
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
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ccc;
}

.input-content {
  display: flex;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
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
}

button:hover {
  background-color: rgb(23, 23, 250);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.next-button {
  background-color: #28a745;
}

.next-button:hover {
  background-color: #218838;
}

.loading {
  text-align: center;
  color: #666;
}

.loading img {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}

.question-summary {
  max-width: 800px;
  margin: 5px auto 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.user-answer {
  font-weight: bold;
  color: rgb(10, 10, 240);
}
</style>