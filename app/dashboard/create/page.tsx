// app/dashboard/create/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Wand2, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

interface Kid {
  id: string
  name: string
  gender: string
  age: number
  interests: string[]
}

export default function CreateStoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedKidId = searchParams.get('kidId')
  
  const [user, setUser] = useState<any>(null)
  const [kids, setKids] = useState<Kid[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const [formData, setFormData] = useState({
    kidId: preselectedKidId || "",
    title: "",
    language: "bengali",
    storyType: "adventure",
    customStoryType: "",
    length: "medium",
    setting: "magical_forest",
    customSetting: "",
    moral: "friendship",
    customMoral: "",
    mood: "happy",
    theme: "sparkle",
    characters: [] as string[],
    customCharacters: "",
    includeQuiz: true
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    loadKids(JSON.parse(userData).id)
  }, [router])

  const loadKids = async (userId: string) => {
    try {
      const response = await fetch(`/api/kids?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setKids(data || [])
        
        if (!preselectedKidId && data.length > 0) {
          setFormData(prev => ({ ...prev, kidId: data[0].id }))
        }
      }
    } catch (error) {
      console.error("Failed to load kids:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.kidId) {
      toast.error("একটি kid profile select করুন")
      return
    }

    setGenerating(true)

    try {
      const selectedKid = kids.find(k => k.id === formData.kidId)
      
      // Prepare story type (use custom if "custom" selected)
      const finalStoryType = formData.storyType === 'custom' 
        ? formData.customStoryType 
        : formData.storyType

      const finalSetting = formData.setting === 'custom'
        ? formData.customSetting
        : formData.setting

      const finalMoral = formData.moral === 'custom'
        ? formData.customMoral
        : formData.moral

      // Combine selected characters with custom characters
      let allCharacters = [...formData.characters]
      if (formData.customCharacters.trim()) {
        allCharacters.push(...formData.customCharacters.split(',').map(c => c.trim()))
      }

      const response = await fetch("/api/stories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          kidId: formData.kidId,
          kidName: selectedKid?.name,
          gender: selectedKid?.gender,
          age: selectedKid?.age,
          title: formData.title,
          language: formData.language,
          storyType: finalStoryType,
          length: formData.length,
          setting: finalSetting,
          moral: finalMoral,
          mood: formData.mood,
          theme: formData.theme,
          characters: allCharacters,
          includeQuiz: formData.includeQuiz
        }),
      })

      let data
      const text = await response.text()
      
      try {
        data = text ? JSON.parse(text) : null
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        throw new Error("Server returned invalid response")
      }

      if (!response.ok) {
        throw new Error(data?.error || "Story generation failed")
      }

      if (!data?.story?.id) {
        throw new Error("Invalid story data received")
      }

      toast.success("গল্প তৈরি হয়েছে! 🎉")
      
      setTimeout(() => {
        router.push(`/story/${data.story.id}`)
      }, 1500)

    } catch (error: any) {
      console.error("Story generation error:", error)
      toast.error(error.message || "কিছু ভুল হয়েছে")
    } finally {
      setGenerating(false)
    }
  }

  // Toggle character selection
  const toggleCharacter = (char: string) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.includes(char)
        ? prev.characters.filter(c => c !== char)
        : [...prev.characters, char]
    }))
  }

  // Story Types with Bengali labels
  const storyTypes = [
    { id: "adventure", emoji: "🗺️", label: "Adventure", labelBn: "অ্যাডভেঞ্চার", desc: "রোমাঞ্চকর অভিযান" },
    { id: "fairytale", emoji: "🧚", label: "Fairy Tale", labelBn: "রূপকথা", desc: "জাদুর রাজ্যের গল্প" },
    { id: "superhero", emoji: "🦸", label: "Superhero", labelBn: "সুপারহিরো", desc: "বীরত্বের গল্প" },
    { id: "cartoon", emoji: "🎬", label: "Cartoon Style", labelBn: "কার্টুন স্টাইল", desc: "মজার কার্টুন গল্প" },
    { id: "animal", emoji: "🦁", label: "Animal Story", labelBn: "পশু-পাখির গল্প", desc: "জীবজন্তুর কথা" },
    { id: "educational", emoji: "📚", label: "Educational", labelBn: "শিক্ষামূলক", desc: "শেখার গল্প" },
    { id: "bedtime", emoji: "🌙", label: "Bedtime", labelBn: "ঘুমপাড়ানি", desc: "মিষ্টি ঘুমের গল্প" },
    { id: "funny", emoji: "😄", label: "Comedy", labelBn: "হাসির গল্প", desc: "মজার হাসির গল্প" },
    { id: "mystery", emoji: "🔍", label: "Mystery", labelBn: "রহস্য", desc: "রহস্যময় গল্প" },
    { id: "friendship", emoji: "🤝", label: "Friendship", labelBn: "বন্ধুত্বের গল্প", desc: "বন্ধুদের গল্প" },
    { id: "fantasy", emoji: "✨", label: "Fantasy", labelBn: "কল্পনা", desc: "কল্পনার রাজ্য" },
    { id: "custom", emoji: "✏️", label: "Custom", labelBn: "নিজের মতো", desc: "আপনার পছন্দমতো" }
  ]

  // Settings/Locations
  const settings = [
    { id: "magical_forest", emoji: "🌲", label: "Magical Forest", labelBn: "জাদুর বন" },
    { id: "underwater", emoji: "🌊", label: "Underwater", labelBn: "সমুদ্রের নিচে" },
    { id: "space", emoji: "🚀", label: "Space", labelBn: "মহাকাশ" },
    { id: "kingdom", emoji: "🏰", label: "Kingdom", labelBn: "রাজ্য/দুর্গ" },
    { id: "village", emoji: "🏘️", label: "Village", labelBn: "গ্রাম" },
    { id: "city", emoji: "🌆", label: "City", labelBn: "শহর" },
    { id: "school", emoji: "🏫", label: "School", labelBn: "স্কুল" },
    { id: "playground", emoji: "🎠", label: "Playground", labelBn: "খেলার মাঠ" },
    { id: "mountain", emoji: "🏔️", label: "Mountain", labelBn: "পাহাড়" },
    { id: "jungle", emoji: "🌴", label: "Jungle", labelBn: "জঙ্গল" },
    { id: "home", emoji: "🏠", label: "Home", labelBn: "বাড়ি" },
    { id: "custom", emoji: "✏️", label: "Custom", labelBn: "নিজের মতো" }
  ]

  // Morals/Lessons
  const morals = [
    { id: "friendship", emoji: "🤝", label: "Friendship", labelBn: "বন্ধুত্ব" },
    { id: "honesty", emoji: "💎", label: "Honesty", labelBn: "সততা" },
    { id: "courage", emoji: "💪", label: "Courage", labelBn: "সাহস" },
    { id: "kindness", emoji: "❤️", label: "Kindness", labelBn: "দয়া" },
    { id: "sharing", emoji: "🎁", label: "Sharing", labelBn: "ভাগাভাগি" },
    { id: "respect", emoji: "🙏", label: "Respect", labelBn: "সম্মান" },
    { id: "hardwork", emoji: "📖", label: "Hard Work", labelBn: "পরিশ্রম" },
    { id: "patience", emoji: "⏳", label: "Patience", labelBn: "ধৈর্য" },
    { id: "teamwork", emoji: "👥", label: "Teamwork", labelBn: "দলবদ্ধতা" },
    { id: "gratitude", emoji: "🙌", label: "Gratitude", labelBn: "কৃতজ্ঞতা" },
    { id: "environment", emoji: "🌍", label: "Environment", labelBn: "পরিবেশ রক্ষা" },
    { id: "custom", emoji: "✏️", label: "Custom", labelBn: "নিজের মতো" }
  ]

  // Popular Characters
  const popularCharacters = [
    { id: "doraemon", emoji: "🤖", label: "Doraemon Style" },
    { id: "pokemon", emoji: "⚡", label: "Pokemon Style" },
    { id: "princess", emoji: "👸", label: "Princess" },
    { id: "prince", emoji: "🤴", label: "Prince" },
    { id: "wizard", emoji: "🧙", label: "Wizard/জাদুকর" },
    { id: "fairy", emoji: "🧚", label: "Fairy/পরী" },
    { id: "dragon", emoji: "🐉", label: "Dragon/ড্রাগন" },
    { id: "robot", emoji: "🤖", label: "Robot" },
    { id: "dinosaur", emoji: "🦖", label: "Dinosaur" },
    { id: "unicorn", emoji: "🦄", label: "Unicorn" },
    { id: "mermaid", emoji: "🧜", label: "Mermaid" },
    { id: "pirate", emoji: "🏴‍☠️", label: "Pirate" },
    { id: "astronaut", emoji: "👨‍🚀", label: "Astronaut" },
    { id: "detective", emoji: "🕵️", label: "Detective" },
    { id: "talking_animals", emoji: "🦊", label: "Talking Animals" }
  ]

  // Moods
  const moods = [
    { id: "happy", emoji: "😊", label: "Happy", labelBn: "খুশি" },
    { id: "exciting", emoji: "🤩", label: "Exciting", labelBn: "উত্তেজনাকর" },
    { id: "calm", emoji: "😌", label: "Calm", labelBn: "শান্ত" },
    { id: "funny", emoji: "😄", label: "Funny", labelBn: "মজার" },
    { id: "magical", emoji: "✨", label: "Magical", labelBn: "জাদুময়" },
    { id: "mysterious", emoji: "🌙", label: "Mysterious", labelBn: "রহস্যময়" }
  ]

  // Themes for book display
  const themes = [
    { id: "sparkle", emoji: "✨" },
    { id: "rainbow", emoji: "🌈" },
    { id: "ocean", emoji: "🌊" },
    { id: "forest", emoji: "🌲" },
    { id: "candy", emoji: "🍭" },
    { id: "space", emoji: "🚀" },
    { id: "hearts", emoji: "💕" },
    { id: "butterfly", emoji: "🦋" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-6xl animate-bounce">📚</div>
      </div>
    )
  }

  if (kids.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="text-2xl font-bold mb-2">No Kids Profile Found</h2>
            <p className="text-gray-600 mb-6">গল্প তৈরি করার আগে একটি kids profile যোগ করুন</p>
            <Link href="/dashboard/kids">
              <Button>Add Kids Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            Create Story
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Select Kid */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                👶 কার জন্য গল্প? *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {kids.map((kid) => (
                  <div
                    key={kid.id}
                    onClick={() => setFormData({ ...formData, kidId: kid.id })}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.kidId === kid.id
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-3xl mb-2 text-center">
                      {kid.gender === "boy" ? "👦" : kid.gender === "girl" ? "👧" : "👶"}
                    </div>
                    <div className="font-semibold text-center">{kid.name}</div>
                    <div className="text-sm text-gray-500 text-center">{kid.age} বছর</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🌐 ভাষা *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, language: "bengali" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.language === "bengali"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="text-2xl mb-1">🇧🇩</div>
                  <div className="font-semibold">বাংলা</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, language: "english" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.language === "english"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="text-2xl mb-1">🇬🇧</div>
                  <div className="font-semibold">English</div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Story Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">📖 গল্পের ধরন *</CardTitle>
              <CardDescription>কি ধরনের গল্প চান?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {storyTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, storyType: type.id })}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.storyType === type.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-xl mb-1">{type.emoji}</div>
                    <div className="font-medium text-sm">{type.labelBn}</div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
              
              {/* Custom Story Type Input */}
              {formData.storyType === 'custom' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.customStoryType}
                    onChange={(e) => setFormData({ ...formData, customStoryType: e.target.value })}
                    placeholder="যেমন: ডাইনোসরের সাথে বন্ধুত্ব, মহাকাশ যাত্রা, জাদুর বাক্স..."
                    className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none bg-purple-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 আপনার পছন্দমতো গল্পের ধরন লিখুন
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Story Length */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">📏 গল্পের দৈর্ঘ্য *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "short", label: "ছোট", desc: "৩-৫ মিনিট", emoji: "📄" },
                  { id: "medium", label: "মাঝারি", desc: "৫-৮ মিনিট", emoji: "📑" },
                  { id: "long", label: "বড়", desc: "১০-১৫ মিনিট", emoji: "📚" }
                ].map((len) => (
                  <button
                    key={len.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, length: len.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.length === len.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{len.emoji}</div>
                    <div className="font-semibold">{len.label}</div>
                    <div className="text-xs text-gray-500">{len.desc}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Setting/Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🗺️ গল্পের পটভূমি *</CardTitle>
              <CardDescription>গল্প কোথায় ঘটবে?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {settings.map((setting) => (
                  <button
                    key={setting.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, setting: setting.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.setting === setting.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-xl mb-1">{setting.emoji}</div>
                    <div className="text-sm font-medium">{setting.labelBn}</div>
                  </button>
                ))}
              </div>
              
              {/* Custom Setting Input */}
              {formData.setting === 'custom' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.customSetting}
                    onChange={(e) => setFormData({ ...formData, customSetting: e.target.value })}
                    placeholder="যেমন: চিড়িয়াখানা, হাসপাতাল, রেলস্টেশন, বাজার..."
                    className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none bg-purple-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 আপনার পছন্দের জায়গা লিখুন
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Moral/Lesson */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">💡 শিক্ষা/নৈতিকতা *</CardTitle>
              <CardDescription>গল্প থেকে কী শিখবে?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {morals.map((moral) => (
                  <button
                    key={moral.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, moral: moral.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.moral === moral.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-xl mb-1">{moral.emoji}</div>
                    <div className="text-sm font-medium">{moral.labelBn}</div>
                  </button>
                ))}
              </div>
              
              {/* Custom Moral Input */}
              {formData.moral === 'custom' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.customMoral}
                    onChange={(e) => setFormData({ ...formData, customMoral: e.target.value })}
                    placeholder="যেমন: বই পড়ার গুরুত্ব, মিথ্যা না বলা, বড়দের কথা শোনা..."
                    className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none bg-purple-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 আপনার পছন্দের শিক্ষা লিখুন
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🎭 গল্পের মেজাজ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: mood.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.mood === mood.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.labelBn}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-center gap-2 py-3 text-purple-600 hover:text-purple-800 transition"
          >
            {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            <span className="font-medium">
              {showAdvanced ? "কম অপশন দেখুন" : "🎨 আরও অপশন দেখুন"}
            </span>
          </button>

          {showAdvanced && (
            <>
              {/* Characters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">🎭 বিশেষ চরিত্র (Optional)</CardTitle>
                  <CardDescription>গল্পে কোন চরিত্র থাকুক?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {popularCharacters.map((char) => (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => toggleCharacter(char.id)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.characters.includes(char.id)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="text-xl mb-1">{char.emoji}</div>
                        <div className="text-xs font-medium">{char.label}</div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Characters Input */}
                  <div>
                    <input
                      type="text"
                      value={formData.customCharacters}
                      onChange={(e) => setFormData({ ...formData, customCharacters: e.target.value })}
                      placeholder="অন্য চরিত্র লিখুন (কমা দিয়ে আলাদা করুন): যেমন: বাঘ, শিয়াল, খরগোশ"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Custom Title */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">✏️ গল্পের নাম (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="খালি রাখলে AI নিজে নাম দেবে"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </CardContent>
              </Card>

              {/* Book Theme */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">🎨 Book Theme</CardTitle>
                  <CardDescription>গল্পের বই কেমন দেখাবে?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: theme.id })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.theme === theme.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="text-2xl">{theme.emoji}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Quiz Option */}
          <Card>
            <CardContent className="py-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold">🧠 গল্পের শেষে কুইজ</span>
                  <p className="text-sm text-gray-500">বাচ্চা গল্প থেকে কতটুকু শিখেছে জানতে</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.includeQuiz}
                  onChange={(e) => setFormData({ ...formData, includeQuiz: e.target.checked })}
                  className="w-6 h-6 accent-purple-500 rounded"
                />
              </label>
            </CardContent>
          </Card>

          {/* Submit Button - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={generating || !formData.kidId}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    গল্প তৈরি হচ্ছে... (৩০ সেকেন্ড)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    ✨ AI দিয়ে গল্প তৈরি করুন
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}