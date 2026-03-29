// app/api/chat/route.js  (Next.js App Router)

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Use the dynamic system prompt from the chatbot (includes live hospital data)
    // Falls back to a generic prompt if not provided
    const finalSystemPrompt = systemPrompt || `You are MediAssist, a helpful AI assistant for a hospital finder platform in India.
Help patients find hospitals, understand specialities, and compare options.
Always recommend consulting a doctor for medical advice. Never diagnose conditions.
For emergencies, tell users to call 112 immediately.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "MediAssist",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: finalSystemPrompt },
          ...messages,
        ],
        max_tokens: 700,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter error:", errorData);
      return NextResponse.json(
        { error: errorData?.error?.message || `OpenRouter error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}