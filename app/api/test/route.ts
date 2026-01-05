// app/api/test-openrouter/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return NextResponse.json({ 
      error: "OPENROUTER_API_KEY not found in .env.local" 
    }, { status: 500 })
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { role: "user", content: "Say 'Hello' in Bengali" }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: data.error?.message || "API failed",
        status: response.status
      }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      message: "OpenRouter is working! ✅",
      response: data.choices?.[0]?.message?.content,
      model: "google/gemini-2.0-flash-exp:free"
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}