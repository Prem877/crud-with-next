// lib/deepseek.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com", // DeepSeek API endpoint
});

export default openai;