// import { openai } from "@ai-sdk/openai";
// import { streamText, generateText } from "ai";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = streamText({
//     model: openai("gpt-4o"),
//     messages,
//   });

//   // const result = await generateText({
//   //   model: openai.responses("gpt-4o"),
//   //   messages,
//   // });

//   return result.toDataStreamResponse();
// }

// for deepseek chatbot

// import { deepseek } from "@ai-sdk/deepseek";
// import { streamText } from "ai";

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = streamText({
//     model: deepseek("deepseek-reasoner"),
//     messages,
//   });

//   return result.toDataStreamResponse({
//     sendReasoning: true,
//   });
// }

import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Create v0 provider using OpenAI-compatible format
const v0 = createOpenAI({
  baseURL: "https://api.v0.dev/v1",
  apiKey: process.env.V0_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: v0("v0-1.0-md"),
    messages,
    system:
      "You are a helpful AI assistant specialized in web development and modern frameworks.",
  });

  return result.toDataStreamResponse();
}
