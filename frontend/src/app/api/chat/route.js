export async function POST(req) {
  const { messages } = await req.json();

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "MediAssist",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free", // ✅ free model
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `You are MediAssist, a helpful and empathetic AI assistant for a hospital finder platform.
You help patients find hospitals, understand medical specialities, book appointments, and answer healthcare-related questions.
Keep responses concise, warm, and professional. Use simple language.
If someone describes an emergency, immediately tell them to call 112 (India) or visit the nearest ER.`,
        },
        ...messages,
      ],
    }),
  });

  const data = await res.json();
  return Response.json(data);
}