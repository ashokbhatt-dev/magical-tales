// types/index.ts

// User Types
export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  plan: 'free' | 'monthly' | 'yearly' | 'lifetime'
  subscriptionStatus: 'active' | 'expired' | 'cancelled'
  subscriptionDate?: Date
  expiryDate?: Date
  createdAt: Date
}

// Kid Profile Types
export interface KidProfile {
  id: string
  userId: string
  name: string
  gender: 'boy' | 'girl' | 'other'
  age: number
  interests?: string[]
  photoUrl?: string
  createdAt: Date
}

// Story Types
export interface Story {
  id: string
  userId: string
  kidId: string
  title: string
  language: 'bengali' | 'english'
  storyType: StoryType
  theme: BookTheme
  length: StoryLength
  pages: StoryPage[]
  quiz?: Quiz
  settings: StorySettings
  isPublic: boolean
  shareLink?: string
  shareCount: number
  viewCount: number
  isFavorite: boolean
  createdAt: Date
  lastRead?: Date
}

export type StoryType = 
  | 'adventure'
  | 'fairytale'
  | 'educational'
  | 'bedtime'
  | 'moral'
  | 'fantasy'
  | 'reallife'

export type BookTheme = 
  | 'sparkle'
  | 'bubbles'
  | 'rainbow'
  | 'starry'
  | 'hearts'
  | 'forest'
  | 'ocean'
  | 'candy'
  | 'butterfly'
  | 'space'
  | 'classic'

export type StoryLength = 'short' | 'medium' | 'long'

export interface StoryPage {
  pageNumber: number
  chapter: string
  title: string
  text: string
  illustrationBg: IllustrationBg
  emojis: string[]
  scene: Scene
}

export type IllustrationBg = 
  | 'forest'
  | 'night'
  | 'sunset'
  | 'magical'
  | 'water'
  | 'golden'

export type Scene = 
  | 'night'
  | 'forest'
  | 'water'
  | 'magical'
  | 'sunset'

export interface Quiz {
  enabled: boolean
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export interface StorySettings {
  fontSize: number
  autoplaySpeed: number
  backgroundTheme: 'night' | 'forest' | 'sunset' | 'water'
  bookTheme: BookTheme
}

// Story Creation Form Types
export interface StoryCreationParams {
  kidId: string
  kidName: string
  gender: 'boy' | 'girl' | 'other'
  age: number
  title?: string
  language: 'bengali' | 'english'
  storyType: StoryType
  length: StoryLength
  setting: string
  mainCharacterTraits: string[]
  supportingCharacters?: string[]
  moral?: string
  mood: 'happy' | 'calm' | 'exciting' | 'thoughtful'
  theme: BookTheme
  includeQuiz: boolean
  includePhoto: boolean
}

// Payment Types
export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  plan: 'monthly' | 'yearly' | 'lifetime'
  paymentMethod: string
  transactionId: string
  status: 'success' | 'failed' | 'pending'
  createdAt: Date
}

// Share Types
export interface Share {
  id: string
  storyId: string
  userId: string
  shareToken: string
  shareUrl: string
  views: number
  createdAt: Date
}