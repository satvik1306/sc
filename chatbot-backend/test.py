import requests

resp = requests.post("http://127.0.0.1:5000/chat", json={"message": "hello"})
print(resp.json())
