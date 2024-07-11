import json
import requests
import os

def handler(request):
    body = json.loads(request.body)
    user_message = body.get('message')

    if not user_message:
        return {
            "statusCode": 400,
            "body": json.dumps({'error': 'No message provided'})
        }

    api_key = os.getenv('CHATGPT_API_KEY')
    response = requests.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        headers={'Authorization': f'Bearer {api_key}'},
        json={
            'prompt': user_message,
            'max_tokens': 150
        }
    )

    if response.status_code != 200:
        return {
            "statusCode": response.status_code,
            "body": json.dumps({'error': 'Failed to fetch response from OpenAI API'})
        }

    bot_message = response.json().get('choices')[0].get('text').strip()
    return {
        "statusCode": 200,
        "body": json.dumps({'message': bot_message})
    }
