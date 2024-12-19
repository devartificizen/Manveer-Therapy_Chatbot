# Therapy Chatbot

A conversational AI chatbot designed to provide therapeutic support and mental health assistance.

## Features

- Natural language processing for mental health conversations
- Real-time chat interface
- Empathetic responses based on user input
- Secure and private conversations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.8+
- pip

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/therapy-bot.git
cd therapy-bot
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd llm
pip install -r requirements.txt
```

## Running the Application

1. Start the backend server (while in /llm):
```bash
uvicorn main:app --reload
```

2. In a new terminal, start the frontend:
```bash
cd ../therapy-bot
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Configuration

Create a `.env` file in the server directory with the following variables (only for chatbot functionality):
```
GOOGLE_API_KEY = "your_key"
```
