// components/landing/pricing.tsx
"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

const plans = [
  {
    name: "Monthly",
    nameBn: "মাসিক",
    price: 499,
    period: "/মাস",
    description: "নতুনদের জন্য perfect",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "১০টি গল্প প্রতি মাসে",
      "সব ১১টি animated themes",
      "Quiz system",
      "Social sharing",
      "Progress tracking",
      "১টি বাচ্চার profile"
    ],
    popular: false
  },
  {
    name: "Yearly",
    nameBn: "বার্ষিক",
    price: 4999,
    originalPrice: 5988,
    period: "/বছর",
    description: "সবচেয়ে জনপ্রিয়!",
    icon: Crown,
    gradient: "from-purple-500 to-pink-500",
    badge: "17% সাশ্রয়",
    features: [
      "Unlimited গল্প",
      "সব ১১টি animated themes",
      "Quiz system",
      "Social sharing",
      "Progress tracking",
      "৩টি বাচ্চার profile",
      "Priority support",
      "Early access to new features"
    ],
    popular: true
  },
  {
    name: "Lifetime",
    nameBn: "লাইফটাইম",
    price: 9999,
    period: "একবার",
    description: "Best value!",
    icon: Sparkles,
    gradient: "from-orange-500 to-red-500",
    badge: "সবচেয়ে সাশ্রয়ী",
    features: [
      "Unlimited গল্প চিরকালের জন্য",
      "সব ১১টি animated themes",
      "Quiz system",
      "Social sharing",
      "Progress tracking",
      "Unlimited বাচ্চার profile",
      "Premium support",
      "All future updates FREE",
      "No renewal needed"
    ],
    popular: false
  }
]

export function Pricing() {
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
            <Crown className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            সাশ্রয়ী মূল্যে <span className="text-gradient">Premium Quality</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            আপনার বাজেট অনুযায়ী plan বেছে নিন
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    🔥 Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full ${plan.popular ? 'border-4 border-purple-300 shadow-2xl scale-105' : 'border-2'} hover:shadow-xl transition-all duration-300`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {plan.badge && (
                    <div className="inline-block mb-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <CardTitle className="text-2xl">{plan.nameBn}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold">৳{plan.price}</span>
                      <span className="text-gray-500 ml-2">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-gray-400 line-through text-sm mt-1">
                        ৳{plan.originalPrice}/বছর
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup" className="block">
                    <Button
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`}
                      size="lg"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      শুরু করুন
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-full px-6 py-3">
            <span className="text-3xl">✅</span>
            <div className="text-left">
              <div className="font-bold text-green-700">7-দিনের Money Back Guarantee</div>
              <div className="text-sm text-green-600">সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}