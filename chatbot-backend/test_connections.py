import requests
import time
import json

def test_connection():
    print("\n1. Testing Ollama direct connection...")
    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3.2:1b",
                "messages": [{"role": "user", "content": "Say hi"}],
                "stream": False
            },
            timeout=30
        )
        if response.ok:
            print("✅ Ollama connection successful")
            print(f"Response: {response.json().get('message', {}).get('content', '')}")
        else:
            print("❌ Ollama response not OK:", response.status_code)
            print(response.text)
    except Exception as e:
        print("❌ Ollama connection failed:", str(e))

    print("\n2. Testing Chatbot API...")
    try:
        response = requests.post(
            "http://localhost:5000/chat",
            json={
                "message": "Hi, this is a test message",
                "session_id": "test_session"
            },
            timeout=30
        )
        if response.ok:
            print("✅ Chatbot API connection successful")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ Chatbot API response not OK:", response.status_code)
            print(response.text)
    except Exception as e:
        print("❌ Chatbot API connection failed:", str(e))

if __name__ == "__main__":
    test_connection()