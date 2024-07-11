from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CHATGPT_API_KEY = os.getenv('CHATGPT_API_KEY')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    response = requests.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        headers={'Authorization': f'Bearer {CHATGPT_API_KEY}'},
        json={
            'prompt': user_message,
            'max_tokens': 150
        }
    )

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch response from OpenAI API'}), response.status_code

    bot_message = response.json().get('choices')[0].get('text').strip()
    return jsonify({'message': bot_message})

if __name__ == '__main__':
    app.run(debug=True)
