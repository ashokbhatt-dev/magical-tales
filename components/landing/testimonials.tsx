// components/landing/testimonials.tsx
"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "আয়েশা খানম",
    role: "মা, ঢাকা",
    image: "👩",
    rating: 5,
    text: "আমার ৫ বছরের মেয়ে এখন প্রতিদিন নতুন গল্প পড়তে চায়! AI দিয়ে তার নামে গল্প হওয়ায় সে অনেক excited থাকে। দারুণ একটা platform!",
    highlight: "মেয়ে প্রতিদিন নতুন গল্প চায়!"
  },
  {
    name: "রাফি আহমেদ",
    role: "বাবা, চট্টগ্রাম",
    image: "👨",
    rating: 5,
    text: "বাচ্চাকে ঘুমানোর সময় গল্প বলতে হতো, এখন Magical Tales এর animated stories দেখিয়ে দিলেই হয়। Quiz feature টাও educational, মজা করে করে শিখছে।",
    highlight: "Educational এবং entertaining!"
  },
  {
    name: "তাসনিম রহমান",
    role: "মা, সিলেট",
    image: "👩‍🦱",
    rating: 5,
    text: "Bengali ভাষায় এত সুন্দর interactive storybook পেয়ে অবাক হয়েছি। 11টা theme এর প্রতিটাই অসাধারণ। আমার দুই বাচ্চার favorite হয়ে গেছে!",
    highlight: "11টা theme সবই অসাধারণ!"
  },
  {
    name: "কামাল হোসেন",
    role: "বাবা, রাজশাহী",
    image: "👨‍💼",
    rating: 5,
    text: "প্রথমে ভেবেছিলাম expensive হবে, কিন্তু yearly plan টা অনেক সাশ্রয়ী। প্রতি সপ্তাহে 2-3টা নতুন গল্প তৈরি করি, বাচ্চার খুব পছন্দ।",
    highlight: "সাশ্রয়ী মূল্যে premium quality!"
  },
  {
    name: "সাবিনা আক্তার",
    role: "মা, খুলনা",
    image: "👩‍⚕️",
    rating: 5,
    text: "Share feature টা দারুণ! আমার তৈরি করা গল্প relatives দের সাথে share করি। সবাই impressed হয়। Moral lessons গুলোও খুব ভালো।",
    highlight: "Share করে সবাই impressed!"
  },
  {
    name: "ফারহান ইসলাম",
    role: "বাবা, বরিশাল",
    image: "👨‍🏫",
    rating: 5,
    text: "আমি teacher, তাই জানি কিভাবে বাচ্চাদের engage করতে হয়। Magical Tales এ সেটা perfectly করা হয়েছে। Animations এবং personalization excellent!",
    highlight: "Perfect engagement for kids!"
  }
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
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
            <Quote className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            পিতামাতারা কি <span className="text-gradient">বলছেন</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            500+ খুশি পরিবারের মতামত
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-purple-200 mb-4" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Highlight */}
                  <div className="bg-purple-50 border-l-4 border-purple-500 px-4 py-2 mb-4 rounded">
                    <p className="text-sm font-semibold text-purple-900">
                      "{testimonial.highlight}"
                    </p>
                  </div>

                  {/* Text */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {testimonial.text}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl px-8 py-6">
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">4.9/5.0</div>
              <div className="text-gray-600">500+ reviews থেকে average rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}