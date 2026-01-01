import { connect } from "@/dbConfig/dbConfig";
import ChatSession from "@/models/sessionModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest){
  try {
  const reqBody = await request.json();
  const {user, title} = reqBody;
  console.log(reqBody);

  const newSession = new ChatSession({
    user,
    title
  })

  const savedSession = await newSession.save();

  return NextResponse.json({
    message: "New Session Created Successfully",
    success: true,
    savedSession
  })
  } catch (error: any) {
    return NextResponse.json({error: error.message},{status: 500})
  }
}


export async function GET(request: NextRequest) {
  try {
    const searchParams = await request.nextUrl.searchParams;
    console.log(searchParams);
    const userId = searchParams.get("user");

    if (!userId) {
      return NextResponse.json(
        { error: "user query parameter is required" },
        { status: 400 }
      );
    }

    const sessions = await ChatSession.find({
      user: userId
    })

    return NextResponse.json({
      success: true,
      sessions
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}