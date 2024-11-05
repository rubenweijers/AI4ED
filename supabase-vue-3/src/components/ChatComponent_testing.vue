<template>
    <div class="chat-container">
        <!-- Existing chat messages -->
        <div class="messages">
            <!-- Start of question display -->
            <div v-if="incorrectQuestion">
                <!-- Add reminder text for specific question numbers -->
                <!-- Example for Q 2 -->
                <div v-if="incorrectQuestion.question_number === 2" class="reminder-text">
                    <p><i>Reminder Q2: Two children are playing tug of war. There is a flag marking the middle of the rope as shown in the diagram. Currently, the children are pulling in opposite directions at magnitudes such that the flag translates to the left with a constant speed <i>v<sub>o</sub></i>.</i></p>
                </div>

                <!-- Example for Questions 3 to 7 -->
                <div v-if="incorrectQuestion.question_number >= 3 && incorrectQuestion.question_number <= 7" class="additional-text">
                    <p><i>Reminder: you used this statement to answer the question.</i><br>
                        A person is sitting on a sled which is on a slope. The slope is so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.

                        <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing with force <i>F<span class="subscript">rocket</span></i> , hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.
                    </p>  
                </div>

                <!-- Example for Questions 28 to 30 -->
                <div v-if="incorrectQuestion.question_number >= 28 && incorrectQuestion.question_number <= 30" class="additional-text">
                    <p><i>Reminder: you used this statement to answer the question.</i><br>
                        A person is sitting on a sled which is on a slope. The slope is so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.

                        <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing with force <i>F<span class="subscript">rocket</span></i> , hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.

                        <br><br><u>This time however, they have equipped the sled with a cannon aimed directly up the slope.</u>
                    </p>
                </div>

                <!-- Add images before the corresponding questions -->
                <img v-if="incorrectQuestion.question_number === 1 || incorrectQuestion.question_number === 2" src="/fci_2/fci_q1.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number >= 3 && incorrectQuestion.question_number <= 7" src="/fci_2/fci_q4-7.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 4" src="/fci_2/fci_q4.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 6" src="/fci_2/fci_q6.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 11" src="/fci_2/fci_q11.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 12" src="/fci_2/fci_q12.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 13" src="/fci_2/fci_q13.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 14" src="/fci_q14.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 16" src="/fci_2/fci_q16.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 19" src="/fci_2/fci_q19.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 23" src="/fci_2/fci_q23.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 24" src="/fci_2/fci_q24.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number >= 28 && incorrectQuestion.question_number <= 30" src="/fci_2/fci_q28-30.png" alt="Question related image" class="question-image">
                <img v-if="incorrectQuestion.question_number === 28" src="/fci_2/fci_q28.png" alt="Question related image" class="question-image">

                <!-- Display the question text -->
                <label v-html="formatQuestionText(incorrectQuestion)"></label>

                <!-- Options Rendering with Conditional Labels -->
                <div v-for="(option, index) in getOptions(incorrectQuestion)" :key="index" class="option">
                    <p :class="{'user-answer': userAnswer === option}">
                        <template v-if="shouldDisplayLabels(incorrectQuestion.question_number)">
                            <strong>{{ optionLabels[index] }}. </strong>
                        </template>
                        {{ option }}
                    </p>
                </div>
                <hr>
                <p><strong>Your answer was:</strong> {{ userAnswer }}</p>
            </div>
            <!-- End of question display -->
            <div v-if="loading && messages.length === 0" class="loading">
                <img src="/loading_spinner.gif" alt="Loading" />
                <p>Thinking...</p>
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
import { marked } from 'marked';
import { supabase } from '../supabase';
import ToastNotification from '../components/ToastNotification.vue';

