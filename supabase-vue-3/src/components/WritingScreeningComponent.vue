<template>
    <div class="survey-container">
      <div class="question">
        <p>
          To start, we are interested in your experiences participating in online surveys (such as this one!). Why are you taking this survey? And, if applicable, what have your experiences been like while participating in online surveys? Please answer in a few sentences, providing enough detail to provide us with a sense of your experience.
        </p>
      </div>
      <div class="input-container">
        <textarea v-model="response" placeholder="Write your response here..."></textarea>
      </div>
      <button @click="submitResponse" :disabled="response.trim() === '' || loading">
        {{ loading ? 'Submitting...' : 'Submit' }}
      </button>
    </div>
</template>
  
  <script setup>
  import { ref } from 'vue'
  import { supabase } from '../supabase'
  import axios from 'axios'
  
  const loading = ref(false)
  const response = ref('')
  
  const evaluateCoherence = async (userResponse) => {
    const apiData = {
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `Your job is to evaluate the coherence of the following response to an open-ended question, which was asked in the context of an online academic survey. This is the response: "${userResponse}". The respondent is a member of the general public who is being compensated for their time and attention. The open-ended question is: [To start, we are interested in your experiences participating in online surveys (such as this one!). Why are you taking this survey? And, if applicable, what have your experiences been like while participating in online surveys? Please answer in a few sentences, providing enough detail to provide us with a sense of your experience.] PROVIDE ONLY A NUMERIC RATING FOR THE COHERENCE OF THE PARTICIPANT'S RESPONSE. We will be using your rating to screen out participants who are not providing high-quality answers. RESPOND WITH ONLY A NUMERIC RATING, FROM 0-10` 
        },
        { role: "user", content: userResponse }
      ],
      max_tokens: 10,
      temperature: 0.7
    };
  
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        }
      });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error communicating with the OpenAI API', error);
      return '';
    }
  }
  
  const submitResponse = async () => {
    if (response.value.trim() === '') return
  
    try {
      loading.value = true
  
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
  
      if (!user) {
        throw new Error('No user is currently logged in.')
      }
  
      // Upsert the writing screening response
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          { 
            user_id: user.id,
            writing_screening: response.value 
          },
          { 
            onConflict: 'user_id',
            update: ['writing_screening']
          }
        )
        .select()
  
      if (error) throw error
  
      // Evaluate the coherence of the response
      const coherenceRating = await evaluateCoherence(response.value)
  
      // Update the profile with the coherence rating
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ coherence_rating: coherenceRating })
        .eq('user_id', user.id)
  
      if (updateError) throw updateError
  
      console.log('Response submitted and coherence evaluated:', data)
      alert('Thank you for your response!')
      response.value = '' // Clear the input field after submission
  
    } catch (error) {
      console.error('Error submitting response:', error.message)
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .survey-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .question {
    margin-bottom: 20px;
  }
  
  .input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  