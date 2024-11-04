<!-- src/components/ControlChatComponent.vue -->
<template>
    <div class="chat-container">
      <!-- Display the control question -->
      <div class="question" v-if="currentQuestion">
        <label v-html="formatQuestionText(currentQuestion)"></label>
        <!-- Render options if they exist -->
        <div v-for="(option, index) in getOptions(currentQuestion)" :key="index" class="option">
          <p>
            <template v-if="shouldDisplayLabels(currentQuestion.question_number)">
              <strong>{{ optionLabels[index] }}. </strong>
            </template>
            {{ option }}
          </p>
        </div>
        <hr>
      </div>
      <!-- Chat messages -->
      <div class="messages">
        <!-- Loading indicator -->
        <div v-if="loading && messages.length === 0" class="loading">
          <p>Thinking...</p>
        </div>
        <!-- Display messages -->
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
          <div v-if="message.role === 'assistant'" class="assistant-message">
            <p v-html="marked(message.content)"></p>
          </div>
          <div v-else class="user-message">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
      <!-- Input area -->
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
        <button v-if="isChatFinished()" @click="confirmNextPage" class="next-button">Next</button>
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  import { supabase } from '../supabase';
  import { marked } from 'marked';
  
  export default {
    name: 'ControlChatComponent',
    data() {
      return {
        userMessage: '',
        messages: [],
        loading: false,
        user: null,
        profileData: null,
        currentQuestion: null,
        remainingRounds: 3,
        lastMessageTime: null,
        firstMsgTime: null,
        optionLabels: ["A", "B", "C", "D", "E"],
        questionsWithLabels: [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 29, 30],
        timerWatcherInterval: null,
      };
    },
    async mounted() {
      await this.loadDataAndSetSystemPrompt();
      this.setupTimerWatcher();
  
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    beforeUnmount() {
      if (this.timerWatcherInterval) {
        clearInterval(this.timerWatcherInterval);
      }
    },
    methods: {
      async loadDataAndSetSystemPrompt() {
        const userData = localStorage.getItem('user');
        if (userData) {
          this.user = JSON.parse(userData);
        } else {
          console.log('User not authenticated');
          this.$router.push('/login');
          return;
        }
  
        // Fetch profile data to get the user's group
        const { data: profileData, error: profileError } = await supabase
          .from('profiles_duplicate')
          .select('*')
          .eq('user_id', this.user.username)
          .maybeSingle();
  
        if (profileError) {
          console.error('Error fetching profile data:', profileError.message);
          alert('An error occurred while fetching profile data.');
          return;
        }
  
        this.profileData = profileData;
        await this.fetchControlDataAndSetSystemPrompt();
      },
      async fetchControlDataAndSetSystemPrompt() {
        try {
          let questionQueue = this.profileData.control_question_queue;
          let currentQuestionIndex = this.profileData.current_control_question_index || 0;
  
          // If control_question_queue does not exist, initialize it
          if (!questionQueue) {
            // Fetch all questions from questions_control table
            const { data: allQuestions, error: allQuestionsError } = await supabase
              .from('questions_control')
              .select('id')
              .order('id', { ascending: true });
  
            if (allQuestionsError) {
              console.error('Error fetching control questions:', allQuestionsError.message);
              alert('An error occurred while fetching control questions.');
              return;
            }
  
            questionQueue = allQuestions.map(q => q.id);
  
            // Update the profile with control_question_queue
            const { error: updateError } = await supabase
              .from('profiles_duplicate')
              .update({ control_question_queue: questionQueue })
              .eq('user_id', this.user.username);
  
            if (updateError) {
              console.error('Error updating control_question_queue in profile:', updateError.message);
              return;
            }
  
            currentQuestionIndex = 0;
          }
  
          // Check if all questions have been completed
          if (currentQuestionIndex >= questionQueue.length) {
            alert('You have completed all the questions. Thank you!');
            this.$router.push('/studyoriginalfci'); // Redirect to next phase
            return;
          }
  
          const questionId = questionQueue[currentQuestionIndex];
  
          // Fetch the current control question
          const { data: controlQuestionData, error: controlQuestionError } = await supabase
            .from('questions_control')
            .select('*')
            .eq('id', questionId)
            .single();
  
          if (controlQuestionError) {
            console.error('Error fetching control question:', controlQuestionError.message);
            alert('An error occurred while fetching the control question.');
            return;
          }
  
          this.currentQuestion = controlQuestionData;
  
          // Set the system prompt for control group
          this.systemPrompt = `You are having a neutral conversation with a user about the following topic: "${this.currentQuestion.question_text}". Engage the user in a 3-round dialogue related to this topic. Keep the conversation neutral and avoid providing any feedback or additional information beyond the question.`;
  
          // Generate the initial AI message
          await this.generateInitialAIMessage();
  
          this.saveChatData();
        } catch (error) {
          console.error('Error fetching control data:', error);
        }
      },
      async generateInitialAIMessage() {
        this.loading = true;
        const apiData = {
          model: "gpt-4",
          messages: [
            { role: "system", content: this.systemPrompt },
            { role: "user", content: "Please start the conversation by presenting the question to the user." },
          ],
          max_tokens: 200,
          temperature: 0.7,
        };
  
        try {
          // Make API call to your backend endpoint
          const response = await axios.post('/api/chat', apiData);
          const initialMessage = response.data.message;
          this.messages.push({ role: 'assistant', content: initialMessage });
          this.firstMsgTime = new Date();
        } catch (error) {
          console.error('Error generating initial AI message:', error);
          this.messages.push({
            role: 'assistant',
            content: "I'm sorry, I'm having trouble starting our conversation. Could you please share your thoughts on this topic?",
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
          model: "gpt-4",
          messages: [
            { role: "system", content: this.systemPrompt },
            ...this.messages,
          ],
          max_tokens: 200,
          temperature: 0.7,
        };
  
        this.userMessage = '';
        this.loading = true;
  
        try {
          // Make API call to your backend endpoint
          const response = await axios.post('/api/chat', apiData);
          const modelReply = response.data.message;
          this.messages.push({ role: 'assistant', content: modelReply });
  
          const timeSpentFormatted = `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toFixed(0).padStart(2, '0')}`;
  
          // Save chat history to Supabase
          await supabase.from('chat_history_control').insert({
            user_id: this.user.username,
            system_message: this.systemPrompt,
            conversation: this.messages,
            round: Math.ceil(this.messages.length / 2 - 1),
            user_chat: userMessageContent,
            model_reply: modelReply,
            llm_type: 'control',
            time_spent: timeSpentFormatted,
            timestamp: new Date().toISOString(),
            initial_message: this.messages[0].content,
            question_number: this.currentQuestion.id,
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
  
        if (this.remainingRounds === 0) {
          await this.moveToNextControlQuestion();
        }
      },
      async moveToNextControlQuestion() {
        try {
          // Update current_control_question_index
          const newIndex = (this.profileData.current_control_question_index || 0) + 1;
  
          // Update profile in Supabase
          const { error: profileUpdateError } = await supabase
            .from('profiles_duplicate')
            .update({
              current_control_question_index: newIndex,
            })
            .eq('user_id', this.user.username);
  
          if (profileUpdateError) {
            console.error('Error updating current_control_question_index:', profileUpdateError.message);
          } else {
            this.profileData.current_control_question_index = newIndex;
          }
  
          // Reset chat data
          this.messages = [];
          this.remainingRounds = 3;
          this.userMessage = '';
          this.currentQuestion = null;
          this.lastMessageTime = null;
          this.firstMsgTime = null;
  
          // Fetch next control question
          await this.fetchControlDataAndSetSystemPrompt();
        } catch (error) {
          console.error('Error moving to next control question:', error);
        }
      },
      saveChatData() {
        localStorage.setItem('controlChatData', JSON.stringify({
          messages: this.messages,
          remainingRounds: this.remainingRounds,
          lastMessageTime: this.lastMessageTime,
          currentQuestion: this.currentQuestion,
        }));
      },
      setupTimerWatcher() {
        this.timerWatcherInterval = setInterval(() => {
          const remainingTime = this.getRemainingTime();
          if (remainingTime <= 0) {
            clearInterval(this.timerWatcherInterval);
            alert('Your study time has ended. Moving to the next section.');
            this.$router.push('/studyoriginalfci'); // Redirect to the next study phase
          }
        }, 1000);
      },
      getRemainingTime() {
        const startTime = parseInt(localStorage.getItem('studyStartTime'), 10);
        const totalDuration = parseInt(localStorage.getItem('studyTotalDuration'), 10);
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000); // in seconds
        const timeLeft = totalDuration - elapsed;
        return timeLeft;
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
        if (confirm('Are you sure you want to proceed to the next question?')) {
          this.moveToNextControlQuestion();
        }
      },
      getOptions(question) {
        return [
          question.option_1,
          question.option_2,
          question.option_3,
          question.option_4,
          question.option_5,
        ].filter(option => option);
      },
      formatQuestionText(question) {
        if (!question) return '';
        const numberText = question.question_number ? question.question_number + '. ' : '';
        const formattedText = question.question_text.replace(/\\n/g, '<br>');
        return numberText + formattedText;
      },
      shouldDisplayLabels(questionNumber) {
        return this.questionsWithLabels.includes(questionNumber);
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

.question-image {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
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
