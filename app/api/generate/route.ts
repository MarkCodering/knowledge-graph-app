// --- file: app/api/generate/route.ts ---
import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder for the actual Gemini API call logic.
// In a real application, you would use the official Google AI SDK.
async function callGeminiAPI(prompt: string, responseSchema: any = null) {
  const payload: any = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  if (responseSchema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    };
  }

  // NOTE: In a real Next.js app, the API key should be stored in .env.local
  // and NOT be exposed to the client. The fetch call happens on the server-side here.
  const apiKey = process.env.GEMINI_API_KEY || ""; // Fallback to empty string for environment without key
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("API Error:", errorBody);
    throw new Error(`API request failed with status ${res.status}`);
  }

  const data = await res.json();
  if (data.candidates && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text;
  }
  
  if(data.promptFeedback?.blockReason) {
     throw new Error(`Request blocked: ${data.promptFeedback.blockReason}`);
  }

  throw new Error("Invalid API response structure");
}


export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Get the text explanation
    const textPrompt = `You are a helpful AI assistant. Explain the following concept clearly and concisely. Concept: "${prompt}"`;
    const textResponse = await callGeminiAPI(textPrompt);

    // 2. Extract graph data from the explanation
    const graphPrompt = `Analyze the following text and extract the key technical concepts as nodes and their relationships as directed edges. The graph should represent the core ideas. Identify 5-10 main nodes. Text: """${textResponse}"""`;
    const schema = {
      type: "OBJECT",
      properties: {
        nodes: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { id: { type: "STRING" } },
            required: ["id"],
          },
        },
        edges: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { from: { type: "STRING" }, to: { type: "STRING" } },
            required: ["from", "to"],
          },
        },
      },
      required: ["nodes", "edges"],
    };
    const jsonString = await callGeminiAPI(graphPrompt, schema);
    const graphData = JSON.parse(jsonString);

    return NextResponse.json({ text: textResponse, graph: graphData });

  } catch (error: any) {
    console.error('[API_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
