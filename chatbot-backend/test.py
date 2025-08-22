import requests
import json

url = "http://127.0.0.1:11434/api/generate"
data = {
    "model": "llama2",
    "prompt": "Hello, Ollama!",
    "stream": False  # Disable streaming to get one JSON response
}

response = requests.post(url, json=data)

try:
    print(response.json())  # will now work since stream is disabled
except requests.exceptions.JSONDecodeError:
    print("Failed to parse response JSON.")
    print(response.text)
