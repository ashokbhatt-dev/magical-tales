// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Plus, LogOut, Sparkles, User, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface RecentStory {
  id: string
  title: string
  theme: string
  created_at: string
  view_count: number
  kids_profiles: {
    name: string
    gender: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    storiesCount: 0,
    kidsCount: 0
  })
  const [recentStories, setRecentStories] = useState<RecentStory[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadDashboardData(parsedUser.id)
  }, [router])

  const loadDashboardData = async (userId: string) => {
    try {
      const response = await fetch(`/api/dashboard/stats?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentStories(data.recentStories)
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getThemeEmoji = (theme: string) => {
    const themes: any = {
      sparkle: "✨",
      bubbles: "🫧",
      rainbow: "🌈",
      hearts: "💕",
      forest: "🌿",
      ocean: "🌊",
      candy: "🍭",
      butterfly: "🦋",
      starry: "⭐",
      space: "🚀",
      classic: "📜"
    }
    return themes[theme] || "📚"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Magical Tales</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            স্বাগতম, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            আপনার জাদুকরী গল্পের জগতে আবার ফিরে এসেছেন
          </p>
        </div>

        {/* Stats Cards - NOW DYNAMIC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Stories
              </CardTitle>
              <BookOpen className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.storiesCount}</div>
              <p className="text-xs text-gray-500 mt-1">গল্প তৈরি করা হয়েছে</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Kids Profiles
              </CardTitle>
              <User className="w-5 h-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.kidsCount}</div>
              <p className="text-xs text-gray-500 mt-1">বাচ্চার profile</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Subscription
              </CardTitle>
              <Sparkles className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">{user?.plan}</div>
              <p className="text-xs text-gray-500 mt-1">Current plan</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Create Story Card */}
          <Card 
            className="border-2 border-purple-200 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
            onClick={() => router.push('/dashboard/create')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">নতুন গল্প তৈরি করুন</h3>
              <p className="text-gray-600 mb-4">
                AI দিয়ে আপনার বাচ্চার জন্য personalized গল্প তৈরি করুন
              </p>
              <Button size="lg" className="w-full">
                Create Story
              </Button>
            </CardContent>
          </Card>

          {/* Manage Kids Card */}
          <Card 
            className="border-2 border-blue-200 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50"
            onClick={() => router.push('/dashboard/kids')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Kids Profile Manage করুন</h3>
              <p className="text-gray-600 mb-4">
                বাচ্চাদের profile add করুন বা edit করুন
              </p>
              <Button size="lg" variant="outline" className="w-full">
                Manage Kids
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stories Section - NOW DYNAMIC */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recent Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentStories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-gray-500 mb-4">
                  আপনি এখনও কোনো গল্প তৈরি করেননি
                </p>
                <Button onClick={() => router.push('/dashboard/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  প্রথম গল্প তৈরি করুন
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => router.push(`/story/${story.id}`)}
                    className="p-4 border-2 rounded-xl hover:border-purple-300 hover:shadow-md transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Theme Icon */}
                        <div className="text-4xl">
                          {getThemeEmoji(story.theme)}
                        </div>
                        
                        {/* Story Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-1 truncate">
                            {story.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {story.kids_profiles?.name || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(story.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {story.view_count || 0} views
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Read Button */}
                      <Button size="sm" variant="outline">
                        Read
                      </Button>
                    </div>
                  </div>
                ))}
                
                {recentStories.length >= 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => router.push('/dashboard/stories')}>
                      View All Stories
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}