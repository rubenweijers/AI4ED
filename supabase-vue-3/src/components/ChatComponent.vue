<template>
    <div class="chat-container">
        <!-- Existing chat messages -->
        <div class="messages">
            <!-- Start of question display -->
            <div v-if="incorrectQuestion" class="question-content">
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
          <div v-if="incorrectQuestion.question_number === 6" class="additional-text">
          <p>
            Two preceding questions asked about what happens when the rocket turns off for two seconds.
          </p>  
          </div>

          <div v-if="incorrectQuestion.question_number === 7" class="additional-text">
          <p>
            Two preceding questions asked about what happens when the rocket turns off for two seconds.
          </p>  
          </div>

          <div v-if="incorrectQuestion.question_number === 5" class="additional-text">
          <p>
            The rocket shuts off for 2 seconds.
          </p>  
          </div>

          <div v-if="incorrectQuestion.question_number === 9" class="additional-text">
          <p>
            A boat is in a river trying to go upstream. The river water flows at a constant speed. The motor is running hard enough that it is able to move upstream at a constant velocity as viewed from a person on shore.
          </p>  
          </div>

          <div v-if="incorrectQuestion.question_number === 10" class="additional-text">
          <p>
            A boat is in a river trying to go upstream. The river water flows at a constant speed. The motor is running hard enough that it is able to move upstream at a constant velocity as viewed from a person on shore. The boat turns off its engine and begins to slow down as observed from the shore.
          </p>  
          </div>

          <!-- Question 21 text as reminder for q22 -->
          <div v-if="incorrectQuestion.question_number === 22" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i><br>
            There is a flag on a flagpole marking 30 m above ground. Two cannonballs, one four times heavier than the other, are simultaneously fired straight up from the ground with identical initial velocities. What can you say about the time each cannonball takes to reach the flag’s height? Ignore air resistance.
          </p>  
          </div>

          <div v-else-if="incorrectQuestion.question_number === 24" class="additional-text">
          <p><i><i>Reminder: you used this statement to answer the question.</i><br> 
          A car rounds a circular bend in the road. As it rounds the bend, it is also slowing down. A preceding question asked about the forces on the car.</i> <br>
            </p>
        </div>

          <!-- Question 26 text as reminder for q27 -->
          <div v-if="incorrectQuestion.question_number === 27" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i><br>
            A basketball player is standing on a court, dribbling a ball.
          </p>  
          </div>

        <!-- Questions 28 to 30 -->
        <div v-else-if="incorrectQuestion.question_number >= 28 && incorrectQuestion.question_number <= 30" class="additional-text">
          <p><i>Reminder: you used this statement to answer the question.</i> <br>
            A person is sitting on a sled which is on a slope so icy that friction is negligible. They are trying to cross from one side of the slope to the other without falling down the slope. To do this, they have mounted a rocket on the sled which provides a force up the slope, against the direction they would fall.

              <br><br>Suppose the person kicks off from the side rail in the direction of the other side rail. The rocket is firing with force <i>F<span class="subscript">rocket</span></i> , hard enough to keep them from falling down the slope. They have an initial speed <i>v<span class="subscript"></span></i> moving directly across the slope.

              <br><br><u>This time however, they have equipped the sled with a pressurized air cannon aimed directly up the slope. Firing the cannon releases a sudden, momentary blast of air in the direction it is aimed.</u>
            </p>
        </div>

        <div v-if="incorrectQuestion.question_number === 29" class="additional-text">
          <p>
            A preceding question asked about the path of the sled after the cannon is fired.
          </p>  
          </div>

         <!-- Questions 28 to 30 -->
         <div v-else-if="incorrectQuestion.question_number === 30" class="additional-text">
          <p><i>The person on the sled fires the cannon, and it moves along one of the paths given in a preceding question..</i> <br>
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
                    <div v-html="marked(message.content)"></div>
                </div>
                <div v-else class="user-message">
                    <div v-html="marked(message.content)"></div>
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
            <button v-if="isChatFinished() || messages.length > 1" @click="confirmNextPage" class="next-button" :disabled="loading">Next</button>
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
            remainingRounds: 5, // User gets 5 messages
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
            // --- Defaults (will be potentially overwritten by localStorage or fetch) ---
            modelToUse: 'gpt-4o', // Default model, might change based on group or localStorage
            temperature: 0.7,   // Default temperature, might change based on group or localStorage
        };
    },
    async mounted() {
        this.loading = true;
        await this.loadDataAndSetSystemPrompt(); // This will handle loading/fetching and setting the model
        this.loading = false;
        if (!this.incorrectQuestion && this.messages.length <= 1) { // Check if incorrectQuestion is null AND it's not just a refresh with existing messages
            console.error('Incorrect Question is not set, and no prior chat data loaded.');
             // Maybe redirect or show an error message
             // this.$router.push('/error-page'); // Example redirect
            return;
        }
        this.$nextTick(() => {
            this.scrollToBottom();
        });
        // Setup the timer watcher on component mount
        this.setupTimerWatcher();
    },
    beforeUnmount() {
        if (this.timerWatcherInterval) {
            clearInterval(this.timerWatcherInterval);
        }
    },
    methods: {
        // Helper: Sends API request with retries
        async sendApiRequest(apiData) {
            const maxAttempts = 5;
            const delayMs = 1000;
            let attempt = 0;
            while (attempt < maxAttempts) {
                try {
                    return await axios.post('/api/openai', apiData);
                } catch (error) {
                    attempt++;
                    console.error(`Attempt ${attempt} failed:`, error);
                    if (attempt < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                    } else {
                        throw error;
                    }
                }
            }
        },

        clearChatData() {
            localStorage.removeItem('chatData');
            // Reset all relevant data properties
            this.userMessage = '';
            this.messages = [];
            this.loading = false;
            this.systemPrompt = '';
            this.userBeliefLevel = null;
            this.questionText = '';
            this.explanation = '';
            this.initialSystemMessage = '';
            this.remainingRounds = 5; // Reset rounds
            this.chatComplete = false; // Reset completion status
            this.lastMessageTime = null;
            this.firstMsgTime = null;
            this.incorrectQuestion = null;
            this.userAnswer = '';
            this.modelToUse = 'gpt-4o'; // Reset to default model
            this.temperature = 0.7; // Reset to default temperature
        },

        handleEnterKey() {
            if (this.loading || this.isChatFinished()) {
                return;
            }
            this.sendMessage();
        },

        setupTimerWatcher() {
            // ... (timer watcher code remains the same)
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
            // ... (timer calculation remains the same)
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
                    this.$router.push('/login');
                    return;
                }
                this.user = JSON.parse(userData);

                const storedData = localStorage.getItem('chatData');
                if (storedData) {
                    console.log('Loading chat data from localStorage...');
                    const parsedData = JSON.parse(storedData);
                    Object.assign(this, parsedData); // Load most data

                    // *** CHANGE: Explicitly load model and temperature if available ***
                    this.modelToUse = parsedData.modelToUse || this.modelToUse; // Keep loaded model or default if not found
                    this.temperature = parsedData.temperature || this.temperature; // Keep loaded temp or default if not found

                    // Ensure messages array exists, default to initial message if needed
                    this.messages = this.messages && this.messages.length > 0
                        ? this.messages
                        : [{ role: 'assistant', content: this.initialSystemMessage || "Welcome back! Let's continue our discussion." }];

                    // Ensure remainingRounds has a valid value
                    this.remainingRounds = typeof this.remainingRounds === 'number' ? this.remainingRounds : 5;
                    this.chatComplete = this.remainingRounds <= 0; // Recalculate chatComplete based on loaded rounds

                    console.log('Loaded model:', this.modelToUse, 'Temperature:', this.temperature);
                    console.log('Loaded rounds remaining:', this.remainingRounds);

                } else {
                    console.log('No chat data in localStorage, fetching fresh data...');
                    // Only fetch fresh data if nothing is in localStorage
                    await this.fetchDataAndSetSystemPrompt();
                }
            } catch (error) {
                console.error('Error in loadDataAndSetSystemPrompt:', error);
                // Provide feedback to the user
                alert('An error occurred while loading your chat session. Please try refreshing the page or returning to the study section.');
                 // Optionally clear potentially corrupted localStorage data
                 // localStorage.removeItem('chatData');
                 // Redirect user
                 // this.$router.push('/study');
            }
        },


        async fetchDataAndSetSystemPrompt() {
            // This function now primarily runs on the *first* visit or when localStorage is empty.
            // It sets the model/temperature based on the group fetched from Supabase.
             try {
                // console.log('Starting fetchDataAndSetSystemPrompt...');

                const userData = localStorage.getItem('user');
                if (!userData) {
                    // console.log('User not authenticated. Redirecting to login.');
                    this.$router.push('/login');
                    return;
                }
                this.user = JSON.parse(userData);
                // console.log('User data loaded:', this.user);

                const { data: profileData, error: profileError } = await supabase
                    .from('2_profiles')
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
                // console.log('Fetched profileData:', profileData);
                this.profileData = profileData;

                // *** CHANGE: Set model and temperature based on group for initial fetch ***
                if (this.profileData.group === 'experimental_4o') {
                    this.modelToUse = 'gpt-4o';
                    this.temperature = 0.7;
                } else if (this.profileData.group === 'experimental_o3') {
                    this.modelToUse = 'o3-mini';
                    this.temperature = 1.0;
                } else {
                    console.warn(`Unknown group: ${this.profileData.group}. Defaulting to GPT-4o.`);
                    this.modelToUse = 'gpt-4o'; // Fallback default
                    this.temperature = 0.7;    // Fallback default
                }
                 console.log('Initial fetch set model:', this.modelToUse, 'Temperature:', this.temperature);


                const questionQueue = this.profileData.question_queue;
                const currentQuestionIndex = parseInt(this.profileData.current_question_index, 10) || 0;
                // console.log('Question queue:', questionQueue);
                // console.log('Current question index:', currentQuestionIndex);

                if (!questionQueue || !Array.isArray(questionQueue) || questionQueue.length === 0) {
                    throw new Error('Question queue is empty or invalid.');
                }
                if (currentQuestionIndex < 0 || currentQuestionIndex >= questionQueue.length) {
                    throw new Error('Invalid current question index.');
                }

                const questionNumber = questionQueue[currentQuestionIndex];
                // console.log('Question number:', questionNumber);

                if (typeof questionNumber !== 'number' || isNaN(questionNumber)) {
                    throw new Error(`Invalid question number: ${questionNumber}`);
                }

                // console.log('Fetching answer data for user:', this.user.username, 'and question number:', questionNumber);
                const { data: answerData, error: answerError } = await supabase
                    .from('2_posttest_answers')
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
                // console.log('Fetched answerData:', answerData);

                this.userBeliefLevel = answerData.belief_rating_1;
                this.explanation = answerData.llm_summary;

                // console.log('Fetching question data for question number:', questionNumber);
                const { data: questionData, error: questionError } = await supabase
                    .from('questions_modified')
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
                // console.log('Fetched questionData:', questionData);

                if (!questionData.question_text_with_images_descriptions || !questionData.question_number) {
                    console.error('Incomplete question data:', questionData);
                    throw new Error('Incomplete question data.');
                }

                this.questionText = questionData.question_text_with_images_descriptions;
                this.incorrectQuestion = questionData;
                // console.log('incorrectQuestion set:', this.incorrectQuestion);

                // console.log('Fetching user answer for question number:', questionNumber);
                const { data: userAnswerData, error: userAnswerError } = await supabase
                    .from('2_answers_modified')
                    .select('answer')
                    .eq('user_id', this.user.username)
                    .eq('question_number', questionNumber)
                    .single();

                if (userAnswerError) {
                    console.error(`Error fetching user answer: ${userAnswerError.message}`);
                    throw new Error(`Error fetching user answer: ${userAnswerError.message}`);
                }
                // console.log('Fetched userAnswerData:', userAnswerData);

                this.userAnswer = userAnswerData.answer || '';
                // console.log('User answer set:', this.userAnswer);

                const { data: correctAnswerData, error: correctAnswerError } = await supabase
                    .from('questions_modified')
                    .select('correct_answer')
                    .eq('question_number', questionNumber)
                    .single();

                // console.log('Fetched correctAnswerData:', correctAnswerData);

                if (correctAnswerError) {
                    console.error(`Error fetching correct answer: ${correctAnswerError.message}`);
                    throw new Error(`Error fetching correct answer: ${correctAnswerError.message}`);
                }

                // console.log('Fetched correctAnswerData:', correctAnswerData);

                this.correctAnswer = correctAnswerData.correct_answer || '';
                // console.log('Correct answer set:', this.correctAnswer);
                this.systemPrompt =`Your goal is to very effectively persuade students to rethink and correct their misconception about the physics concept related to the question they got wrong on a conceptual physics test (like the Force Concept Inventory). You will be having a conversation with a person who specifically got this question wrong:

                ${this.questionText}

                ------End of Question Statement------

                The correct answer was option ${this.correctAnswer}, but the student chose option ${this.userAnswer}. Furthermore, we asked the student to provide an open-ended response explaining their reasoning for the answer, which is summarized as follows:

                ${this.explanation || 'The user did not provide a detailed explanation'}

                IMPORTANT FORMATTING RULES:
                - Use standard Markdown for formatting (bold, italics, lists, headers).
                - When using subscript for simple text labels, variable names, or formulas, use HTML <sub> tags. For example: H<sub>2</sub>O, v<sub>final</sub>. Do NOT use LaTeX underscores (_) or other math-specific syntax.

                Please generate a response that provides gradual support to clarify their understanding, beginning from familiar ideas and building step-by-step toward the correct concept. Use relatable examples and invite reflection, encouraging them to question and reconsider their assumptions based on their own reasoning. Use simple, clear language that an average person will be able to follow, and structure the conversation so they gain confidence at each step and adjust their thinking gradually. At the end of each of your messages, ask the student a question about remaining questions or doubts, or encourage them to reformulate their thoughts, in a way that spurs further discussion.`;

                // console.log('System prompt set:', this.systemPrompt);

                await this.generateInitialAIMessage();
                // Save *after* initial message generation completes successfully
                this.saveChatData();

            } catch (error) {
                console.error('Error in fetchDataAndSetSystemPrompt:', error);
                alert(`Failed to initialize the chat session: ${error.message}. Please try returning to the study section and starting again.`);
                // Consider redirecting the user if initialization fails critically
                this.$router.push('/study');
            }
        },

        async generateInitialAIMessage() {
            // ... (generateInitialAIMessage remains largely the same) ...
             this.loading = true;
            const apiData = {
                model: this.modelToUse, // Use dynamic model
                messages: [
                    { role: "system", content: this.systemPrompt },
                    { role: "user", content: "Please start the conversation by addressing the user's misconception." },
                ],
                temperature: this.temperature, // Use dynamic temperature
            };

            // Conditionally set parameters based on model
            if (this.modelToUse === 'o3-mini') {
                apiData.max_completion_tokens = 5000;
                apiData.reasoning_effort = "medium";
            } else {
                apiData.max_tokens = 2000;
            }

            try {
                console.log('Generating initial message with Model:', this.modelToUse);
                // console.log('API Data for initial message:', apiData);
                const response = await this.sendApiRequest(apiData);

                const initialMessage = response.data.choices[0].message.content.trim();
                this.initialSystemMessage = initialMessage; // Store the very first AI message
                this.messages = [{ role: 'assistant', content: initialMessage }]; // Initialize messages with the first AI response
                this.firstMsgTime = new Date(); // Set time for the first message
            } catch (error) {
                console.error('Error generating initial AI message:', error);
                 // Provide a fallback message or handle the error appropriately
                const errorMessage = "I apologize, but I encountered an issue starting our conversation. Please try refreshing the page. If the problem persists, please contact your TA.";
                this.messages.push({
                    role: 'assistant',
                    content: errorMessage,
                });
                // Prevent further interaction if initialization fails badly
                 this.chatComplete = true;
                 alert(errorMessage); // Notify user
            } finally {
                this.loading = false;
                this.$nextTick(() => this.scrollToBottom()); // Scroll after initial message/error
            }
        },

        async sendMessage() {
            if (this.userMessage.trim() === '' || this.isChatFinished() || this.loading) return;

            const currentTime = new Date();
            const userMessageContent = this.userMessage;
            this.userMessage = ''; // Clear input immediately

            // Set first message time if not already set (should normally be set by initial AI msg)
             if (!this.firstMsgTime) {
                 this.firstMsgTime = currentTime;
             }

            // Set lastMessageTime to firstMsgTime during the first user message exchange
            if (this.remainingRounds === 5 && !this.lastMessageTime) {
                 // Use firstMsgTime if available (time AI message appeared), else current time
                this.lastMessageTime = this.firstMsgTime || currentTime;
            }

            // Calculate time spent since the last message (user or AI)
            let timeSpent = 0;
            if (this.lastMessageTime) {
                timeSpent = (currentTime - this.lastMessageTime) / 1000; // time spent in seconds
            }

            // Update lastMessageTime to the current time (user sending message)
            this.lastMessageTime = currentTime;

            this.messages.push({ role: 'user', content: userMessageContent });
            this.scrollToBottom(); // Scroll after adding user message
            // this.remainingRounds--; // Decrement rounds *before* API call

            // --- Prepare and send API request ---
            this.loading = true; // Set loading state for AI response

            const apiData = {
                model: this.modelToUse,
                messages: [
                    { role: "system", content: this.systemPrompt },
                    // Send the current message history including the latest user message
                    ...this.messages,
                ],
                temperature: this.temperature,
            };

            // Conditionally set parameters based on model
            if (this.modelToUse === 'o3-mini') {
                apiData.max_completion_tokens = 5000;
                apiData.reasoning_effort = "medium";
            } else {
                apiData.max_tokens = 2000;
            }


            try {
                console.log('Sending message to Model:', this.modelToUse, 'Round:', 5 - this.remainingRounds);
                // console.log('API Data for send message:', apiData);
                const response = await this.sendApiRequest(apiData);
                const aiMessage = response.data.choices[0].message.content.trim();
                this.messages.push({ role: 'assistant', content: aiMessage });

                // Update lastMessageTime to AI response time for next calculation
                this.lastMessageTime = new Date();
                this.remainingRounds--;

                // --- Database logging ---
                const timeSpentFormatted = `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toFixed(0).padStart(2, '0')}`; // Format as mm:ss
                const userId = this.user.username;
                // Fetch display_name and group only if needed and not already stored/available
                let displayName = this.profileData?.display_name || 'N/A'; // Use cached profileData if available
                let llmType = this.profileData?.group || 'N/A';

                if (displayName === 'N/A' || llmType === 'N/A') {
                const { data: profileInfo, error: profileError } = await supabase
                    .from('2_profiles')
                    .select('display_name, group')
                    .eq('user_id', userId)
                    .single();
                if (profileError) throw profileError;
                displayName = profileInfo.display_name;
                llmType = profileInfo.group;
                }

                await supabase.from('2_experimental_chat_history').insert({
                    user_id: userId,
                    system_message: this.systemPrompt, // Consider if this needs to be logged every time
                    conversation: this.messages, // Log the state *after* AI response
                    round: 5 - this.remainingRounds, // Current round number (1 to 5)
                    user_chat: userMessageContent,
                    model_reply: aiMessage,
                    llm_type: llmType, // Log the group/model type
                    time_spent: timeSpentFormatted, // Log time since last message
                    timestamp: new Date().toISOString(),
                    initial_message: this.initialSystemMessage,
                    question_number: this.incorrectQuestion?.question_number || -1, // Ensure question number is logged
                });

                // *** CHANGE: Check for chat completion immediately after decrementing rounds ***
                if (this.remainingRounds <= 0) {
                    console.log('Max rounds reached. Setting chatComplete to true.');
                    this.messages.push({
                        role: 'system', // Use 'system' for non-chat messages
                        content: "Thank you for participating. You have completed the chat portion for this question.",
                    });
                    this.chatComplete = true; // Set complete status
                    this.saveChatData(); // Save the final state including the system message
                    this.$nextTick(() => this.scrollToBottom());
                    return; // Stop processing, don't call AI again
                }

                this.$nextTick(() => {
                    this.scrollToBottom();
                });

            } catch (error) {
                console.error('Error communicating with the OpenAI API', error);
                // Add error message to chat and potentially stop
                 this.messages.push({
                    role: 'assistant',
                    content: "Sorry, I encountered an error trying to respond. Please try sending your message again shortly."
                 });
                 // Optionally revert round counter if desired, or just let user try again
                 // this.remainingRounds++;
                 this.$nextTick(() => {
                    this.scrollToBottom();
                 });
            } finally {
                this.loading = false; // Turn off loading indicator
                this.scrollToBottom();
                this.saveChatData(); // Save state after AI response or error
            }

            // --- MOVED: Chat completion logic moved before API call ---
            // if (this.remainingRounds === 0) {
            //     this.messages.push({
            //         role: 'system',
            //         content: "Thank you for participating in this conversation. You've used all 5 rounds.",
            //     });
            //     this.$nextTick(() => {
            //         this.scrollToBottom();
            //     });
            //     this.chatComplete = true;
            // }
            // this.saveChatData(); // Moved inside finally and also before API call if chat completes
        },

        marked(content) {
            // ... (marked options remain the same) ...
             marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,       // Add ID attributes to headers
                headerPrefix: 'hdg-',  // Add prefix for header IDs
                smartypants: true      // Enable smart punctuation conversion
            });
            return marked(content);
        },

        scrollToBottom() {
            // Use nextTick to ensure DOM is updated before scrolling
            this.$nextTick(() => {
                const messagesContainer = this.$el?.querySelector('.messages'); // Use optional chaining
                 if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                 }
            });
        },

        isChatFinished() {
            return this.chatComplete;
        },

        confirmNextPage() {
            if (confirm('Are you sure you want to proceed to the next page? This will end the current chat.')) {
                this.nextPage();
            }
        },

        async nextPage() {
            this.clearChatData(); // Clear chat data before moving
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
                incorrectQuestion: this.incorrectQuestion,
                userAnswer: this.userAnswer,
                firstMsgTime: this.firstMsgTime,
                // *** CHANGE: Save model and temperature ***
                modelToUse: this.modelToUse,
                temperature: this.temperature,
                chatComplete: this.chatComplete // Save completion status too
            };
             // console.log('Saving chatData:', chatData);
            localStorage.setItem('chatData', JSON.stringify(chatData));
        },

        // --- Helper methods for displaying question ---
        shouldDisplayLabels(questionNumber) {
            return this.questionsWithLabels.includes(questionNumber);
        },
        getOptions(question) {
            if (!question) return [];
            return [
                question.option_1,
                question.option_2,
                question.option_3,
                question.option_4,
                question.option_5,
            ].filter(option => option); // Filter out null/empty options
        },
        formatQuestionText(question) {
             if (!question || !question.question_text) return '';
            const numberText = (question.question_number ?? '') + '. ';
            // Ensure question_text is treated as a string
            const formattedText = String(question.question_text).replace(/\\n/g, '<br>');
            return numberText + formattedText;
        },
        formatOptionText(option) {
            if (!option) return '';
            // Ensure option is treated as a string before replacing
            const formattedOption = String(option).replace(/_sub_(.*?)_end_/g, '<span class="subscript">$1</span>');
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
    text-align: left;
}

