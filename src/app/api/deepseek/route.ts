// app/api/deepseek/route.ts
import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/deepseek";

interface RequestBody {
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message }: RequestBody = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      stream: false,
    });

    return NextResponse.json(
      { data: response.choices[0].message.content },
      { status: 200 }
    );
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}