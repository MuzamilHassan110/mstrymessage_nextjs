import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.API_KEY as string;

// Array of different prompt templates to add variety
const promptTemplates = [
  "Create three thought-provoking questions about personal growth and life experiences, separated by '||'. Focus on topics that encourage sharing positive memories and aspirations.",
  "Generate three fun and creative questions about hobbies, entertainment, and daily life, separated by '||'. Keep the tone light and engaging.",
  "Create three unique questions about dreams, goals, and future plans, separated by '||'. Make them inspiring and forward-looking.",
  "Generate three questions about favorite memories, experiences, and moments that made people smile, separated by '||'. Keep it upbeat and nostalgic.",
  "Create three questions about hypothetical scenarios and 'what-if' situations, separated by '||'. Make them imaginative but not too personal.",
];

export async function POST(req: Request) {
  try {
    // Randomly select a prompt template
    const randomTemplate =
      promptTemplates[Math.floor(Math.random() * promptTemplates.length)];

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the random template
    const result = await model.generateContent(randomTemplate);

    if (result && result.response) {
      const generatedText = await result.response.text();

      // Add timestamp to help ensure uniqueness
      return NextResponse.json({
        message: generatedText,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: "No content generated." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in AI API:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the suggestions." },
      { status: 500 }
    );
  }
}
