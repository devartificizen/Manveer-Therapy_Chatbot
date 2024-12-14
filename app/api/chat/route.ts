import { connectToDB } from "@/utils/connectDB";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const { userId, messages } = await request.json();

    const chat = await Chat.create({
      userId,
      messages
    });

    return NextResponse.json({ success: true, chat }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create chat" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, chats }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
