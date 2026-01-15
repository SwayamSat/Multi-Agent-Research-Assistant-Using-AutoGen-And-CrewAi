import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

def test_request(model_name):
    api_key = os.getenv("GEMINI_API_KEY")
    url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": model_name,
        "messages": [{"role": "user", "content": "Hello!"}],
        "max_tokens": 10
    }
    
    print(f"Testing model: {model_name}")
    response = requests.post(url, headers=headers, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 20)

if __name__ == "__main__":
    # Try different model names
    models = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp"]
    for m in models:
        test_request(m)
