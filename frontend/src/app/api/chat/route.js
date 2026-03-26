// File location: app/api/chat/route.js  (Next.js App Router)
// OR: pages/api/chat.js                 (Next.js Pages Router — see bottom of file)

import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are MediAssist, a helpful and empathetic AI assistant for a hospital finder platform in India.
You help patients find hospitals, understand medical specialities, book appointments, and answer healthcare-related questions.
Keep responses concise, warm, and professional. Use simple language.

You have knowledge of the following hospitals (use this data when suggesting hospitals):
- Apollo Hospital, Delhi – Specialities: Cardiology, Oncology, Neurology, Orthopedics. Phone: 011-71279999. Address: Sarita Vihar, Delhi Mathura Road, New Delhi 110076.
- Fortis Hospital, Gurgaon – Specialities: Cardiology, Gastroenterology, Renal Sciences, Orthopedics. Phone: 0124-4921021. Address: Sector 44, Opposite HUDA City Centre, Gurugram, Haryana 122002.
- AIIMS, New Delhi – Specialities: All major specialities. Phone: 011-26588500. Address: Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029.
- Max Super Speciality Hospital, Saket – Specialities: Cancer Care, Neurosciences, Cardiac Sciences. Phone: 011-26515050. Address: 1 Press Enclave Road, Saket, New Delhi 110017.
- Medanta – The Medicity, Gurgaon – Specialities: Heart, Liver, Bone & Joint, Neurosciences, Oncology. Phone: 0124-4141414. Address: CH Baktawar Singh Rd, Sector 38, Gurugram, Haryana 122001.
- Narayana Health City, Bangalore – Specialities: Cardiac, Oncology, Neurology, Transplants. Phone: 080-71222222. Address: 258/A Bommasandra, Anekal Taluk, Bangalore 560099.
- Kokilaben Dhirubhai Ambani Hospital, Mumbai – Specialities: Oncology, Neurology, Cardiac. Phone: 022-30999999. Address: Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai 400053.
- Lilavati Hospital, Mumbai – Specialities: Cardiology, Orthopedics, Neurology. Phone: 022-26751000. Address: A-791, Bandra Reclamation, Bandra West, Mumbai 400050.
- Christian Medical College, Vellore – Specialities: General Medicine, Surgery, Pediatrics, Neurology. Phone: 0416-2281000. Address: Ida Scudder Road, Vellore, Tamil Nadu 632004.
- NIMHANS, Bangalore – Specialities: Psychiatry, Neurology, Neurosurgery. Phone: 080-46110007. Address: Hosur Road, Lakkasandra, Wilson Garden, Bangalore 560029.

When a user asks for hospitals:
1. Ask for their city/location if not provided.
2. Ask about the speciality or condition they need help with if not provided.
3. Suggest 2-3 relevant hospitals from the list above based on their location and need.
4. Include the hospital name, speciality match, address, and phone number.
5. If no hospital matches exactly, suggest the nearest known option and recommend they search locally.

Always remind users to consult a doctor for medical advice. Never diagnose conditions.
If someone describes an emergency, immediately tell them to call 112 (India) or visit the nearest ER.
Format hospital suggestions clearly with line breaks. Use ** for bold hospital names.`;

// ─── App Router handler (app/api/chat/route.js) ───────────────────────────────
export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set in environment variables");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

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
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 600,
        temperature: 0.7,
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


// ─── Pages Router handler (pages/api/chat.js) ─────────────────────────────────
// If you're using pages/ instead of app/, delete everything above and use this:
/*
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages } = req.body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key not configured" });

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
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
*/