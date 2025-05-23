// app/api/chat/route.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
  SafetySetting,
  Content, // Type for chat history
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.0-flash"; // Or a more recent/specific free-tier model
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "GOOGLE_GEMINI_API_KEY is not defined in environment variables."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Define a type for the expected request body
interface RequestBody {
  history: Content[]; // Use Content type from SDK for history
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { history, message }: RequestBody = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message content is missing." },
        { status: 400 }
      );
    }

    const generationConfig: GenerationConfig = {
      temperature: 0.8,
      topK: 1,
      topP: 0.95,
      maxOutputTokens: 200,
    };

    const safetySettings: SafetySetting[] = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    console.log("Gemini response:", response);
    

    if (!response) {
      return NextResponse.json(
        { error: "No response from Gemini model." },
        { status: 500 }
      );
    }

    const text = response.text();
    return NextResponse.json({ text });
  } catch (error: any) {
    // Use 'any' or a more specific error type
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response from AI.",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
