import requests

def test_backend():
    # Test the base endpoint
    try:
        response = requests.get("http://localhost:5000/")
        print("Base endpoint test:", response.text if response.ok else "Failed")
    except Exception as e:
        print("Base endpoint error:", str(e))

    # Test the chat endpoint
    try:
        response = requests.post(
            "http://localhost:5000/chat",
            json={"message": "Hello", "session_id": "test"}
        )
        print("\nChat endpoint test:", response.json() if response.ok else "Failed")
    except Exception as e:
        print("Chat endpoint error:", str(e))

if __name__ == "__main__":
    test_backend()