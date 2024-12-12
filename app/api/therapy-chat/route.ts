import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userInput = body.input;
    const userId = body.user_id || 'anonymous'; // Provide default if missing

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const response = await axios.post("http://127.0.0.1:8000/get-therapy-response", {
      input: userInput.trim(),
      user_id: userId
    },
    {
      headers: {
        "Content-Type": "application/json"
    }
  }
  );

    // Ensure we have a string response
    const responseText = typeof response.data.response === "string" 
      ? response.data.response 
      : JSON.stringify(response.data.response);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error fetching therapy response:", error);
    return NextResponse.json(
      { response: "Something went wrong" }, 
      { status: 500 }
    );
  }
}

