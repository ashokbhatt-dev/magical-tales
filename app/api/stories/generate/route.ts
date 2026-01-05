// app/api/stories/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db/supabase'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📖 Story generation started...')

    const {
      userId,
      kidId,
      kidName,
      gender,
      age,
      title,
      language = 'bengali',
      storyType = 'adventure',
      length = 'medium',
      setting = 'magical_forest',
      moral = 'kindness',
      mood = 'happy',
      theme = 'sparkle',
      includeQuiz = false
    } = body

    if (!userId || !kidId || !kidName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ✅ More content per page
    const lengthConfig: Record<string, { words: number; pages: number; wordsPerPage: number }> = {
      short: { words: 600, pages: 5, wordsPerPage: 120 },
      medium: { words: 1200, pages: 10, wordsPerPage: 120 },
      long: { words: 1800, pages: 15, wordsPerPage: 120 }
    }
    const config = lengthConfig[length] || lengthConfig.medium

    // Build the improved prompt
    const prompt = buildNaturalStoryPrompt({
      kidName,
      gender,
      age,
      language,
      storyType,
      setting,
      moral,
      mood,
      wordCount: config.words,
      pages: config.pages,
      wordsPerPage: config.wordsPerPage,
      includeQuiz
    })

    console.log('🤖 Calling Groq API...')

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(language)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.85, // ✅ Slightly higher for creativity
        max_tokens: 5000,
      }),
    })

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json()
      console.error('❌ Groq Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate story', details: errorData },
        { status: groqResponse.status }
      )
    }

    const aiData = await groqResponse.json()
    const aiContent = aiData.choices[0]?.message?.content

    if (!aiContent) {
      return NextResponse.json(
        { error: 'No content received from AI' },
        { status: 500 }
      )
    }

    console.log('✅ AI Content received, length:', aiContent.length)

    // Parse AI response
    let storyData = parseAIResponse(aiContent, kidName, storyType, moral, title, language)

    // Clean content
    if (storyData.content) {
      storyData.content = cleanStoryContent(storyData.content)
    }

    const wordCount = storyData.content?.split(/\s+/).length || config.words
    const readingTime = Math.ceil(wordCount / 100) // Kids read slower

    console.log('💾 Saving to database...')

    const supabase = getSupabaseAdmin()
    
    const { data: story, error: dbError } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        kid_id: kidId,
        title: storyData.title,
        content: storyData.content,
        language,
        story_type: storyType,
        length,
        setting,
        moral: storyData.moral_lesson || moral,
        mood,
        theme,
        word_count: wordCount,
        reading_time: readingTime,
        is_favorite: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database Error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save story', details: dbError },
        { status: 500 }
      )
    }

    console.log('✅ Story saved:', story.id)

    // Save quiz
    if (includeQuiz && storyData.quiz && storyData.quiz.length > 0) {
      const quizQuestions = storyData.quiz.map((q: any, index: number) => ({
        story_id: story.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: q.correct_answer || q.options?.[0] || '',
        order_index: index
      }))

      const { error: quizError } = await supabase
        .from('quiz_questions')
        .insert(quizQuestions)

      if (quizError) {
        console.warn('⚠️ Quiz save error:', quizError)
      } else {
        console.log('✅ Quiz saved:', quizQuestions.length, 'questions')
      }
    }

    return NextResponse.json({
      success: true,
      story: {
        id: story.id,
        title: story.title,
        content: story.content,
        wordCount,
        readingTime,
        quiz: storyData.quiz || []
      }
    })

  } catch (error) {
    console.error('❌ Server Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// ✅ NEW: System prompt for natural storytelling


function getSystemPrompt(language: string): string {
  if (language === 'bengali') {
    return `তুমি বাংলাদেশের একজন বিখ্যাত শিশুসাহিত্যিক। তুমি উপেন্দ্রকিশোর রায়চৌধুরী, সুকুমার রায়, এবং রবীন্দ্রনাথের মতো সুন্দর বাংলায় গল্প লেখো।

তোমার লেখার বৈশিষ্ট্য:
• সহজ, সরল বাংলা ভাষা যা ৩-১২ বছরের বাচ্চারা বুঝতে পারে
• প্রাণবন্ত বর্ণনা - দৃশ্য যেন চোখে ভাসে
• চরিত্রদের মধ্যে স্বাভাবিক সংলাপ
• আবেগ ও অনুভূতির প্রকাশ
• প্রতিটি অনুচ্ছেদ কমপক্ষে ১০০ শব্দের
• গল্পে উত্থান-পতন ও চমক
• শেষে সুন্দর শিক্ষা

তুমি সবসময় শুধু valid JSON ফরম্যাটে উত্তর দাও। কোনো অতিরিক্ত ব্যাখ্যা বা markdown দাও না।`
  }

  return `You are an award-winning children's story writer. You write like Roald Dahl, Dr. Seuss, and classic fairy tale authors.

Your writing style:
• Simple, engaging language for ages 3-12
• Vivid, colorful descriptions that paint pictures
• Natural dialogue between characters
• Express emotions and feelings clearly
• Each paragraph is at least 100 words
• Stories have twists and surprises
• Clear moral lesson at the end

Always respond with valid JSON only. No explanations or markdown.`
}




// ✅ NEW: Build natural story prompt
function buildNaturalStoryPrompt(params: {
  kidName: string
  gender: string
  age: number
  language: string
  storyType: string
  setting: string
  moral: string
  mood: string
  wordCount: number
  pages: number
  wordsPerPage: number
  includeQuiz: boolean
}): string {
  const { kidName, gender, age, language, storyType, setting, moral, mood, wordCount, pages, wordsPerPage, includeQuiz } = params

  const pronoun = gender === 'girl' ? 'সে (মেয়ে)' : gender === 'boy' ? 'সে (ছেলে)' : 'সে'
  const pronounEn = gender === 'girl' ? 'she/her' : gender === 'boy' ? 'he/him' : 'they/them'

  const settingDescriptions: Record<string, { bn: string; en: string }> = {
    magical_forest: { 
      bn: 'রহস্যময় জাদুর বন যেখানে গাছপালা কথা বলে, পরীরা উড়ে বেড়ায়',
      en: 'a mysterious magical forest where trees whisper and fairies flutter'
    },
    underwater: { 
      bn: 'গভীর সমুদ্রের নিচে রঙিন প্রবাল আর মাছেদের রাজ্য',
      en: 'deep underwater kingdom with colorful corals and talking fish'
    },
    space: { 
      bn: 'তারায় ভরা মহাকাশে অজানা গ্রহের অভিযান',
      en: 'a journey through starry space to unknown planets'
    },
    kingdom: { 
      bn: 'প্রাচীন রাজপ্রাসাদ যেখানে রাজা-রানী আর রাজকুমার-রাজকুমারী থাকে',
      en: 'an ancient royal palace with kings, queens, princes and princesses'
    },
    village: { 
      bn: 'সবুজ গ্রাম যেখানে নদী বয়ে যায়, পাখিরা গান গায়',
      en: 'a green village where rivers flow and birds sing'
    },
    school: {
      bn: 'রঙিন স্কুল যেখানে বন্ধুরা একসাথে শেখে আর খেলে',
      en: 'a colorful school where friends learn and play together'
    },
    home: {
      bn: 'উষ্ণ পরিবারের মায়াময় বাড়ি',
      en: 'a warm, loving family home'
    }
  }

  const moralDescriptions: Record<string, { bn: string; en: string }> = {
    friendship: { bn: 'সত্যিকারের বন্ধুত্বের মূল্য', en: 'the value of true friendship' },
    honesty: { bn: 'সততার শক্তি', en: 'the power of honesty' },
    courage: { bn: 'সাহস দেখানোর গুরুত্ব', en: 'the importance of showing courage' },
    kindness: { bn: 'দয়া ও সহানুভূতি', en: 'kindness and compassion' },
    sharing: { bn: 'ভাগ করে নেওয়ার আনন্দ', en: 'the joy of sharing' },
    responsibility: { bn: 'দায়িত্ববোধ', en: 'sense of responsibility' },
    teamwork: { bn: 'একসাথে কাজ করার শক্তি', en: 'the power of working together' }
  }

  const storyTypeDescriptions: Record<string, { bn: string; en: string }> = {
    adventure: { bn: 'রোমাঞ্চকর অ্যাডভেঞ্চার', en: 'thrilling adventure' },
    fairytale: { bn: 'জাদুময় রূপকথা', en: 'magical fairy tale' },
    educational: { bn: 'শিক্ষণীয় গল্প', en: 'educational story' },
    bedtime: { bn: 'মিষ্টি ঘুমপাড়ানি গল্প', en: 'sweet bedtime story' },
    moral: { bn: 'নৈতিক শিক্ষার গল্প', en: 'moral story' },
    fantasy: { bn: 'কল্পনার রাজ্যের গল্প', en: 'fantasy story' }
  }

  const settingDesc = settingDescriptions[setting] || settingDescriptions.magical_forest
  const moralDesc = moralDescriptions[moral] || moralDescriptions.kindness
  const storyTypeDesc = storyTypeDescriptions[storyType] || storyTypeDescriptions.adventure

  if (language === 'bengali') {
    return `
${kidName} নামের ${age} বছরের এক ${gender === 'girl' ? 'মেয়ের' : 'ছেলের'} জন্য একটি ${storyTypeDesc.bn} লেখো।

📍 গল্পের পটভূমি: ${settingDesc.bn}
🎭 গল্পের মেজাজ: ${mood === 'happy' ? 'হাসিখুশি ও আনন্দময়' : mood === 'exciting' ? 'উত্তেজনাপূর্ণ' : mood === 'calm' ? 'শান্ত ও প্রশান্ত' : 'চিন্তাশীল'}
💡 শিক্ষা: ${moralDesc.bn}

✍️ লেখার নিয়ম:
• মোট ${wordCount} শব্দের গল্প লিখবে
• ${pages}টি আলাদা প্যারাগ্রাফে ভাগ করবে (প্রতিটি প্যারাগ্রাফ কমপক্ষে ${wordsPerPage} শব্দ)
• ${kidName} প্রধান চরিত্র, কিন্তু প্রতি বাক্যে নাম ব্যবহার করবে না
• "সে", "তার", "ও" ইত্যাদি সর্বনাম ব্যবহার করো
• গল্প বিভিন্নভাবে শুরু করো - "একদিন", "সেই গ্রামে", "অনেক দিন আগে", "সকালের আলো ফোটার সাথে সাথে"
• চরিত্রদের মধ্যে সংলাপ থাকবে
• দৃশ্যের বর্ণনা থাকবে - রং, গন্ধ, শব্দ, অনুভূতি
• গল্পে উত্থান-পতন থাকবে - সমস্যা ও সমাধান
• শেষে সুন্দর একটি উপসংহার

📝 JSON ফরম্যাট:
{
  "title": "বাংলায় গল্পের শিরোনাম",
  "content": "প্রথম প্যারাগ্রাফ...\\n\\nদ্বিতীয় প্যারাগ্রাফ...\\n\\n...আরও প্যারাগ্রাফ",
  "moral_lesson": "গল্পের শিক্ষা"${includeQuiz ? `,
  "quiz": [
    {
      "question": "গল্প থেকে প্রশ্ন?",
      "options": ["উত্তর ১", "উত্তর ২", "উত্তর ৩", "উত্তর ৪"],
      "correct_answer": "সঠিক উত্তর"
    },
    {
      "question": "আরেকটি প্রশ্ন?",
      "options": ["উত্তর ১", "উত্তর ২", "উত্তর ৩", "উত্তর ৪"],
      "correct_answer": "সঠিক উত্তর"
    }
  ]` : ''}
}

⚠️ শুধু JSON দাও, অন্য কিছু না।`
  }

  // English prompt
  return `
Write a ${storyTypeDesc.en} for a ${age}-year-old ${gender} named ${kidName}.

📍 Setting: ${settingDesc.en}
🎭 Mood: ${mood}
💡 Moral: ${moralDesc.en}

✍️ Writing Guidelines:
• Total ${wordCount} words
• ${pages} separate paragraphs (each at least ${wordsPerPage} words)
• ${kidName} is the main character, but DON'T use their name in every sentence
• Use pronouns naturally: ${pronounEn}
• Start the story in varied ways - "One day", "In a faraway land", "As the sun rose"
• Include dialogue between characters
• Describe scenes vividly - colors, sounds, feelings
• Have a problem and solution
• End with a satisfying conclusion

📝 JSON Format:
{
  "title": "Story Title",
  "content": "First paragraph...\\n\\nSecond paragraph...\\n\\n...more paragraphs",
  "moral_lesson": "The lesson from the story"${includeQuiz ? `,
  "quiz": [
    {
      "question": "Question about the story?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Correct option"
    },
    {
      "question": "Another question?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Correct option"
    }
  ]` : ''}
}

⚠️ Return ONLY valid JSON.`
}

// Parse AI response
function parseAIResponse(
  aiContent: string, 
  kidName: string, 
  storyType: string, 
  moral: string,
  title: string | undefined,
  language: string
): {
  title: string
  content: string
  moral_lesson: string
  quiz?: any[]
} {
  let storyData: any = null

  // Strategy 1: Direct JSON parse
  try {
    let cleanContent = aiContent.trim()
    if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
    else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
    if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
    
    storyData = JSON.parse(cleanContent.trim())
    if (storyData.title && storyData.content) {
      console.log('✅ JSON parsed successfully')
      return storyData
    }
  } catch (e) {
    console.log('⚠️ Direct parse failed, trying extraction...')
  }

  // Strategy 2: Extract JSON from text
  try {
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      storyData = JSON.parse(jsonMatch[0])
      if (storyData.title && storyData.content) {
        console.log('✅ JSON extracted successfully')
        return storyData
      }
    }
  } catch (e) {
    console.log('⚠️ Extraction failed, using regex...')
  }

  // Strategy 3: Regex extraction
  try {
    const titleMatch = aiContent.match(/"title"\s*:\s*"([^"]+)"/)
    const contentMatch = aiContent.match(/"content"\s*:\s*"([\s\S]*?)"(?=\s*[,}])/)
    const moralMatch = aiContent.match(/"moral_lesson"\s*:\s*"([^"]+)"/)

    if (titleMatch && contentMatch) {
      let quiz: any[] = []
      const quizMatch = aiContent.match(/"quiz"\s*:\s*\[([\s\S]*?)\]/)
      if (quizMatch) {
        try {
          quiz = JSON.parse(`[${quizMatch[1]}]`)
        } catch (e) {}
      }
      
      return {
        title: titleMatch[1],
        content: contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
        moral_lesson: moralMatch?.[1] || moral,
        quiz
      }
    }
  } catch (e) {
    console.log('⚠️ Regex failed, using fallback...')
  }

  // Fallback
  const defaultTitle = language === 'bengali' 
    ? `${kidName}-এর অভিযান`
    : `${kidName}'s Adventure`

  return {
    title: title || defaultTitle,
    content: aiContent.replace(/```json|```/g, '').trim(),
    moral_lesson: moral
  }
}

// Clean story content
function cleanStoryContent(content: string): string {
  return content
    .replace(/,?\s*"moral_lesson"\s*:.*$/is, '')
    .replace(/,?\s*"quiz"\s*:\s*\[.*$/is, '')
    .replace(/\s*}\s*$/g, '')
    .replace(/\\n\\n/g, '\n\n')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/^["']|["']$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}