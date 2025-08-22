from flask import Flask, request, jsonify
from flask_cors import CORS
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import requests
from chromadb import PersistentClient
import socket
import os
import time
from collections import defaultdict

# Change to the script's directory to ensure relative paths work
os.chdir(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Store conversation history per session (in production, use Redis or database)
conversation_history = defaultdict(list)

# Load persistent Chroma vector database
client = PersistentClient(path="./chroma-db")

# Get your collection
collection = client.get_collection("villa_data")

# Load embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Ollama API endpoint (keep private, only accessible from this machine)
OLLAMA_API = "http://localhost:11434/api/chat"


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    session_id = data.get("session_id", "default")  # Get session ID for conversation tracking

    if not user_message:
        return jsonify({"error": "Missing 'message'"}), 400

    try:
        # Step 1: Embed the user's question
        user_vector = embed_model.encode(user_message).tolist()

        # Step 2: Find top 3 relevant chunks from vector DB
        results = collection.query(query_embeddings=[user_vector], n_results=3)
        chunks = results["documents"][0]
        context = "\n\n".join(chunks)

        # Step 3: Get conversation history for this session
        history = conversation_history[session_id]
        
        # Step 4: Create conversation context
        conversation_context = ""
        if history:
            conversation_context = "\n\nPrevious conversation:\n"
            for msg in history[-6:]:  # Keep last 6 messages (3 exchanges)
                conversation_context += f"{msg['role']}: {msg['content']}\n"

        # Step 5: Create prompt for Ollama
        # Check if it's a simple greeting and this is the first message
        is_first_greeting = (len(history) == 0 and 
                           any(word in user_message.lower() for word in ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening']))
        
        if is_first_greeting:
            system_prompt = f"""You are an AI assistant working for Saridena Constructions. This is the user's first message: "{user_message}"

CRITICAL IDENTITY RULES:
- You are an AI assistant, NOT a human person
- Do NOT use human names like Sophia, Rohan, etc.
- Always identify yourself as "AI assistant" or "digital assistant"
- Use phrases like "I'm the AI assistant here at Saridena Constructions"

RESPONSE GUIDELINES:
- Respond naturally to their greeting
- Be warm and friendly but brief
- Introduce yourself and offer to help
- Keep it short and conversational

Example response: "Hello! I'm the AI assistant here at Saridena Constructions. I'm here to help you learn about our luxury LakeWoods Villas project and answer any questions you might have about our company. How can I assist you today?"

Keep it simple, direct, and focused on helping them."""
        else:
            system_prompt = f"""You are a helpful AI assistant for Saridena Constructions and LakeWoods Villas.

STRICT ANTI-HALLUCINATION POLICY:
- ONLY use information provided in the 'Context from company database' and previous conversation history to answer the user's question.
- If the answer is NOT present in the context or history, DO NOT guess, make up, or invent any details.
- If you do not have the answer, politely say you do not have that information and offer to connect the user with the sales team for more details.

CORE PRINCIPLE: READ THE USER'S MESSAGE CAREFULLY AND RESPOND DIRECTLY TO WHAT THEY ARE ASKING.

AVOID REPETITION:
- Do NOT repeat information already given in the previous conversation history unless the user asks for it again.
- If the user asks for "more details", "tell me more", or similar, provide new, deeper, or more specific information than what you already gave, but ONLY if it is present in the context.
- If the user says "nice", "ok", or gives a short acknowledgment, do NOT repeat previous info. Instead, ask if they want to know anything else or offer a next step.

CRITICAL RESPONSE RULES:
- Answer the EXACT question the user is asking
- Do NOT redirect to sales pitches unless they specifically ask about buying
- Do NOT make assumptions about what they want to know
- If they ask a simple question, give a simple, direct answer
- If they ask "what?", "huh?", or seem confused, clarify or ask what they need help with

SPECIFIC QUESTION HANDLING:
- Trust questions ("can I trust this company?", "is this trustworthy?"): Give direct answers about company credibility, experience (16+ years), quality focus, and transparency, but ONLY if this is in the context.
- Simple questions ("hi", "what?"): Respond simply and directly
- Company questions: Answer with relevant company information from the context
- Project questions: Answer with relevant project information from the context

CONVERSATION STYLE:
- Be conversational but focused
- Don't overwhelm with unnecessary information
- Answer what they asked, then optionally ask if they need more info
- Keep responses concise unless they ask for details

TRUST & CREDIBILITY ANSWERS:
When asked about trust or company reliability:
- Yes, Saridena Constructions has 16+ years of experience (if this is in the context)
- We focus on luxury construction and quality (if this is in the context)
- We maintain transparency in our processes (if this is in the context)
- Our LakeWoods Villas project demonstrates our commitment to excellence (if this is in the context)
- Offer to provide references or connect with sales team if they want verification

CRITICAL FORMATTING RULES:
- Do NOT include "user:" or "assistant:" prefixes
- Do NOT echo conversation format
- Give clean, direct answers

Context from company database:
{context}
{conversation_context}

User's message: "{user_message}"

Read their message carefully and respond DIRECTLY to what they are asking. If the user asks for more details, provide new, deeper, or more specific information than before, but ONLY if it is present in the context. If you do not have the answer, say so and offer to connect them with the sales team for more information. NEVER make up or guess any details."""

        # Step 6: Call Ollama chat endpoint
        response = requests.post(
            OLLAMA_API,
            json={
                "model": "llama3.2:1b",  # Much faster model
                "messages": [{"role": "user", "content": system_prompt}],
                "stream": False,
                "options": {
                    "temperature": 0.4,  # Lower temperature for more focused, accurate responses
                    "top_p": 0.8,        # More focused responses
                    "max_tokens": 250,   # Shorter, more concise responses
                    "repeat_penalty": 1.2,
                    "presence_penalty": 0.3,  # Less aggressive topic switching
                    "frequency_penalty": 0.5   # Reduce repetition
                }
            },
            timeout=45  # 45 second backend timeout
        )

        reply = "Sorry, something went wrong."
        if response.ok:
            result = response.json()
            print("Ollama response:", result)  # Debug log
            if "message" in result and "content" in result["message"]:
                raw_reply = result["message"]["content"]
                
                # Clean up the response - remove any thinking process or internal reasoning
                reply = clean_response(raw_reply)

        # Step 7: Store conversation in memory
        conversation_history[session_id].append({"role": "user", "content": user_message})
        conversation_history[session_id].append({"role": "assistant", "content": reply})
        
        # Keep only last 20 messages to prevent memory bloat
        if len(conversation_history[session_id]) > 20:
            conversation_history[session_id] = conversation_history[session_id][-20:]

        # Step 8: Return assistant's message content to frontend
        return jsonify({"response": reply})

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500


def clean_response(response):
    """Clean up the AI response by removing conversation formatting and thinking patterns"""
    # Remove conversation format prefixes
    lines = response.split('\n')
    cleaned_lines = []
    
    for line in lines:
        line = line.strip()
        if line:
            # Remove conversation format markers
            if line.startswith('user:') or line.startswith('assistant:'):
                continue
            if line.startswith('User:') or line.startswith('Assistant:'):
                continue
            if line.startswith('Human:') or line.startswith('AI:'):
                continue
            
            # Remove obvious thinking patterns
            obvious_thinking_patterns = [
                "Let me think about this",
                "Let me consider",
                "I should mention",
                "I need to",
                "I'll provide"
            ]
            
            # Only skip lines that are obvious internal thinking
            is_obvious_thinking = any(line.startswith(pattern) for pattern in obvious_thinking_patterns)
            if not is_obvious_thinking:
                cleaned_lines.append(line)
    
    cleaned_response = '\n'.join(cleaned_lines)
    
    # Remove any remaining conversation format at the start
    cleaned_response = cleaned_response.strip()
    if cleaned_response.lower().startswith('assistant:'):
        cleaned_response = cleaned_response[10:].strip()
    if cleaned_response.lower().startswith('user:'):
        cleaned_response = cleaned_response[5:].strip()
    
    # If the response is too short after cleaning, return original
    if len(cleaned_response.strip()) < 30:
        return response
    
    return cleaned_response


@app.route("/")
def index():
    return "Backend server is running."


if __name__ == "__main__":
    # Get LAN IP automatically (so React frontend can call it easily)
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"✅ Flask server running on http://{local_ip}:5000")
    app.run(host="0.0.0.0", port=5000)
