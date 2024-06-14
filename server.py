import openai
import gradio as gr
import datetime
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import json
from fastapi import FastAPI, Request

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

user_data = supabase.auth.get_user()

openai.api_key = os.getenv("CHATGPT_API_KEY")

app = FastAPI()

@app.post("/")
async def predict(request: Request):
    data = await request.json()
    message = data['message']
    history = data['history']

    history_openai_format = []
    for entry in history:
        history_openai_format.append({"role": entry['role'], "content": entry['content']})
    
    history_openai_format.append({"role": "user", "content": message})
 
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=history_openai_format,
        temperature=1.0,
        stream=True
    )

    partial_message = ""
    for chunk in response:
        if chunk.choices[0].delta.content is not None:
            partial_message += chunk.choices[0].delta.content
            yield partial_message

    time = datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S')

    data, count = supabase.table('chat_history').insert({
        "user_id": user_data,
        "chat_history": history_openai_format,
        "llm_type": "gpt-3.5-turbo",
        "time_spent": time
    }).execute()

    return {"response": partial_message}

if __name__ == "__main__":
    gr.ChatInterface(predict).launch(share=True)
