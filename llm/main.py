# fastapi-backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from models import UserInput
from llm import get_therapy_response

app = FastAPI()

@app.post("/get-therapy-response")
async def get_therapy_response_route(user_input: UserInput):
    """Handle user input and return the therapist's response."""
    try:
        print("Received input:", user_input)
        print("Parsed input as dictionary:", user_input.dict())

        # Generate the response
        response = get_therapy_response(user_input.user_id, user_input.input)

        return {"response": response}
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


