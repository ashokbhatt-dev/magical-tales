// lib/ai/generateStory.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables")
}

const genAI = new GoogleGenerativeAI(apiKey)

interface StoryParams {
  kidName: string
  gender: string
  age: number
  language: string
  storyType: string
  length: string
  setting: string
  moral: string
  mood: string
  includeQuiz: boolean
}

export async function generateStory(params: StoryParams) {
  try {
    console.log("Initializing Gemini AI model...")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Determine page count based on length
    const pageCount = params.length === "short" ? 5 : params.length === "medium" ? 10 : 15
    const chapterCount = Math.ceil(pageCount / 2)

    console.log(`Generating ${pageCount} page story for ${params.kidName}...`)

    // Create prompt
    const prompt = `
You are an expert children's story writer.

Create a ${params.storyType} story for ${params.kidName}, a ${params.age} year old ${params.gender === 'boy' ? 'boy' : params.gender === 'girl' ? 'girl' : 'child'}.

Story Details:
- Language: ${params.language === 'bengali' ? 'Bengali' : 'English'}
- Length: ${pageCount} pages (120-150 words per page)
- Chapters: ${chapterCount}
- Setting: ${params.setting}
- Moral/Lesson: ${params.moral}
- Mood: ${params.mood}

Important Instructions:
1. Make ${params.kidName} the main character
2. Include exciting events on each page
3. Use simple language appropriate for a ${params.age} year old
4. Add dialogues to make the story lively
5. Include colorful descriptions in each chapter
6. Make the moral/lesson clear at the end
7. ${params.language === 'bengali' ? 'Write the entire story in Bengali language' : 'Write in English'}

${params.includeQuiz ? `
Create a quiz with:
- 3 multiple choice questions
- 4 options for each question
- Questions about main events, characters, and the lesson
` : ''}

IMPORTANT: Respond ONLY with valid JSON, no extra text before or after.

JSON Format:
{
  "title": "An engaging story title",
  "pages": [
    {
      "pageNumber": 1,
      "chapter": "Chapter name",
      "title": "Page title",
      "text": "Story content (120-150 words)",
      "illustrationBg": "forest",
      "emojis": ["🌲", "🏠", "✨"],
      "scene": "night"
    }
  ]${params.includeQuiz ? `,
  "quiz": {
    "enabled": true,
    "questions": [
      {
        "question": "Question text?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 0
      }
    ]
  }` : ''}
}

Generate the story now:
`

    console.log("Calling Gemini API...")
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    console.log("AI Response received, length:", response.length)
    console.log("First 200 chars:", response.substring(0, 200))
    
    // Clean response (remove markdown code blocks if present)
    let cleanedResponse = response.trim()
    
    // Remove markdown code blocks
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\n?/, '').replace(/\n?```$/, '')
    }
    
    console.log("Cleaned response, attempting to parse JSON...")
    
    // Parse JSON
    const storyData = JSON.parse(cleanedResponse)
    
    console.log("JSON parsed successfully! Pages:", storyData.pages?.length)
    
    // Validate structure
    if (!storyData.title || !storyData.pages || !Array.isArray(storyData.pages)) {
      throw new Error("Invalid story structure from AI")
    }
    
    return storyData
    
  } catch (error: any) {
    console.error("=== AI Generation Error ===")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)
    console.error("Full error:", error)
    
    if (error instanceof SyntaxError) {
      throw new Error("AI returned invalid JSON format")
    }
    
    throw new Error(`AI Generation failed: ${error.message}`)
  }
}