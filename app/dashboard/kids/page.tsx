// app/dashboard/kids/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

interface Kid {
  id: string
  name: string
  gender: string
  age: number
  interests: string[]
  created_at: string
}

export default function KidsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [kids, setKids] = useState<Kid[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    gender: "boy",
    age: 5,
    interests: [] as string[]
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
        // ✅ Fixed: data is already an array
        setKids(data || [])
      }
    } catch (error) {
      console.error("Failed to load kids:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.age) {
      toast.error("নাম এবং বয়স দিতে হবে")
      return
    }

    try {
      const response = await fetch("/api/kids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      })

      if (response.ok) {
        toast.success("Profile তৈরি হয়েছে! 🎉")
        setShowForm(false)
        setFormData({ name: "", gender: "boy", age: 5, interests: [] })
        loadKids(user.id)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "কিছু ভুল হয়েছে")
      }
    } catch (error) {
      toast.error("কিছু ভুল হয়েছে")
    }
  }

  const handleDelete = async (kidId: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return

    try {
      const response = await fetch(`/api/kids?id=${kidId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Profile delete হয়েছে")
        loadKids(user.id)
      }
    } catch (error) {
      toast.error("কিছু ভুল হয়েছে")
    }
  }

  const interestOptions = [
    "🦁 Animals",
    "🚀 Space",
    "🏰 Fairy Tales",
    "🌊 Ocean",
    "🌲 Nature",
    "🎨 Art",
    "⚽ Sports",
    "🎵 Music"
  ]

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce">👶</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-xl font-bold">Kids Profile Management</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Add New Kid Button */}
        {!showForm && (
          <div className="mb-8">
            <Button onClick={() => setShowForm(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              নতুন Kids Profile যোগ করুন
            </Button>
          </div>
        )}

        {/* Add Kid Form */}
        {showForm && (
          <Card className="mb-8 border-2 border-purple-200">
            <CardHeader>
              <CardTitle>নতুন Kids Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      বাচ্চার নাম *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="রিমা, রাফি, etc."
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      লিঙ্গ *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="boy">Boy (ছেলে)</option>
                      <option value="girl">Girl (মেয়ে)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    বয়স: {formData.age} বছর
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2 years</span>
                    <span>12 years</span>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    পছন্দ (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          formData.interests.includes(interest)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button type="submit">
                    Save Profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({ name: "", gender: "boy", age: 5, interests: [] })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Kids List */}
        {kids.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">👶</div>
              <p className="text-gray-500 mb-4">
                এখনও কোনো kids profile নেই
              </p>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  প্রথম Profile যোগ করুন
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kids.map((kid) => (
              <Card key={kid.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    {kid.gender === "boy" ? "👦" : kid.gender === "girl" ? "👧" : "👶"}
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-center mb-1">
                    {kid.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center mb-4">
                    {kid.age} years old • {kid.gender === "boy" ? "Boy" : kid.gender === "girl" ? "Girl" : "Other"}
                  </p>

                  {/* Interests */}
                  {kid.interests && kid.interests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {kid.interests.map((interest, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/create?kidId=${kid.id}`)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create Story
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(kid.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}