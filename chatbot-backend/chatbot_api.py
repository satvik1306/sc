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

        # Project-related question detection
        project_keywords = [
            "project", "projects", "villa", "villas", "development", "developments", "property", "properties", "real estate", "ongoing", "current", "future", "upcoming", "completed", "portfolio"
        ]
        is_project_query = any(kw in lower_msg for kw in project_keywords)

        # Analyze conversation topics
        def get_conversation_topics(history):
            topics = defaultdict(int)
            for msg in history:
                content = msg['content'].lower()
                if 'amenity' in content or 'facility' in content:
                    topics['amenities'] += 1
                if 'price' in content or 'cost' in content:
                    topics['pricing'] += 1
                if 'location' in content or 'where' in content:
                    topics['location'] += 1
                if 'villa' in content or 'property' in content:
                    topics['property'] += 1
            return topics

        topics = get_conversation_topics(conversation_history[session_id])
        most_discussed = max(topics.items(), key=lambda x: x[1])[0] if topics else None

        # System prompt selection with enhanced context
        if is_greeting:
            system_prompt = f"Respond with a friendly greeting and mention a key highlight about LakeWoods Villas that would interest a new visitor."
        elif is_acknowledgment:
            next_topic = None
            if most_discussed == 'amenities':
                next_topic = 'You might also be interested in our villa specifications.'
            elif most_discussed == 'pricing':
                next_topic = 'Would you like to know about our available plot sizes?'
            elif most_discussed == 'location':
                next_topic = 'I can tell you about the nearby facilities and connectivity.'
            elif most_discussed == 'property':
                next_topic = 'Would you like to learn about our amenities?'
            
            system_prompt = f"Respond with a polite acknowledgment and suggest: '{next_topic}'" if next_topic else "Respond with a short acknowledgment and ask if there's anything else you can help with."
        elif is_identity_question:
            system_prompt = (
                "You are the official assistant of Saridena Constructions and LakeWoods Villas. "
                "Answer that you are a virtual assistant representing them, emphasizing your knowledge "
                "about the project and ability to help with detailed information. Do not include any name."
            )
        elif is_trust_question:
            system_prompt = (
                "You are the official assistant for Saridena Constructions and LakeWoods Villas. "
                "Respond with a confident, concise answer emphasizing the company's experience, "
                "transparency, customer satisfaction, and quality. Include specific features that "
                "demonstrate our commitment to excellence."
            )
        elif is_unclear:
            system_prompt = (
                f"Based on our conversation about {most_discussed if most_discussed else 'LakeWoods Villas'}, "
                "I notice you need clarification. Ask specific questions to better understand what "
                "information would be most helpful."
            )
        elif is_project_query:
            # Identify user interests based on conversation
            interests = [topic for topic, count in topics.items() if count > 0]
            interest_context = ""
            if interests:
                interest_context = f"Based on your interest in {', '.join(interests)}, "
            
            system_prompt = (
                "You are the official assistant for Saridena Constructions and LakeWoods Villas. "
                f"{interest_context}let me tell you about LakeWoods Villas. "
                "Only mention LakeWoods Villas as the current project. Do NOT invent or mention any other projects. "
                "If asked about other projects, emphasize that LakeWoods Villas is our exclusive luxury development. "
                "Focus on aspects that align with the user's demonstrated interests. "
                "Never make up project names or details. Only use the information below.\n\n"
                f"Knowledge Base:\n{context}\n{conversation_context}\n\nUser message: \"{user_message}\"\n\nAnswer accordingly."
            )
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