.assistant-message {
    display: flex;
    align-items: flex-start;
    max-width: 70%;
    text-align: left;
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

/* Ensure bullet lists display correctly */
.assistant-message ul, .user-message ul {
    list-style-type: disc;
    margin-left: 20px;
    padding-left: 0;
}

/* Bold text styling */
.assistant-message strong, .user-message strong {
    font-weight: bold;
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

.next-button:hover {
  background-color: #000066; /* Darker Blue */
}

.assistant-message > div { /* Target the div rendered by v-html */
    /* General typography */
    line-height: 1.6;
    color: #333; /* Adjust base text color as needed */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

/* --- Headings --- */
.assistant-message > div h1 {
    font-size: 1.8em; /* Example size */
    font-weight: bold;
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    line-height: 1.3;
    border-bottom: 1px solid #eee; /* Optional separator */
}

.assistant-message > div h2 {
    font-size: 1.5em; /* Example size */
    font-weight: bold;
    margin-top: 1.3em;
    margin-bottom: 0.7em;
    line-height: 1.3;
    border-bottom: 1px solid #eee; /* Optional separator */
}

.assistant-message > div h3 {
    font-size: 1.3em; /* Example size */
    font-weight: bold;
    margin-top: 1.2em;
    margin-bottom: 0.6em;
    line-height: 1.3;
}

.assistant-message > div h4,
.assistant-message > div h5,
.assistant-message > div h6 {
    font-size: 1.1em; /* Example size */
    font-weight: bold;
    margin-top: 1.1em;
    margin-bottom: 0.5em;
    line-height: 1.3;
}

/* --- Basic Formatting --- */
.assistant-message > div strong,
.assistant-message > div b {
    font-weight: bold; /* Ensure bold is visually distinct */
}

.assistant-message > div em,
.assistant-message > div i {
    font-style: italic; /* Ensure italic is visually distinct */
}

/* --- Lists --- */
.assistant-message > div ul,
.assistant-message > div ol {
    margin-top: 0.5em;
    margin-bottom: 1em;
    padding-left: 2em; /* Indentation */
}

.assistant-message > div li {
    margin-bottom: 0.4em; /* Spacing between list items */
}

.assistant-message > div ul {
    list-style-type: disc; /* Standard bullets */
}
.assistant-message > div ul ul {
    list-style-type: circle;
}
.assistant-message > div ul ul ul {
     list-style-type: square;
}


.assistant-message > div ol {
    list-style-type: decimal; /* Standard numbers */
}

/* Nested lists might need adjusted padding/margins */
.assistant-message > div li > ul,
.assistant-message > div li > ol {
    margin-top: 0.2em;
    margin-bottom: 0.2em;
}


/* --- Code Blocks --- */
/* Inline code */
.assistant-message > div code {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    background-color: #f5f5f5; /* Light gray background */
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
}

/* Fenced code blocks (```) */
.assistant-message > div pre {
    background-color: #f5f5f5; /* Background for the block */
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1em;
    overflow-x: auto; /* Allow horizontal scrolling for long lines */
    margin-top: 0.5em;
    margin-bottom: 1em;
}

.assistant-message > div pre code {
    background-color: transparent; /* Reset background for code inside pre */
    padding: 0;
    border: none;
    font-size: 0.9em; /* Consistent font size */
    line-height: 1.4; /* Better readability for code blocks */
}

/* --- Blockquotes --- */
.assistant-message > div blockquote {
    border-left: 4px solid #ccc;
    padding-left: 1em;
    margin-left: 0;
    margin-right: 0;
    color: #666;
    font-style: italic;
}

.assistant-message > div sub {
    font-size: 0.75em; /* Make it slightly smaller */
    line-height: 0; /* Prevent affecting line height too much */
    position: relative; /* Allows vertical alignment */
    vertical-align: baseline; /* Align based on the parent's baseline */
    top: 0.3em; /* Adjust vertical position slightly */
}

/* --- Horizontal Rules --- */
.assistant-message > div hr {
    border: none;
    border-top: 1px solid #eee;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
}

/* --- Links --- */
.assistant-message > div a {
  color: #007bff; /* Or your site's link color */
  text-decoration: none;
}
.assistant-message > div a:hover {
  text-decoration: underline;
}

/* --- Paragraphs --- */
.assistant-message > div p {
    margin-top: 0;
    margin-bottom: 1em; /* Spacing between paragraphs */
}

/* Fix potential issue where first element has unwanted top margin */
.assistant-message > div > *:first-child {
  margin-top: 0;
}
/* Fix potential issue where last element has unwanted bottom margin */
.assistant-message > div > *:last-child {
  margin-bottom: 0;
}


/* Question content */
.question-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
    padding: 20px;
}

.reminder-text, .additional-text {
    text-align: left;
    margin-bottom: 1em;
}

.option {
    text-align: left;
    margin: 8px 0;
}

</style>