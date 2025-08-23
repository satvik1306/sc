from flask import Flask, request, jsonify
from flask_cors import CORS
import chromadb
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
import requests
import socket
import os
import time
from collections import defaultdict

# Ensure relative paths work regardless of where the script is run
os.chdir(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
CORS(app)

conversation_history = defaultdict(list)

# Initialize ChromaDB persistent client and load collection
client = PersistentClient(path="./chroma-db")
collection = client.get_collection("villa_data")

# Load embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

OLLAMA_API = "http://localhost:11434/api/chat"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    session_id = data.get("session_id", "default")

    if not user_message:
        return jsonify({"error": "Missing 'message'"}), 400

    try:
        user_vector = embed_model.encode(user_message).tolist()
        results = collection.query(query_embeddings=[user_vector], n_results=5)
        context_chunks = results["documents"][0]
        context = "\n\n".join(context_chunks)

        history = conversation_history[session_id]
        conversation_context = ""
        if history:
            conversation_context += "\n\nPrevious conversation:\n"
            for msg in history[-6:]:
                conversation_context += f"{msg['role']}: {msg['content']}\n"

        # Message classification
        lower_msg = user_message.lower()

        greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
        simple_ack = ['ok', 'okay', 'thanks', 'thank you', 'cool', 'great', 'noted', 'got it', 'fine']

        detailed_request_phrases = ["tell me more", "elaborate", "give me details", "expand", "full details"]
        is_greeting = lower_msg in greetings
        is_acknowledgment = lower_msg in simple_ack
        is_detailed_request = any(phrase in lower_msg for phrase in detailed_request_phrases)
        is_identity_question = any(p in lower_msg for p in [
            "who are you", "your name", "who is this", "who built you", "who created you"
        ])
        is_trust_question = any(p in lower_msg for p in [
            "can i trust", "is this trustworthy", "is this company legit", "reliable", "real company", "scam", "fraud"
        ])
        is_unclear = lower_msg in ["what?", "unclear", "confused", "i need more details"]

        # System prompt selection
        if is_greeting:
            system_prompt = f"Respond ONLY with a friendly short greeting like 'Hello! How can I help you?' and nothing else."
        elif is_acknowledgment:
            system_prompt = "Respond with a short acknowledgment like 'You're welcome!' or 'Happy to help!', and nothing else."
        elif is_identity_question:
            system_prompt = "You are the official assistant of Saridena Constructions and LakeWoods Villas. Answer that you are a virtual assistant representing them. Do not include any name like Aria or others."
        elif is_trust_question:
            system_prompt = (
                "You are the official assistant for Saridena Constructions and LakeWoods Villas. "
                "If asked about trust, respond with a confident, concise answer emphasizing the company's experience, transparency, customer satisfaction, and quality."
            )
        elif is_unclear:
            system_prompt = "Respond only with: 'Sorry, I couldn't understand. Please provide more details.'"
        else:
            detail_flag = "detailed" if is_detailed_request else "concise"
            system_prompt = f"""
You are the official assistant for Saridena Constructions and LakeWoods Villas.

- Only use information from the knowledge base below.
- Keep answers {detail_flag} by default.
- Only expand in detail when the user clearly asks for more.
- Never make up facts. If info is missing, say: "I'm here to assist you only with information about Saridena Constructions and LakeWoods Villas."

Company Knowledge Base:
{context}
{conversation_context}

User message: "{user_message}"

Answer accordingly.
"""

        # Call Ollama
        response = requests.post(
            OLLAMA_API,
            json={
                "model": "llama3.2:1b",
                "messages": [{"role": "user", "content": system_prompt}],
                "stream": False,
                "options": {
                    "temperature": 0.4,
                    "top_p": 0.8,
                    "max_tokens": 180,
                    "repeat_penalty": 1.2,
                    "presence_penalty": 0.3,
                    "frequency_penalty": 0.5
                }
            },
            timeout=45
        )

        reply = "Sorry, something went wrong."
        if response.ok:
            result = response.json()
            content = result.get("message", {}).get("content", "").strip()
            reply = clean_response(content)

        conversation_history[session_id].append({"role": "user", "content": user_message})
        conversation_history[session_id].append({"role": "assistant", "content": reply})
        conversation_history[session_id] = conversation_history[session_id][-20:]

        return jsonify({"response": reply})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500

def clean_response(text):
    """Remove unnecessary formatting or labels from model output"""
    lines = text.strip().split('\n')
    cleaned = []

    for line in lines:
        line = line.strip()
        if line.lower().startswith(("assistant:", "user:", "human:", "ai:")):
            continue
        if line and not any(line.lower().startswith(p) for p in ["let me think", "i need to"]):
            cleaned.append(line)

    final = "\n".join(cleaned).strip()
    return final if len(final) > 20 else text.strip()

@app.route("/")
def index():
    return "✅ Backend server is running."

if __name__ == "__main__":
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"✅ Flask server running on http://{local_ip}:5000")
    app.run(host="0.0.0.0", port=5000)
