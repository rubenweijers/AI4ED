from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()

app = Flask(__name__)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

logging.basicConfig(level=logging.INFO)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    if not user_message:
        logging.error('No message provided in request')
        return jsonify({'error': 'No message provided'}), 400

    try:
        logging.info(f'Received message: {user_message}')
        response = requests.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            headers={'Authorization': f'Bearer {OPENAI_API_KEY}'},
            json={
                'prompt': user_message,
                'max_tokens': 150
            }
        )
        logging.info(f'OpenAI API response status: {response.status_code}')
        response.raise_for_status()  # Raise HTTPError for bad responses

        bot_message = response.json().get('choices')[0].get('text').strip()
        logging.info(f'Response from OpenAI: {bot_message}')
        return jsonify({'message': bot_message})
    except requests.exceptions.RequestException as e:
        logging.error(f'Error fetching response from OpenAI: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
