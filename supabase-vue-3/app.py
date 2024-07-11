from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        response = requests.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            headers={'Authorization': f'Bearer {OPENAI_API_KEY}'},
            json={
                'prompt': user_message,
                'max_tokens': 150
            }
        )
        response.raise_for_status()  # Raise HTTPError for bad responses

        bot_message = response.json().get('choices')[0].get('text').strip()
        return jsonify({'message': bot_message})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
