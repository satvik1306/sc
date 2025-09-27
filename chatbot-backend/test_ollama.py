import requests
import time

def test_ollama():
    print("Testing Ollama response time...")
    
    start_time = time.time()
    
    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3.2:1b",
                "messages": [{"role": "user", "content": "Hi, give me a very short response."}],
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 50,
                    "repeat_penalty": 1.1
                }
            },
            timeout=30
        )
        
        end_time = time.time()
        
        if response.ok:
            result = response.json()
            content = result.get("message", {}).get("content", "").strip()
            print(f"\nResponse received in {end_time - start_time:.2f} seconds")
            print(f"Response: {content}")
        else:
            print(f"\nError: Status code {response.status_code}")
            print(response.text)
            
    except requests.Timeout:
        print("\nError: Request timed out after 30 seconds")
    except Exception as e:
        print(f"\nError: {str(e)}")

if __name__ == "__main__":
    test_ollama()