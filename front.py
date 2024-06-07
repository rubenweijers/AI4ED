from openai import OpenAI
import gradio as gr
import datetime
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

user_data = supabase.auth.get_user()

client = OpenAI(api_key=os.environ.get(CHATGPT_API_KEY))

def predict(message, history):
    history_openai_format = []
    for human, assistant in history:
        history_openai_format.append({"role": "user", "content": human })
        history_openai_format.append({"role": "assistant", "content":assistant})
    history_openai_format.append({"role": "user", "content": message})
  
    response = client.chat.completions.create(model='gpt-3.5-turbo',
    messages= history_openai_format,
    temperature=1.0,
    stream=True)

    partial_message = ""
    for chunk in response:
        if chunk.choices[0].delta.content is not None:
              partial_message = partial_message + chunk.choices[0].delta.content
              yield partial_message

    print(history_openai_format)

    time = datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S')

    data, count = supabase.table('chat_history').insert({"user_id": user_data, 
    "chat_history": history_openai_format, "llm_type":"gpt-3.5-turbo", "time_spent": time}).execute()

    print(data, count)

if __name__ == "__main__":
    gr.ChatInterface(predict).launch(share=True)