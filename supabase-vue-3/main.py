from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os

app = FastAPI()

openai.api_key = os.getenv("sk-proj-z71G7Ex6pWChT2sHQzoFT3BlbkFJonayXpcCtmaca507iCH3")

class Message(BaseModel):
    text: str

@app.post("/chat")
async def chat(message: Message):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=message.text,
        max_tokens=150
    )
    return {"response": response.choices[0].text.strip()}
