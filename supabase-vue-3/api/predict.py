import openai
import datetime
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

user_data = supabase.auth.get_user()
openai.api_key = os.getenv("CHATGPT_API_KEY")

def predict(message, history):
    history_openai_format = []
    for human, assistant in history:
        history_openai_format.append({"role": "user", "content": human})
        history_openai_format.append({"role": "assistant", "content": assistant})
    history_openai_format.append({"role": "user", "content": message})

    response = openai.ChatCompletion.create(
        model='gpt-4',
        messages=history_openai_format,
        temperature=1.0,
    )

    partial_message = response['choices'][0]['message']['content']

    time = datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S')
    supabase.table('chat_history').insert({
        "user_id": user_data.id,
        "chat_history": history_openai_format,
        "llm_type": "gpt-4",
        "time_spent": time
    }).execute()

    return partial_message

from fastapi import FastAPI, Request
app = FastAPI()

@app.post("/api/predict")
async def handler(request: Request):
    data = await request.json()
    message = data.get('message')
    history = data.get('history', [])
    response = predict(message, history)
    return {"response": response}

from mangum import Mangum
handler = Mangum(app)
