import asyncio
import os
from dotenv import load_dotenv
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_core.models import UserMessage

load_dotenv()

async def verify():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found.")
        return

    print(f"Testing Gemini connection with key ending in ...{api_key[-4:]}")
    
    # Try with v1beta/openai/
    base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
    print(f"Using base_url: {base_url}")
    
    client = OpenAIChatCompletionClient(
        model="gemini-1.5-pro",
        api_key=api_key,
        base_url=base_url
    )

    try:
        response = await client.create([UserMessage(content="Hello, are you there?", source="user")])
        print("Success! Response:")
        print(response.content)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify())
