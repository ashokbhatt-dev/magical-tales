// config/site.ts
export const siteConfig = {
  name: "Magical Tales",
  nameBengali: "ম্যাজিক্যাল টেলস",
  description: "AI-powered personalized storybook for kids",
  descriptionBengali: "বাচ্চাদের জন্য AI দিয়ে তৈরি ব্যক্তিগত গল্পের বই",
  url: "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    facebook: "https://facebook.com/magicaltales",
    instagram: "https://instagram.com/magicaltales",
    email: "hello@magicaltales.com"
  },
  pricing: {
    monthly: {
      price: 499,
      currency: "BDT",
      features: [
        "10টি গল্প প্রতি মাসে",
        "সব animated themes",
        "Quiz system",
        "Social sharing"
      ]
    },
    yearly: {
      price: 4999,
      currency: "BDT",
      discount: "17% সাশ্রয়",
      features: [
        "Unlimited গল্প",
        "সব features",
        "Priority support",
        "Early access to new features"
      ]
    },
    lifetime: {
      price: 9999,
      currency: "BDT",
      features: [
        "Lifetime access",
        "Unlimited everything",
        "All future updates",
        "Premium support"
      ]
    }
  }
}