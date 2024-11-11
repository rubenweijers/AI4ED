<template>
    <div class="chat-container">
        <!-- Existing chat messages -->
        <div class="messages">
            <!-- Start of question display -->
            <div v-if="incorrectQuestion">
            <!-- Add reminder text for specific question numbers -->
            <!-- Q2 -->
            <div v-if="incorrectQuestion.question_number === 2" class="reminder-text">
            <p><i>Reminder Q2: Two children are playing tug of war. There is a flag marking the middle of the rope as shown in the diagram. Currently, the children are pulling in opposite directions at magnitudes such that the flag translates to the left with a constant speed <i>v<sub>o</sub></i>.</i></p>
            </div>

            <!-- Questions 3 to 7 -->
            <div v-if="incorrectQuestion.question_number >= 4 && incorrectQuestion.question_number <= 7" class="additional-text">
            <p><i>Reminder: you used this statement to answer the question.</i><br>
                A person is sitting on a sled which is on a slope so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.

                <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing with force <i>F<span class="subscript">rocket</span></i> , hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.
            </p>  
            </div>

            <!-- Question 21 text as reminder for q22 -->
            <div v-if="incorrectQuestion.question_number === 22" class="additional-text">
            <p><i>Reminder: you used this statement to answer the question.</i><br>
                There is a flag on a flagpole marking 30 m above ground. Two cannonballs, one four times heavier than the other, are simultaneously fired straight up from the ground with identical initial velocities. What can you say about the time each cannonball takes to reach the flag’s height? Ignore air resistance.
            </p>  
            </div>

            <!-- Question 26 text as reminder for q27 -->
            <div v-if="incorrectQuestion.question_number === 27" class="additional-text">
            <p><i>Reminder: you used this statement to answer the question.</i><br>
                A basketball player is standing on a court, dribbling a ball. What can be said about the force(s) on the ball during the periods of time when it is traveling from the ground to the player’s hand?
            </p>  
            </div>

            <!-- Questions 28 to 30 -->
            <div v-else-if="incorrectQuestion.question_number >= 28 && incorrectQuestion.question_number <= 30" class="additional-text">
            <p><i>Reminder: you used this statement to answer the question.</i> <br>
                A person is sitting on a sled which is on a slope so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.

                <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing with force <i>F<span class="subscript">rocket</span></i> , hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.

                <br><br><u>This time however, they have equipped the sled with a cannon aimed directly up the slope.</u>
                </p>
            </div>

            <!-- Add images before the corresponding questions -->
            <img v-if="incorrectQuestion.question_number === 1 || incorrectQuestion.question_number === 2" src="/fci_2/fci_q1.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number >= 4 && incorrectQuestion.question_number <= 7" src="/fci_2/fci_q4-7.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 4" src="/fci_2/fci_q4.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 6" src="/fci_2/fci_q6.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 11" src="/fci_2/fci_q11.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 12" src="/fci_2/fci_q12.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 13" src="/fci_2/fci_q13.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 14" src="/fci_2/fci_q14.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 16" src="/fci_2/fci_q16.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 19" src="/fci_2/fci_q19.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 23" src="/fci_2/fci_q23.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 24" src="/fci_2/fci_q24.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number >= 28 && incorrectQuestion.question_number <= 30" src="/fci_2/fci_q28-30.png" alt="Question related image" class="question-image">
            <img v-if="incorrectQuestion.question_number === 28" src="/fci_2/fci_q28.png" alt="Question related image" class="question-image">
            <br>
            <!-- Display the question text -->
            <label v-html="formatQuestionText(incorrectQuestion)"></label>

            <!-- Options Rendering with Conditional Labels -->
            <div v-for="(option, index) in getOptions(incorrectQuestion)" :key="index" class="option">
                <p :class="{'user-answer': userAnswer === option}">
                    <template v-if="shouldDisplayLabels(incorrectQuestion.question_number)">
                        <strong>{{ optionLabels[index] }}. </strong>
                    </template>
                    <span v-html="formatOptionText(option)"></span>
                </p>
            </div>
            <hr>
            <p><strong>Your answer was:</strong> <span v-html="formatOptionText(userAnswer)"></span></p>
            <p><strong>Your explanation was:</strong> <i>"{{ explanation }}"</i></p>
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
                <p>Thinking...</p>
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
                    @keydown.enter.prevent="handleEnterKey"
                    placeholder="Type a message..." 
                    :disabled="isChatFinished() || loading"
                />
                <button @click="sendMessage" :disabled="isChatFinished() || loading">Send</button>
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
            chatComplete: false,
            lastMessageTime: null,
            firstMsgTime: null,
            user: null,
            profileData: null,
            incorrectQuestion: null,
            userAnswer: '',
            optionLabels: ["A", "B", "C", "D", "E"],
            questionsWithLabels: [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 29, 30],
            timerWatcherInterval: null,
        };
    },
    async mounted() {
        this.isLoading = true;
        await this.loadDataAndSetSystemPrompt();
        this.isLoading = false;
        if (!this.incorrectQuestion) {
            console.error('Incorrect Question is not set.');
            return;
        }
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

        handleEnterKey() {
        if (this.loading || this.isChatFinished()) {
            // Do nothing if the model is generating a response or the chat is finished
            return;
        }
        this.sendMessage();
    },

        // Timer setup method
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
        // Method to calculate remaining time
        getRemainingTime() {
            const startTime = parseInt(localStorage.getItem('studyStartTime'), 10);
            const totalDuration = parseInt(localStorage.getItem('studyTotalDuration'), 10);
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000); // in seconds
            const timeLeft = totalDuration - elapsed;
            return timeLeft;
        },

        async loadDataAndSetSystemPrompt() {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
            console.log('User not authenticated');
            this.$router.push('/login');
            return;
            }
            this.user = JSON.parse(userData);

            const storedData = localStorage.getItem('chatData');
            if (storedData) {
            const parsedData = JSON.parse(storedData);
            Object.assign(this, parsedData);
            this.messages = this.messages || [{ role: 'assistant', content: this.initialSystemMessage }];
            this.remainingRounds = this.remainingRounds !== undefined ? this.remainingRounds : 3;
            } else {
            await this.fetchDataAndSetSystemPrompt();
            }
        } catch (error) {
            console.error('Error in loadDataAndSetSystemPrompt:', error);
            alert('An error occurred while loading data. Please try again.');
        }
        },

        async fetchDataAndSetSystemPrompt() {
            try {
                console.log('Starting fetchDataAndSetSystemPrompt...');

                const userData = localStorage.getItem('user');
                if (!userData) {
                    console.log('User not authenticated. Redirecting to login.');
                    this.$router.push('/login');
                    return;
                }
                this.user = JSON.parse(userData);
                console.log('User data loaded:', this.user);

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles_duplicate')
                    .select('*')
                    .eq('user_id', this.user.username)
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

                const questionQueue = this.profileData.question_queue;
                const currentQuestionIndex = parseInt(this.profileData.current_question_index, 10) || 0;
                console.log('Question queue:', questionQueue);
                console.log('Current question index:', currentQuestionIndex);

                if (!questionQueue || !Array.isArray(questionQueue) || questionQueue.length === 0) {
                    throw new Error('Question queue is empty or invalid.');
                }
                if (currentQuestionIndex < 0 || currentQuestionIndex >= questionQueue.length) {
                    throw new Error('Invalid current question index.');
                }

                const questionNumber = questionQueue[currentQuestionIndex];
                console.log('Question number:', questionNumber);

                if (typeof questionNumber !== 'number' || isNaN(questionNumber)) {
                    throw new Error(`Invalid question number: ${questionNumber}`);
                }

                console.log('Fetching answer data for user:', this.user.username, 'and question number:', questionNumber);
                const { data: answerData, error: answerError } = await supabase
                    .from('answers_posttest_denton')
                    .select('belief_rating_1, llm_summary')
                    .eq('user_id', this.user.username)
                    .eq('question_number', questionNumber)
                    .maybeSingle();

                if (answerError) {
                    console.error(`Error fetching answer data: ${answerError.message}`);
                    throw new Error(`Error fetching answer data: ${answerError.message}`);
                }
                if (!answerData) {
                    console.error('No answer data found for this user and question number.');
                    throw new Error('No answer data found for this user and question number.');
                }
                console.log('Fetched answerData:', answerData);

                this.userBeliefLevel = answerData.belief_rating_1;
                this.explanation = answerData.llm_summary;

                console.log('Fetching question data for question number:', questionNumber);
                const { data: questionData, error: questionError } = await supabase
                    .from('questions_denton')
                    .select('*')
                    .eq('question_number', questionNumber)
                    .single();

                if (questionError) {
                    console.error(`Error fetching question data: ${questionError.message}`);
                    throw new Error(`Error fetching question data: ${questionError.message}`);
                }
                if (!questionData) {
                    console.error(`No question data found for question number: ${questionNumber}`);
                    throw new Error(`No question data found for question number: ${questionNumber}`);
                }
                console.log('Fetched questionData:', questionData);

                if (!questionData.question_text_with_images_descriptions || !questionData.question_number) {
                    console.error('Incomplete question data:', questionData);
                    throw new Error('Incomplete question data.');
                }

                this.questionText = questionData.question_text_with_images_descriptions;
                this.incorrectQuestion = questionData;
                console.log('incorrectQuestion set:', this.incorrectQuestion);

                console.log('Fetching user answer for question number:', questionNumber);
                const { data: userAnswerData, error: userAnswerError } = await supabase
                    .from('answers_denton')
                    .select('answer')
                    .eq('user_id', this.user.username)
                    .eq('question_number', questionNumber)
                    .single();

                if (userAnswerError) {
                    console.error(`Error fetching user answer: ${userAnswerError.message}`);
                    throw new Error(`Error fetching user answer: ${userAnswerError.message}`);
                }
                console.log('Fetched userAnswerData:', userAnswerData);

                this.userAnswer = userAnswerData.answer || '';
                console.log('User answer set:', this.userAnswer);

                const { data: correctAnswerData, error: correctAnswerError } = await supabase
                    .from('questions_denton')
                    .select('correct_answer')
                    .eq('question_number', questionNumber)
                    .single();

                console.log('Fetched correctAnswerData:', correctAnswerData);

                if (correctAnswerError) {
                    console.error(`Error fetching correct answer: ${correctAnswerError.message}`);
                    throw new Error(`Error fetching correct answer: ${correctAnswerError.message}`);
                }

                console.log('Fetched correctAnswerData:', correctAnswerData);

                this.correctAnswer = correctAnswerData.correct_answer || '';
                // console.log('Correct answer set:', this.correctAnswer);
                this.systemPrompt =`Your goal is to very effectively persuade students to rethink and correct their misconception about the physics concept related to the question they got wrong on a conceptual physics test (like the Force Concept Inventory). You will be having a conversation with a person who specifically got this question wrong: 
                
                ${this.questionText}
                
                ------End of Question Statement------
                
                The correct answer was option ${this.correctAnswer}, but the student chose ${this.userAnswer}. Furthermore, we asked the student to provide an open-ended response explaining their reasoning for the answer, which is summarized as follows: 
                
                ${this.explanation}
                
                Please generate a response that provides gradual support to clarify their understanding, beginning from familiar ideas and building step-by-step toward the correct concept. Use relatable examples and invite reflection, encouraging them to question and reconsider their assumptions based on their own reasoning. Use simple, clear language that an average person will be able to follow, and structure the conversation so they gain confidence at each step and adjust their thinking gradually. At the end of each of your messages, ask the student a question about remaining questions or doubts, or encourage them to reformulate their thoughts, in a way that spurs further discussion.`;

                //old prompt
                //this.systemPrompt = `Your goal is to very effectively persuade users to rethink and correct their misconception about the physics concept related to the question they got wrong on the Force Concept Inventory test. You will be having a conversation with a person who, on a psychometric survey, expressed a belief level of ${this.userBeliefLevel} out of 100 (where 0 is Definitely False, 50 is Uncertain, and 100 is Definitely True) in their incorrect answer. The specific question they got wrong is: ${this.questionText}. Further, we asked the user to provide an open-ended response explaining their reasoning, which is summarized as follows: ${this.explanation}. Please generate a response that will persuade the user that their understanding is incorrect, based on their own reasoning. Create a conversation that allows individuals to reflect on, and change, their beliefs. Use simple language that an average person will be able to understand.`;
                // console.log('System prompt set:', this.systemPrompt);

                await this.generateInitialAIMessage();
                this.saveChatData();
            } catch (error) {
                console.error('Error in fetchDataAndSetSystemPrompt:', error);
                alert(error.message);
                this.$router.push('/study');
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
                const response = await axios.post('/api/openai', apiData);

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
            if (this.userMessage.trim() === '' || this.isChatFinished() || this.loading) return;

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
            this.scrollToBottom();
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
                const response = await axios.post('/api/openai', apiData);
                const aiMessage = response.data.choices[0].message.content.trim();
                this.messages.push({ role: 'assistant', content: aiMessage });

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
                    model_reply: aiMessage,
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
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
                this.chatComplete = true;
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
            // return this.remainingRounds <= 0;
            return this.chatComplete;
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
        formatOptionText(option) {
            const formattedOption = option.replace(/_sub_(.*?)_end_/g, '<span class="subscript">$1</span>');
            return formattedOption;
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