// components/landing/hero.tsx
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, BookOpen, Wand2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating stars - Only render on client */}
      {mounted && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-2xl"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              AI-Powered Personalized Stories
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">জাদুকরী গল্পের জগত</span>
            <span className="text-gradient block mt-2">Magical Tales</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            আপনার বাচ্চার জন্য AI দিয়ে তৈরি ব্যক্তিগত গল্প। 
            প্রতিটি গল্প অনন্য, শিক্ষামূলক এবং মজাদার!
          </p>

          {/* Features list */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              "🎨 ১১টি Animated থিম",
              "🤖 AI-Powered",
              "📱 সব Device এ",
              "🎯 Personalized",
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm"
              >
                {feature}
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="group">
                <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span>শুরু করুন - ৳৪৯৯/মাস</span>
              </Button>
            </Link>
            
            <Link href="#demo">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>ডেমো দেখুন</span>
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              <span>৫০০+ খুশি পরিবার</span>
            </div>
            <div>✅ No Credit Card Required</div>
            <div>🔒 100% Safe & Secure</div>
          </motion.div>
        </motion.div>

        {/* Floating book animation */}
        <motion.div
          className="absolute bottom-10 right-10 text-8xl hidden lg:block"
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          📚
        </motion.div>
      </div>
    </section>
  )
}