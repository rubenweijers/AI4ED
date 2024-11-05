// api/chat.js
import axios from 'axios';

/**
 * Handles chat requests by forwarding messages to the OpenAI API
 * and returning the AI's response.
 * 
 * Expects a POST request with JSON body containing:
 * - messages: Array of message objects (each with 'role' and 'content')
 * - model: (optional) The OpenAI model to use
 * - max_tokens: (optional) Maximum number of tokens in the response
 * - temperature: (optional) Sampling temperature
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { model = "gpt-4o", messages, max_tokens = 2000, temperature = 0.7 } = req.body;

  // Validate the incoming data
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body: "messages" array is required.' });
  }

  const apiData = {
    model,
    messages,
    max_tokens,
    temperature,
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const reply = response.data.choices[0].message.content.trim();

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error communicating with the OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error communicating with the OpenAI API.' });
  }
}