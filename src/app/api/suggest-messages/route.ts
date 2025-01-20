import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';



const openaiClient = new openai.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const maxDuration = 30;

export async function POST(req: Request) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {   
    const result = streamText({
        model: openai('gpt-4o'),
        messages: [
                 { role: "system", content: "You are a helpful assistant." },
                 { role: "user", content: prompt },
              ],
            
      });
    
      return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in AI API:", error);

    return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
