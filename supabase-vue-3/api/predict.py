# api/predict.py

import openai
import datetime
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import gradio as gr

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
        stream=True
    )

    partial_message = ""
    for chunk in response:
        if chunk.choices[0].delta.content is not None:
              partial_message += chunk.choices[0].delta.content
              yield partial_message

    print(history_openai_format)

    time = datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S')

    data, count = supabase.table('chat_history').insert({
        "user_id": user_data.id, 
        "chat_history": history_openai_format, 
        "llm_type":"gpt-4", 
        "time_spent": time
    }).execute()

    print(data, count)

app = gr.Interface(
    fn=predict, 
    inputs=["text", "state"], 
    outputs=["text", "state"]
)

def handler(request):
    return app.launch(share=True)

# Uncomment the following if deploying to Vercel
from mangum import Mangum
handler = Mangum(handler)
