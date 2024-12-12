# fastapi-backend/llm.py
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

# Load environment variables
load_dotenv()

# Initialize MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["therapy_bot"]
chat_history_collection = db["chat_history"]

# Retrieve API key from environment variables
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set. Check your .env file.")

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(
    api_key=api_key,
    model="gemini-1.5-pro",
    temperature=0.7,
    max_tokens=None,
    timeout=None,
    max_retries=2, 
)

# Define the system message for the therapist role
SYSTEM_PROMPT = (
    "You are a compassionate and understanding therapist. Your role is to provide thoughtful, empathetic, "
    "and supportive responses to users, helping them navigate their emotions and mental health challenges. "
    "You are also a medical expert in psychology and can diagnose users based on certain symptoms. "
    "Whenever you are about to suggest meditation, inform users about the Meditation Exercise functionality "
    "in our application (a breathing control exercise). If the user asks about this feature, describe it as "
    "an animation resembling a glowing ball: breathe in when it glows inward, and breathe out when it glows outward."
)

def get_or_create_user_context(user_id: str) -> list:
    """Retrieve or create a new context for a user."""
    print(f"Retrieving context for user_id: {user_id}")
    user_context = chat_history_collection.find_one({"user_id": user_id})
    print(f"Found context: {user_context}")
    if not user_context:
        print("No context found, creating a new one.")
        chat_history_collection.insert_one({"user_id": user_id, "history": []})
        return []
    return user_context["history"]

def update_user_context(user_id: str, new_message: dict):
    """Append a new message to the user's context."""
    print(f"Updating context for user_id: {user_id} with message: {new_message}")
    chat_history_collection.update_one(
        {"user_id": user_id},
        {"$push": {"history": new_message}}
    )

def get_therapy_response(user_id: str, user_input: str) -> str:
    """Process user input and generate a therapist's response."""
    # Retrieve conversation context
    print(user_id)
    context = get_or_create_user_context(user_id)

    # Format messages for LangChain
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    
    for msg in context:
        if msg["role"] == "human":
            messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            messages.append(AIMessage(content=msg["content"]))

    # Add current user message
    messages.append(HumanMessage(content=user_input))

    # Generate response
    response = llm.invoke(messages)

    # Update context
    update_user_context(user_id, {"role": "human", "content": user_input})
    update_user_context(user_id, {"role": "assistant", "content": response.content})

    return response.content

print("Code running successfully!")