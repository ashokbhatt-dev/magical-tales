// components/landing/how-it-works.tsx
"use client"

import { motion } from "framer-motion"
import { UserPlus, Wand2, BookOpen, Share2, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    number: "১",
    title: "Sign Up করুন",
    description: "আপনার email দিয়ে account তৈরি করুন এবং বাচ্চার profile add করুন",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Wand2,
    number: "২",
    title: "Story Customize করুন",
    description: "বাচ্চার নাম, বয়স, পছন্দ অনুযায়ী story parameters select করুন",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BookOpen,
    number: "৩",
    title: "AI Magic দেখুন",
    description: "মাত্র 30 সেকেন্ডে AI একটি unique, personalized story তৈরি করবে",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Share2,
    number: "৪",
    title: "পড়ুন এবং Share করুন",
    description: "Beautiful animated book format এ পড়ুন এবং family/friends এর সাথে share করুন",
    color: "from-green-500 to-emerald-500"
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
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
            <Wand2 className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            মাত্র <span className="text-gradient">৪টি সহজ ধাপে</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            কোনো technical knowledge ছাড়াই আপনার বাচ্চার জন্য গল্প তৈরি করুন
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 h-full">
                  {/* Number Badge */}
                  <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            এখনই শুরু করুন এবং আপনার বাচ্চাকে পড়ার প্রতি আগ্রহী করে তুলুন!
          </p>
          <a href="/signup" className="inline-block">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105">
              বিনামূল্যে শুরু করুন 🚀
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}