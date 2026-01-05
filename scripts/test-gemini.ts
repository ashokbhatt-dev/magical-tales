// scripts/test-gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  
  try {
    // List available models
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
    const result = await model.generateContent("Say hello in Bengali")
    console.log("✅ Success:", result.response.text())
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

testGemini()