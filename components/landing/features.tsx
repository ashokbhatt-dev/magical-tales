// components/landing/features.tsx
"use client"

import { motion } from "framer-motion"
import { Sparkles, Wand2, BookOpen, Share2, Brain, Palette, Globe, Clock, Shield, Heart, Zap, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Stories",
    titleBn: "AI দিয়ে তৈরি",
    description: "Google Gemini AI ব্যবহার করে আপনার বাচ্চার জন্য unique গল্প তৈরি হয়",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Palette,
    title: "11 Animated Themes",
    titleBn: "১১টি Animated থিম",
    description: "Sparkle, Bubbles, Rainbow, Hearts, Forest, Ocean, Candy, Butterfly, Space, Starry, Classic",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: BookOpen,
    title: "Personalized Content",
    titleBn: "ব্যক্তিগত গল্প",
    description: "বাচ্চার নাম, বয়স, পছন্দ অনুযায়ী customize করা গল্প",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Brain,
    title: "Educational",
    titleBn: "শিক্ষামূলক",
    description: "প্রতিটি গল্পে moral lesson এবং interactive quiz",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Globe,
    title: "Bengali & English",
    titleBn: "বাংলা ও ইংরেজি",
    description: "দুই ভাষাতেই গল্প তৈরি করা যায়",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    titleBn: "সহজে শেয়ার",
    description: "WhatsApp, Facebook, Twitter এ গল্প share করুন",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Clock,
    title: "Auto-Play Mode",
    titleBn: "অটো-প্লে মোড",
    description: "Automatic page turning এবং adjustable speed",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "100% Safe",
    titleBn: "১০০% নিরাপদ",
    description: "শিশুদের জন্য সম্পূর্ণ নিরাপদ এবং age-appropriate content",
    gradient: "from-teal-500 to-green-500"
  },
  {
    icon: Zap,
    title: "Instant Generation",
    titleBn: "তাৎক্ষণিক",
    description: "মাত্র 30 সেকেন্ডে নতুন গল্প তৈরি",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Heart,
    title: "Save Favorites",
    titleBn: "পছন্দের তালিকা",
    description: "Bookmark এবং favorite stories save করুন",
    gradient: "from-red-500 to-pink-500"
  },
  {
    icon: Star,
    title: "Progress Tracking",
    titleBn: "পড়ার হিসাব",
    description: "কতটুকু পড়া হয়েছে track করুন",
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    icon: Sparkles,
    title: "Beautiful Animations",
    titleBn: "সুন্দর Animation",
    description: "Page transitions এবং interactive elements",
    gradient: "from-cyan-500 to-blue-500"
  }
]

export function Features() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            কেন <span className="text-gradient">Magical Tales</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            আধুনিক technology এবং শিক্ষামূলক content এর perfect combination
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.titleBn}</h3>
                  <p className="text-sm text-gray-500 mb-2">{feature.title}</p>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "500+", label: "খুশি পরিবার", icon: "👨‍👩‍👧‍👦" },
            { number: "2000+", label: "গল্প তৈরি", icon: "📚" },
            { number: "11", label: "Animated থিম", icon: "🎨" },
            { number: "4.9/5", label: "Rating", icon: "⭐" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}