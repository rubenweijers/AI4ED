// api/summarize.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { explanation } = req.body;

  const apiData = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Summarize the following passage, which describes a misconception, in a single sentence. Do not mention that it is a misconception, or a belief, or provide any kind of normative judgment. Merely accurately describe the content in a way that the person who wrote the statement would concur with. Frame it as an assertion. If the statement is already short, no need to change it very much. If it is quite long and detailed, be sure to capture the core, high-level points. Do not focus on the evidence provided for the belief --merely focus on the basic assertion",
      },
      { role: "user", content: explanation },
    ],
    max_tokens: 100,
    temperature: 0.7,
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', apiData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    res.status(200).json({ summary: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error communicating with the OpenAI API', error);
    res.status(500).json({ error: 'Error communicating with the OpenAI API' });
  }
}
