import { connect } from "@/dbConfig/dbConfig";
import Chats from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";
import { generateAssistantReply } from "@/helpers/getGptResponse";

await connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { session, role, content } = reqBody;
    console.log(reqBody);
    const userChat = new Chats({
      session,
      role,
      content,
    });

    const savedUserChat = await userChat.save();

    const gptResponse = await generateAssistantReply(content);

    const assistantChat = new Chats({
      session,
      role: "assistant",
      content: gptResponse,
    });

    const savedAssistantChat = await assistantChat.save();

    return NextResponse.json({
      message: "New chat entry created successfully",
      success: true,
      savedUserChat,
      savedAssistantChat,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Trying to fetch chats");
    const { searchParams } = new URL(request.url);
    const session = searchParams.get("session");
    console.log(session);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    const chats = await Chats.find({ session }).sort({ createdAt: 1 }); // oldest → newest

    return NextResponse.json({
      success: true,
      chats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
