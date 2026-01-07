// app/api/stories/generate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/db/supabase" // ✅ Fixed Import

// OpenRouter API call function (আপনার কোডই রাখা হয়েছে)
async function generateWithOpenRouter(prompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Kids Story Generator"
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "system",
          content: `You are a creative children's story writer. Write engaging, 
                    age-appropriate stories with moral lessons. Use simple language 
                    and vivid descriptions that children will love.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8
    })
  })

  const data = await response.json()

  if (!response.ok) {
    console.error("OpenRouter API Error:", data)
    throw new Error(data.error?.message || `API Error: ${response.status}`)
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("No content in AI response")
  }

  return content
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()
    
    // ✅ Change: userId এখন বডি থেকে নেওয়া হচ্ছে (session এর বদলে)
    const { 
      userId, 
      childName, 
      age, 
      theme, 
      language = "bengali",
      genre = "adventure",
      includeImages = false 
    } = body

    // 2. Validate Authentication
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User ID required" },
        { status: 401 }
      )
    }

    // 3. Validate required fields
    if (!childName?.trim()) {
      return NextResponse.json(
        { error: "Child name is required" },
        { status: 400 }
      )
    }

    if (!age || age < 1 || age > 15) {
      return NextResponse.json(
        { error: "Valid age (1-15) is required" },
        { status: 400 }
      )
    }

    if (!theme?.trim()) {
      return NextResponse.json(
        { error: "Story theme is required" },
        { status: 400 }
      )
    }

    // 4. Build the prompt
    const languageMap: Record<string, string> = {
      bengali: "Bengali (বাংলা)",
      english: "English",
      hindi: "Hindi"
    }

    const prompt = `
      Write a ${genre} story for a ${age}-year-old child named ${childName}.
      
      Theme: ${theme}
      Language: ${languageMap[language] || "Bengali"}
      
      Requirements:
      - Story length: approximately 300-400 words
      - Use simple, age-appropriate vocabulary
      - Include dialogue between characters
      - Add a positive moral lesson at the end
      - Make ${childName} the hero of the story
      - Create vivid, imaginative scenes
      
      Format the story with:
      - A creative title
      - The main story
      - "নীতিকথা" (Moral) at the end
    `

    // 5. Generate story with AI
    console.log("Generating story for:", { childName, age, theme, language })
    
    const storyContent = await generateWithOpenRouter(prompt)

    // 6. Extract title
    const titleMatch = storyContent.match(/^#?\s*(.+?)[\n\r]/)
    const title = titleMatch?.[1]?.trim() || `${childName}-এর ${theme} গল্প`

    // 7. Save to Supabase
    // ✅ Change: getSupabaseAdmin() ব্যবহার করা হয়েছে
    const supabase = getSupabaseAdmin() 
    
    const { data: story, error: dbError } = await supabase
      .from("stories")
      .insert({
        user_id: userId, // ✅ session.user.id এর বদলে userId
        child_name: childName.trim(),
        age: parseInt(age),
        theme: theme.trim(),
        genre,
        language,
        title,
        content: storyContent,
        is_favorite: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error("Supabase Error:", dbError)
      return NextResponse.json(
        { error: "Failed to save story", details: dbError.message },
        { status: 500 }
      )
    }

    // 8. Return success
    return NextResponse.json({
      success: true,
      story: {
        id: story.id,
        title,
        content: storyContent,
        childName: childName.trim(),
        age,
        theme,
        language,
        createdAt: story.created_at
      }
    })

  } catch (error: any) {
    console.error("Story Generation Error:", error)
    
    if (error.message?.includes("rate limit")) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate story" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/stories/generate",
    method: "POST"
  })
}