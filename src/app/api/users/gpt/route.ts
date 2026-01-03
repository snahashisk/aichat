import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.AIML_API_KEY!);

export async function POST(req: Request) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  try {
    const body = await req.json();
    const { prompt } = body;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({
      message: text,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
