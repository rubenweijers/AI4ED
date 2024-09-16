<template>
    <div class="pre-chat-container">
      <h2>Prepare for AI Conversation</h2>
      
      <div>
        <p>You are about to engage in a conversation with an advanced AI about your explanations. Here's what to expect:</p>
      </div>
      
      <div class="info-block">
        <ol>
          <li>The conversation will consist of <strong>three rounds.</strong></li>
          <li>The <strong>AI will initiate</strong> the conversation.</li>
          <li>You and the AI will then <strong>alternate in a back-and-forth</strong> dialogue.</li>
          <li><strong>Each round</strong> gives you an opportunity to <strong>expand on or clarify</strong> your thoughts.</li>
        </ol>
      </div>
      
      <div>
        <p>This process is designed to <strong>explore your physics intuition</strong> in depth and provide you with a unique opportunity for learning.</p>
      </div>
      
      <button @click="proceedToChat" class="submit-button">I have read and understood the above text.</button>
    </div>
</template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const proceedToChat = () => {
    router.push('/chat'); // Adjust this route to match your LLM chat page route
  };
  </script>
  
  <style scoped>
  .pre-chat-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    font-family: Arial, sans-serif;
  }
  
  .pre-chat-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: rgb(29, 29, 184);
  }
  
  .info-block {
    background-color: #f8f8f8;
    border-left: 4px solid rgb(29, 29, 184);
    padding: 15px;
    margin-bottom: 20px;
    font-size: 18px;
    line-height: 1.4;
    color: #333;
  }
  
  p {
    margin-bottom: 10px;
  }
  
  ol {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  .submit-button {
    display: block;
    width: 100%;
    background-color: rgb(29, 29, 184);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 12px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 18px;
  }
  
  .submit-button:hover {
    background-color: rgb(23, 23, 250);
  }
  
  @media (max-width: 600px) {
    .pre-chat-container {
      margin: 20px;
      padding: 15px;
    }
    
    h2 {
      font-size: 24px;
    }
    
    .info-block {
      font-size: 16px;
    }
  }
  </style>