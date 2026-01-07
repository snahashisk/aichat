import { connect } from "@/dbConfig/dbConfig";
import ChatSession from "@/models/sessionModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

await connect();

export async function POST(request: NextRequest) {
  try {
    const user = await getDataFromToken(request);
    const reqBody = await request.json();
    const { title } = reqBody;
    console.log(reqBody);

    const newSession = new ChatSession({
      user,
      title,
    });

    const savedSession = await newSession.save();

    return NextResponse.json({
      message: "New Session Created Successfully",
      success: true,
      sessionId: savedSession._id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getDataFromToken(request);

    if (!user) {
      return NextResponse.json(
        { error: "user query parameter is required" },
        { status: 400 }
      );
    }

    const sessions = await ChatSession.find({
      user: user,
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