export default {
    name: 'ChatComponent',
    components: {
        ToastNotification,
    },
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
            profileData: null,
            incorrectQuestion: null,
            userAnswer: '',
            optionLabels: ["A", "B", "C", "D", "E"],
            questionsWithLabels: [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 29, 30],
            timerWatcherInterval: null,
            showToast: false,
        };
    },
    async mounted() {
        await this.checkUser();
        this.$nextTick(() => {
            this.scrollToBottom();
        });
        // Setup the timer watcher on component mount
        this.setupTimerWatcher();
    },
    beforeUnmount() { // Use beforeUnmount instead of beforeDestroy
        // Clear the timer interval when the component is destroyed
        if (this.timerWatcherInterval) {
            clearInterval(this.timerWatcherInterval);
        }
    },
    methods: {
        // Toast notifications
        showToastNotification() {
            this.showToast = true;
        },
        confirmSubmit() {
            this.showToast = false;
            this.checkValid();
        },
        cancelSubmit() {
            this.showToast = false;
        },

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
            this.incorrectQuestion = null;
            this.userAnswer = '';
        },

        async checkUser() {
            const userData = localStorage.getItem('user');
            if (userData) {
                this.user = JSON.parse(userData);
                await this.fetchUserProfile();
                await this.fetchIncorrectQuestion();
                // After fetching the incorrect question, set up the system prompt
                await this.setupSystemPrompt();
            } else {
                this.$router.push('/login'); // Redirect to login if no user is found
            }
            this.loading = false;
        },

        async fetchUserProfile() {
            const { data, error } = await supabase
                .from('profiles_duplicate')
                .select('*')
                .eq('user_id', this.user.username)
                .maybeSingle();

            if (error) {
                console.error('Error fetching user profile:', error.message);
                alert('Error fetching user profile. Please try again.');
            } else if (data === null) {
                console.error('No profile found for user');
                alert('No profile found for user. Please complete your profile.');
                // Handle case where no profile is found
            } else {
                this.profileData = data;
            }
        },

        async fetchIncorrectQuestion() {
            try {
                if (!this.profileData.question_queue || this.profileData.question_queue.length === 0) {
                    console.error('No question queue found. Please complete the FCI test first.');
                    alert('No question queue found. Please complete the FCI test first.');
                    this.$router.push('/study'); // Redirect to the study page
                    return;
                }

                const currentIndex = this.profileData.current_question_index || 0;
                const questionQueue = this.profileData.question_queue;

                if (currentIndex >= questionQueue.length) {
                    // No more questions to display
                    this.incorrectQuestion = null;
                    return;
                }

                const nextQuestionNumber = questionQueue[currentIndex];

                // Fetch the question from 'questions_denton' table
                const { data: questionData, error: questionError } = await supabase
                    .from('questions_denton')
                    .select('*')
                    .eq('question_number', nextQuestionNumber)
                    .single();

                if (questionError) {
                    console.error('Error fetching question:', questionError.message);
                    alert('Error fetching question. Please try again.');
                    return;
                }

                this.incorrectQuestion = questionData;

                // Fetch user's answer from 'answers_denton' table
                const { data: userAnswerData, error: userAnswerError } = await supabase
                    .from('answers_denton')
                    .select('answer')
                    .eq('user_id', this.user.username)
                    .eq('question_number', nextQuestionNumber)
                    .single();

                if (userAnswerError) {
                    console.error('Error fetching user answer:', userAnswerError.message);
                    alert('Error fetching your answer. Please try again.');
                    return;
                }

                this.userAnswer = userAnswerData.answer || '';
            } catch (error) {
                console.error('An unexpected error occurred:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        },

        async setupSystemPrompt() {
            try {
                if (!this.incorrectQuestion) return;

                const questionNumber = this.incorrectQuestion.question_number;

                // Fetch answer data for belief_rating_1 and llm_summary
                const { data: answerData, error: answerError } = await supabase
                    .from('answers_posttest_denton')
                    .select('belief_rating_1, llm_summary')
                    .eq('user_id', this.user.username)
                    .eq('question_number', questionNumber)
                    .maybeSingle();

                if (answerError) {
                    console.error(`Error fetching answer data: ${answerError.message}`);
                    alert(`Error fetching answer data: ${answerError.message}`);
                    return;
                }
                if (!answerData) {
                    console.error('No answer data found for this user and question number.');
                    alert('No answer data found for your answer. Please provide an explanation.');
                    return;
                }

                this.userBeliefLevel = answerData.belief_rating_1;
                this.explanation = answerData.llm_summary;

                // Set the system prompt
                this.systemPrompt = `Your goal is to very effectively persuade users to rethink and correct their misconception about the physics concept related to the question they got wrong on the Force Concept Inventory test. You will be having a conversation with a person who, on a psychometric survey, expressed a belief level of ${this.userBeliefLevel} out of 100 (where 0 is Definitely False, 50 is Uncertain, and 100 is Definitely True) in their incorrect answer. The specific question they got wrong is: ${this.questionText = this.incorrectQuestion.question_text}. Further, we asked the user to provide an open-ended response explaining their reasoning, which is summarized as follows: ${this.explanation}. Please generate a response that will persuade the user that their understanding is incorrect, based on their own reasoning. Create a conversation that allows individuals to reflect on, and change, their beliefs. Use simple language that an average person will be able to understand.`;

                // Generate the initial AI message
                await this.generateInitialAIMessage();
                this.saveChatData();
            } catch (error) {
                console.error('Error in setupSystemPrompt:', error);
                alert('Error setting up the chat. Please try again.');
            }
        },

        async generateInitialAIMessage() {
            this.loading = true;

            // Initialize messages with the system prompt and the initial user message
            const messages = [
                { role: "system", content: this.systemPrompt },
                { role: "user", content: "Please start the conversation by addressing the user's misconception." },
            ];

            try {
                const response = await axios.post('/api/chat', {
                    messages,
                    model: "gpt-4",
                    max_tokens: 2000,
                    temperature: 0.7,
                });

                const initialMessage = response.data.reply;
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

            this.scrollToBottom();
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

            try {
                const response = await axios.post('/api/chat', {
                    messages: this.messages,
                    model: "gpt-4",
                    max_tokens: 2000,
                    temperature: 0.7,
                });

                const modelReply = response.data.reply;
                this.messages.push({ role: 'assistant', content: modelReply });

                const timeSpentFormatted = `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toFixed(0).padStart(2, '0')}`; // Format as mm:ss

                // Get user information from Supabase
                const userId = this.user.username;
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles_duplicate')
                    .select('display_name, group')
                    .eq('user_id', userId)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile data:', profileError.message);
                    throw profileError;
                }

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

                this.scrollToBottom();
            } catch (error) {
                console.error('Error communicating with the Chat API:', error);
                alert('Error communicating with the chat service. Please try again.');
            } finally {
                this.loading = false;
            }

            if (this.remainingRounds === 0) {
                this.messages.push({
                    role: 'system',
                    content: "Thank you for participating in this conversation. You have used all your available inputs.",
                });
                this.scrollToBottom();
            }

            this.saveChatData();
        },

        formatMessage(content) {
            return marked(content);
        },

        scrollToBottom() {
            const messagesContainer = this.$el.querySelector('.messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
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
            const chatData = {
                userBeliefLevel: this.userBeliefLevel,
                questionText: this.questionText,
                explanation: this.explanation,
                systemPrompt: this.systemPrompt,
                initialSystemMessage: this.initialSystemMessage,
                messages: this.messages,
                remainingRounds: this.remainingRounds,
                lastMessageTime: this.lastMessageTime,
                incorrectQuestion: this.incorrectQuestion, // Ensure this is included
                userAnswer: this.userAnswer, // Ensure this is included
            };
            console.log('Saving chatData:', chatData);
            localStorage.setItem('chatData', JSON.stringify(chatData));
        },

        shouldDisplayLabels(questionNumber) {
            return this.questionsWithLabels.includes(questionNumber);
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
            const numberText = question.question_number + '. ';
            const formattedText = question.question_text.replace(/\\n/g, '<br>');
            return numberText + formattedText;
        },

        checkValid() {
            if (this.isExplanationValid()) {
                this.submitExplanation();
            }
        },

        isExplanationValid() {
            if (!this.explanation || this.explanation.trim().length === 0) {
                alert("Please provide an explanation before submitting.");
                return false;
            }

            const wordCount = this.explanation.trim().split(/\s+/).length;
            if (wordCount < 10) {
                alert("Your explanation is too short. Please provide a more detailed explanation containing at least 10 words.");
                return false;
            }

            return true;
        },

        async submitExplanation() {
            try {
                // Prepare the data to upsert
                const upsertData = {
                    user_id: this.user.username,
                    question_number: this.incorrectQuestion.question_number,
                    explanation: this.explanation,
                };

                // Perform the upsert operation
                const { error } = await supabase
                    .from('answers_posttest_denton')
                    .upsert(upsertData, { 
                        onConflict: 'user_id,question_number',
                        returning: 'minimal' 
                    });

                if (error) {
                    console.error('Error submitting explanation:', error.message);
                    alert('Error submitting your explanation. Please try again.');
                    return;
                }

                // Call OpenAI API to summarize the explanation
                const summary = await this.summarizeExplanation(this.explanation);

                // Update the row with the summarized explanation
                const { error: updateError } = await supabase
                    .from('answers_posttest_denton')
                    .update({ llm_summary: summary })
                    .eq('user_id', this.user.username)
                    .eq('question_number', this.incorrectQuestion.question_number);

                if (updateError) {
                    console.error('Error updating row with summary:', updateError.message);
                    alert('Error updating summary. Please try again.');
                    return;
                }

                // Update current_question_index
                const newIndex = this.profileData.current_question_index + 1;

                const { error: profileUpdateError } = await supabase
                    .from('profiles_duplicate')
                    .update({
                        current_question_index: newIndex,
                    })
                    .eq('user_id', this.user.username);

                if (profileUpdateError) {
                    console.error('Error updating current_question_index:', profileUpdateError.message);
                    alert('Error updating your progress. Please try again.');
                } else {
                    this.profileData.current_question_index = newIndex;
                }

                // Display submission success notification
                this.showToastNotification();

                // Optionally, navigate to belief rating page after confirmation
                // await this.$router.push('/beliefrating'); // Uncomment if needed

            } catch (error) {
                console.error('An unexpected error occurred:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        },

        async summarizeExplanation(explanation) {
            try {
                const response = await axios.post('/api/summarize', { explanation });
                return response.data.summary;
            } catch (error) {
                console.error('Error communicating with the summarization API', error);
                alert('Error summarizing your explanation. Please try again.');
                return '';
            }
        },
    }
}
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


.user-message p {
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

button:hover {
    background-color: #0056b3;
}

.next-button:hover {
    background-color: #000066; /* Darker Blue */
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
</style>