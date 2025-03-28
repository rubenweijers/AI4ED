<template>
    <div class="pre-chat-container">
      <h2>Prepare for the AI Conversation</h2>
        <div>
          <p>You’re about to discuss your reasoning from the previous question with an AI.</p>
          <p><strong>Please read carefully</strong> to know what’s coming:</p>
        </div>
        <div class="info-block">
          <ul>
            <li>The conversation will have <strong>up to 5 rounds</strong>.</li>
            <li>You can end it after round 1 if you feel satisfied.</li>
            <li>The <strong>AI will start</strong> the dialogue.</li>
            <li>You’ll then take turns in a <strong>back-and-forth</strong> exchange.</li>
            <li>Each round lets you <strong>expand or clarify</strong> your ideas.</li>
            <li>Afterward, we’ll move to the next incorrectly answered question.</li>
          </ul>
        </div>
      
      <div>
        <p>This process is designed to <strong>explore and improve your physics intuition</strong> in depth.</p>
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