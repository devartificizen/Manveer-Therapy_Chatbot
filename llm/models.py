# fastapi-backend/models.py
from pydantic import BaseModel, Field

class UserInput(BaseModel):
    input: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)