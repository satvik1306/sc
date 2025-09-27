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

def get_ollama_response(system_prompt, max_retries=3):
    """Helper function to handle Ollama requests with retries"""
    for attempt in range(max_retries):
        try:
            response = requests.post(
                OLLAMA_API,
                json={
                    "model": "llama3.2:1b",
                    "messages": [{"role": "user", "content": system_prompt}],
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 150,
                        "repeat_penalty": 1.1,
                        "presence_penalty": 0.1,
                        "frequency_penalty": 0.1
                    }
                },
                timeout=30  # Reduced timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.Timeout:
            if attempt == max_retries - 1:
                raise
            print(f"Attempt {attempt + 1} timed out, retrying...")
            time.sleep(1)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            print(f"Attempt {attempt + 1} failed with error: {str(e)}, retrying...")
            time.sleep(1)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    session_id = data.get("session_id", "default")

    if not user_message:
        return jsonify({"error": "Missing 'message'"}), 400

    try:
        # Get relevant context
        user_vector = embed_model.encode(user_message).tolist()
        results = collection.query(query_embeddings=[user_vector], n_results=3)  # Reduced context
        context_chunks = results["documents"][0]
        context = "\n\n".join(context_chunks)

        # Simplified system prompt
        system_prompt = f"""You are Saridena Constructions' AI assistant. Keep responses brief and focused.

Context: {context}

User message: "{user_message}"

Answer concisely."""

        try:
            result = get_ollama_response(system_prompt)
            content = result.get("message", {}).get("content", "").strip()
            reply = content or "I apologize, but I'm having trouble generating a response. Could you please rephrase your question?"
        except requests.Timeout:
            return jsonify({
                "response": "I apologize for the delay. I'm experiencing some technical difficulties. Please try asking a simpler question or try again in a moment."
            })
        except Exception as e:
            print(f"Ollama error: {str(e)}")
            return jsonify({
                "response": "I apologize, but I'm having trouble processing your request. Please try again."
            })

        # Update conversation history
        conversation_history[session_id].append({"role": "user", "content": user_message})
        conversation_history[session_id].append({"role": "assistant", "content": reply})
        conversation_history[session_id] = conversation_history[session_id][-20:]

        return jsonify({"response": reply})

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            "response": "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
        }), 500

@app.route("/")
def index():
    return "✅ Backend server is running."

if __name__ == "__main__":
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"✅ Flask server running on http://{local_ip}:5000")
    app.run(host="0.0.0.0", port=5000)