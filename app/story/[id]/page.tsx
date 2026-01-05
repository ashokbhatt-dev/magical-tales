'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabaseClient } from '../../../lib/db/supabase'
import './book-styles.css'

interface Story {
  id: string
  title: string
  content: string
  language: string
  story_type: string
  moral: string
  mood: string
  theme: string
  setting: string
  word_count: number
  reading_time: number
  is_favorite: boolean
  created_at: string
  kid_id: string
}

interface Kid {
  id: string
  name: string
  age: number
  gender: string
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: string
  order_index: number
}

interface PageData {
  lCh: string
  lTitle: string
  lText: string
  lBg: string
  lEmoji: string[]
  rCh: string
  rTitle: string
  rText: string
  rBg: string
  rEmoji: string[]
  lP: number
  rP: number
  scene: string
}

export default function StoryReadingPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.id as string

  // State
  const [story, setStory] = useState<Story | null>(null)
  const [kid, setKid] = useState<Kid | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState<PageData[]>([])
  
  const [cur, setCur] = useState(0)
  const [mobilePage, setMobilePage] = useState<'left' | 'right'>('left')
  const [autoplay, setAutoplay] = useState(false)
  const [speed, setSpeed] = useState(8000)
  const [autoProgress, setAutoProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentBookTheme, setCurrentBookTheme] = useState('sparkle')
  const [currentBgTheme, setCurrentBgTheme] = useState('night')
  const [fontSize, setFontSizeState] = useState(15)
  const [done, setDone] = useState<Set<number>>(new Set())
  
  // Modals
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(1)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [showAchieveModal, setShowAchieveModal] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  
  // Quiz
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef(0)
  const bookRef = useRef<HTMLDivElement>(null)

  // Check if mobile
  const isMobile = useCallback(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 768
  }, [])

  // Fetch story data
  useEffect(() => {
    let isMounted = true

    async function fetchStory() {
      try {
        const supabase = getSupabaseClient()
        
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .eq('id', storyId)
          .single()

        if (storyError || !storyData) {
          console.log('Story not found:', storyError?.message)
          if (isMounted) setLoading(false)
          return
        }

        if (isMounted) {
          setStory(storyData)
          if (storyData.theme) {
            setCurrentBookTheme(storyData.theme)
          }
        }

        // Fetch kid info
        if (storyData.kid_id) {
          const { data: kidData } = await supabase
            .from('kids_profiles')
            .select('*')
            .eq('id', storyData.kid_id)
            .single()

          if (kidData && isMounted) {
            setKid(kidData)
          }
        }

        // Fetch quiz questions
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('story_id', storyId)
          .order('order_index')

        if (!quizError && quizData && quizData.length > 0 && isMounted) {
          console.log('✅ Quiz loaded:', quizData.length, 'questions')
          setQuizQuestions(quizData)
        }

        // Parse content into pages
        if (isMounted) {
          const parsedPages = parseContentToPages(storyData.content, storyData.title)
          setPages(parsedPages)
        }

      } catch (error) {
        console.log('Fetch error:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (storyId) {
      fetchStory()
    }

    return () => {
      isMounted = false
    }
  }, [storyId])

  // Parse story content into pages
  function parseContentToPages(content: string, title: string): PageData[] {
    // Clean content
    let cleanContent = content
      .replace(/,?\s*"moral_lesson"\s*:\s*"[^"]*"\s*/gi, '')
      .replace(/,?\s*"quiz"\s*:\s*\[[\s\S]*?\]\s*/gi, '')
      .replace(/\s*}\s*$/g, '')
      .replace(/^\s*\{\s*"title"\s*:\s*"[^"]*"\s*,?\s*"content"\s*:\s*"/gi, '')
      .replace(/\\n\\n/g, '\n\n')
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/"\s*$/g, '')
      .trim()

    // Split by double newlines
    let paragraphs = cleanContent
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 20)

    // Merge small paragraphs
    const mergedParagraphs: string[] = []
    let currentPara = ''
    
    for (const para of paragraphs) {
      if (currentPara.length + para.length < 350) {
        currentPara = currentPara ? `${currentPara}\n\n${para}` : para
      } else {
        if (currentPara) mergedParagraphs.push(currentPara)
        currentPara = para
      }
    }
    if (currentPara) mergedParagraphs.push(currentPara)

    const pagesData: PageData[] = []
    
    const backgrounds = ['forest', 'night', 'sunset', 'magical', 'water', 'golden']
    const scenes = ['night', 'forest', 'water', 'magical', 'sunset']
    const emojis = [
      ['🌲', '🏠', '✨'], ['✨', '🌟', '💫'], ['🦊', '🐰', '🌳'],
      ['🗺️', '🧭', '🎒'], ['🌊', '💧', '🐟'], ['🍃', '🛶', '🎉'],
      ['🧚', '✨', '🌳'], ['❤️', '🤝', '💪'], ['🌸', '💐', '🌺'],
      ['🌙', '⭐', '💫']
    ]

    for (let i = 0; i < mergedParagraphs.length; i += 2) {
      const leftPara = mergedParagraphs[i] || ''
      const rightPara = mergedParagraphs[i + 1] || ''
      const pageIndex = Math.floor(i / 2)
      
      pagesData.push({
        lCh: pageIndex === 0 ? title : `পৃষ্ঠা ${pageIndex * 2 + 1}`,
        lTitle: '',
        lText: leftPara,
        lBg: backgrounds[pageIndex % backgrounds.length],
        lEmoji: emojis[pageIndex % emojis.length],
        rCh: `পৃষ্ঠা ${pageIndex * 2 + 2}`,
        rTitle: '',
        rText: rightPara,
        rBg: backgrounds[(pageIndex + 1) % backgrounds.length],
        rEmoji: emojis[(pageIndex + 1) % emojis.length],
        lP: pageIndex * 2 + 1,
        rP: pageIndex * 2 + 2,
        scene: scenes[pageIndex % scenes.length]
      })
    }

    if (pagesData.length === 0) {
      return [{
        lCh: title,
        lTitle: '',
        lText: cleanContent || content,
        lBg: 'forest',
        lEmoji: ['📚', '✨', '🌟'],
        rCh: 'সমাপ্ত',
        rTitle: '',
        rText: 'গল্প শেষ! আশা করি ভালো লেগেছে! 🌟',
        rBg: 'magical',
        rEmoji: ['🎉', '💫', '❤️'],
        lP: 1,
        rP: 2,
        scene: 'night'
      }]
    }

    return pagesData
  }

  // Check onboarding
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      const visited = localStorage.getItem('magicalTalesVisited')
      if (!visited) {
        setTimeout(() => setShowOnboarding(true), 500)
      }
    }
  }, [loading])

  // Get current page index
  const getCurrentPageIndex = useCallback(() => {
    if (isMobile()) return cur * 2 + (mobilePage === 'right' ? 1 : 0)
    return cur
  }, [cur, mobilePage, isMobile])

  // Navigation functions
  const nextPage = useCallback(() => {
    if (isAnimating || pages.length === 0) return
    
    const total = isMobile() ? pages.length * 2 : pages.length
    const currentIdx = getCurrentPageIndex()

    if (currentIdx >= total - 1) {
      setShowCompleteModal(true)
      return
    }

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 400)

    if (isMobile()) {
      if (mobilePage === 'left') {
        setMobilePage('right')
      } else {
        setCur(prev => prev + 1)
        setMobilePage('left')
      }
    } else {
      setCur(prev => prev + 1)
    }
    
    setDone(prev => new Set([...prev, cur]))
  }, [cur, mobilePage, pages.length, isAnimating, isMobile, getCurrentPageIndex])

  const prevPage = useCallback(() => {
    if (isAnimating || pages.length === 0) return
    
    const currentIdx = getCurrentPageIndex()
    if (currentIdx <= 0) return

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 400)

    if (isMobile()) {
      if (mobilePage === 'right') {
        setMobilePage('left')
      } else if (cur > 0) {
        setCur(prev => prev - 1)
        setMobilePage('right')
      }
    } else {
      if (cur > 0) setCur(prev => prev - 1)
    }
  }, [cur, mobilePage, pages.length, isAnimating, isMobile, getCurrentPageIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return
      if (e.key === 'ArrowRight') nextPage()
      else if (e.key === 'ArrowLeft') prevPage()
      else if (e.key === ' ') { e.preventDefault(); toggleAutoplay() }
      else if (e.key === 'Escape') closePanels()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextPage, prevPage, isAnimating])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating) return
    const diff = touchStartXRef.current - e.changedTouches[0].screenX
    if (diff > 50) nextPage()
    else if (diff < -50) prevPage()
  }

  const goToPage = (pageIdx: number) => {
    if (isMobile()) {
      setCur(Math.floor(pageIdx / 2))
      setMobilePage(pageIdx % 2 === 0 ? 'left' : 'right')
    } else {
      setCur(pageIdx)
    }
    setDone(prev => new Set([...prev, Math.floor(pageIdx / 2)]))
  }

  // Autoplay
  const toggleAutoplay = useCallback(() => {
    setAutoplay(prev => !prev)
  }, [])

  useEffect(() => {
    if (autoplay && pages.length > 0) {
      setAutoProgress(0)
      autoIntervalRef.current = setInterval(() => {
        setAutoProgress(prev => {
          if (prev >= speed) {
            const total = isMobile() ? pages.length * 2 : pages.length
            if (getCurrentPageIndex() < total - 1) {
              nextPage()
            } else {
              setAutoplay(false)
            }
            return 0
          }
          return prev + 100
        })
      }, 100)
    } else {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
        autoIntervalRef.current = null
      }
      setAutoProgress(0)
    }
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current)
    }
  }, [autoplay, speed, pages.length])

  // Panel toggles
  const closePanels = () => {
    setShowSidebar(false)
    setShowSettings(false)
    setShowShareModal(false)
  }

  // Onboarding
  const nextSlide = () => currentSlide < 3 && setCurrentSlide(prev => prev + 1)
  const prevSlideHandler = () => currentSlide > 1 && setCurrentSlide(prev => prev - 1)
  const startReading = () => {
    setShowOnboarding(false)
    localStorage.setItem('magicalTalesVisited', '1')
  }

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `✨ ${story?.title || 'Magical Tales'}`
  const shareText = 'বাচ্চাদের জন্য এই সুন্দর গল্পটি পড়ুন! 📚✨'

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank')
  }
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  }
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setShowCopyToast(true)
    setTimeout(() => setShowCopyToast(false), 2000)
  }

  // Quiz
  const submitQuiz = () => {
    if (selectedAnswer === null || quizQuestions.length === 0) return
    
    const currentQuestion = quizQuestions[currentQuizIndex]
    const isCorrect = currentQuestion.options[selectedAnswer] === currentQuestion.correct_answer
    
    setQuizResult(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1)
    }

    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setQuizResult(null)
      } else {
        setShowQuizModal(false)
        setShowAchieveModal(true)
      }
    }, 1500)
  }

  const closeAchieve = () => {
    setShowAchieveModal(false)
    router.push('/dashboard')
  }

  const restartStory = () => {
    setShowAchieveModal(false)
    setCur(0)
    setMobilePage('left')
    setDone(new Set())
    setSelectedAnswer(null)
    setQuizResult(null)
    setCurrentQuizIndex(0)
    setQuizScore(0)
  }

  // Generate stars
  const generateStars = useCallback(() => {
    return [...Array(50)].map((_, i) => (
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          '--o': Math.random() * 0.5 + 0.3,
          '--d': `${Math.random() * 3 + 2}s`,
          '--dl': `${Math.random() * 3}s`
        } as React.CSSProperties}
      />
    ))
  }, [])

  // Get page dots
  const getPageDots = () => {
    const count = isMobile() ? pages.length * 2 : pages.length
    const currentIdx = getCurrentPageIndex()
    return [...Array(Math.min(count, 15))].map((_, i) => (
      <div
        key={i}
        className={`dot ${i === currentIdx ? 'active' : i < currentIdx ? 'done' : ''}`}
        onClick={() => !isAnimating && goToPage(i)}
      />
    ))
  }

  // Progress calculation
  const getProgress = () => {
    const total = isMobile() ? pages.length * 2 : pages.length
    if (total === 0) return 0
    return ((getCurrentPageIndex() + 1) / total) * 100
  }

  // Loading state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-book">📚</div>
        <p className="loading-text">গল্পের জগতে প্রবেশ করছি...</p>
      </div>
    )
  }

  // Error state
  if (!story || pages.length === 0) {
    return (
      <div className="loading-screen">
        <div className="loading-book">😔</div>
        <p className="loading-text">গল্প পাওয়া যায়নি</p>
        <button onClick={() => router.push('/dashboard')} className="onboarding-btn" style={{ marginTop: 20 }}>
          ফিরে যান
        </button>
      </div>
    )
  }

  const currentPage = pages[cur]
  const total = isMobile() ? pages.length * 2 : pages.length

  return (
    <div className="story-reader">
      {/* Onboarding */}
      {showOnboarding && (
        <div className="onboarding active">
          <div className="onboarding-container">
            <button className="skip-btn" onClick={startReading}>Skip →</button>
            
            {currentSlide === 1 && (
              <div className="onboarding-slide active">
                <div className="onboarding-mascot">📚✨</div>
                <h2 className="onboarding-title">স্বাগতম!</h2>
                <p className="onboarding-desc">
                  <strong>Magical Tales</strong> এ আপনাকে স্বাগতম! 
                  বাচ্চাদের জন্য সুন্দর animated গল্পের এক জাদুকরী বই! 🌟
                </p>
                <div className="onboarding-progress">
                  <div className="progress-dot active"></div>
                  <div className="progress-dot"></div>
                  <div className="progress-dot"></div>
                </div>
                <div className="onboarding-buttons">
                  <button className="onboarding-btn" onClick={nextSlide}>পরবর্তী →</button>
                </div>
              </div>
            )}
            
            {currentSlide === 2 && (
              <div className="onboarding-slide active">
                <div className="onboarding-icon">🎨</div>
                <h2 className="onboarding-title">দারুণ ফিচার্স!</h2>
                <p className="onboarding-desc">আমাদের বিশেষ ফিচারগুলো দেখুন:</p>
                <div className="onboarding-features">
                  <div className="onboarding-feature">
                    <div className="onboarding-feature-icon">🦋</div>
                    <div className="onboarding-feature-text">১১টি সুন্দর Animated থিম</div>
                  </div>
                  <div className="onboarding-feature">
                    <div className="onboarding-feature-icon">▶️</div>
                    <div className="onboarding-feature-text">Auto-play মোড</div>
                  </div>
                  <div className="onboarding-feature">
                    <div className="onboarding-feature-icon">🔖</div>
                    <div className="onboarding-feature-text">বুকমার্ক সেভ করুন</div>
                  </div>
                  <div className="onboarding-feature">
                    <div className="onboarding-feature-icon">🧠</div>
                    <div className="onboarding-feature-text">মজার কুইজ</div>
                  </div>
                </div>
                <div className="onboarding-progress">
                  <div className="progress-dot done"></div>
                  <div className="progress-dot active"></div>
                  <div className="progress-dot"></div>
                </div>
                <div className="onboarding-buttons">
                  <button className="onboarding-btn secondary" onClick={prevSlideHandler}>← আগের</button>
                  <button className="onboarding-btn" onClick={nextSlide}>পরবর্তী →</button>
                </div>
              </div>
            )}
            
            {currentSlide === 3 && (
              <div className="onboarding-slide active">
                <div className="onboarding-icon">👆</div>
                <h2 className="onboarding-title">কিভাবে ব্যবহার করবেন?</h2>
                <p className="onboarding-desc">খুব সহজ! দেখুন:</p>
                <div className="gesture-demo">
                  <div className="gesture-item">
                    <div className="gesture-icon">👈👉</div>
                    <div className="gesture-text">সোয়াইপ করে<br/>পৃষ্ঠা উল্টান</div>
                  </div>
                  <div className="gesture-item">
                    <div className="gesture-icon">👆</div>
                    <div className="gesture-text">তীর চিহ্নে<br/>ক্লিক করুন</div>
                  </div>
                </div>
                <div className="onboarding-progress">
                  <div className="progress-dot done"></div>
                  <div className="progress-dot done"></div>
                  <div className="progress-dot active"></div>
                </div>
                <div className="onboarding-buttons">
                  <button className="onboarding-btn secondary" onClick={prevSlideHandler}>← আগের</button>
                  <button className="onboarding-btn" onClick={startReading}>পড়া শুরু করুন ✨</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background */}
      <div className={`bg ${currentBgTheme}`}>
        <div className="stars">{generateStars()}</div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo" onClick={() => router.push('/dashboard')}>
          <div className="logo-icon">📚</div>
          <h1>{story.title.slice(0, 20)}{story.title.length > 20 ? '...' : ''}</h1>
        </div>
        <div className="header-controls">
          <button className="ctrl-btn" onClick={() => setShowSidebar(true)} title="সূচিপত্র">📑</button>
          <button 
            className={`ctrl-btn ${autoplay ? 'active' : ''}`} 
            onClick={toggleAutoplay} 
            title="Auto Play"
          >
            {autoplay ? '⏸️' : '▶️'}
          </button>
          <button className="ctrl-btn" onClick={() => setShowShareModal(true)} title="Share">📤</button>
          <button className="ctrl-btn" onClick={() => setShowSettings(true)} title="Settings">⚙️</button>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <>
          <div className="sidebar-overlay active" onClick={() => setShowSidebar(false)} />
          <aside className="sidebar active">
            <div className="sidebar-header">
              <span className="sidebar-title">📑 পৃষ্ঠা</span>
              <button className="sidebar-close" onClick={() => setShowSidebar(false)}>✕</button>
            </div>
            <div className="sidebar-content">
              <ul className="chapter-list">
                {pages.map((p, i) => (
                  <li
                    key={i}
                    className={`chapter-item ${i === cur ? 'active' : ''}`}
                    onClick={() => {
                      setCur(i)
                      setMobilePage('left')
                      setShowSidebar(false)
                    }}
                  >
                    <div className="chapter-num">{i + 1}</div>
                    <div className="chapter-name">পৃষ্ঠা {i * 2 + 1}-{i * 2 + 2}</div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </>
      )}

      {/* Settings */}
      {showSettings && (
        <>
          <div className="settings-overlay active" onClick={() => setShowSettings(false)} />
          <div className="settings active">
            <div className="sidebar-header">
              <span className="sidebar-title">⚙️ সেটিংস</span>
              <button className="sidebar-close" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="settings-content">
              <div className="setting-section">
                <div className="setting-label">🎨 Page Themes</div>
                <div className="book-themes">
                  {['sparkle', 'bubbles', 'rainbow', 'hearts', 'butterfly'].map(theme => (
                    <div
                      key={theme}
                      className={`book-theme-opt bt-${theme} ${currentBookTheme === theme ? 'active' : ''}`}
                      onClick={() => setCurrentBookTheme(theme)}
                    >
                      <span className="theme-icon">
                        {theme === 'sparkle' ? '✨' : theme === 'bubbles' ? '🫧' : theme === 'rainbow' ? '🌈' : theme === 'hearts' ? '💕' : '🦋'}
                      </span>
                      <span className="theme-name">{theme}</span>
                    </div>
                  ))}
                </div>
                <div className="book-themes">
                  {['forest', 'ocean', 'candy', 'starry', 'space'].map(theme => (
                    <div
                      key={theme}
                      className={`book-theme-opt bt-${theme} ${currentBookTheme === theme ? 'active' : ''}`}
                      onClick={() => setCurrentBookTheme(theme)}
                    >
                      <span className="theme-icon">
                        {theme === 'forest' ? '🌿' : theme === 'ocean' ? '🌊' : theme === 'candy' ? '🍭' : theme === 'starry' ? '⭐' : '🚀'}
                      </span>
                      <span className="theme-name">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-section">
                <div className="setting-label">📝 ফন্ট সাইজ</div>
                <div className="setting-row">
                  <span>টেক্সট সাইজ</span>
                  <span>{fontSize}px</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="13"
                  max="22"
                  value={fontSize}
                  onChange={(e) => setFontSizeState(Number(e.target.value))}
                />
              </div>

              <div className="setting-section">
                <div className="setting-label">⏱️ Auto-play গতি</div>
                <div className="setting-row">
                  <span>সেকেন্ড</span>
                  <span>{speed / 1000}s</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="3"
                  max="15"
                  value={speed / 1000}
                  onChange={(e) => setSpeed(Number(e.target.value) * 1000)}
                />
              </div>

              <div className="setting-section">
                <div className="setting-label">🌙 Background</div>
                <div className="themes">
                  {['night', 'forest', 'sunset', 'water'].map(theme => (
                    <div
                      key={theme}
                      className={`theme-opt t-${theme} ${currentBgTheme === theme ? 'active' : ''}`}
                      onClick={() => setCurrentBgTheme(theme)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal show">
          <div className="share-card">
            <h2 className="share-title">📤 শেয়ার করুন</h2>
            <p className="share-desc">এই সুন্দর গল্পটি বন্ধুদের সাথে শেয়ার করুন!</p>
            <div className="share-buttons">
              <button className="share-btn whatsapp" onClick={shareWhatsApp}>
                <span className="share-btn-icon">💬</span>
                WhatsApp
              </button>
              <button className="share-btn facebook" onClick={shareFacebook}>
                <span className="share-btn-icon">📘</span>
                Facebook
              </button>
              <button className="share-btn twitter" onClick={shareTwitter}>
                <span className="share-btn-icon">🐦</span>
                Twitter
              </button>
              <button className="share-btn copy" onClick={copyLink}>
                <span className="share-btn-icon">📋</span>
                Copy Link
              </button>
            </div>
            <button className="share-close" onClick={() => setShowShareModal(false)}>বন্ধ করুন</button>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      <div className={`copy-toast ${showCopyToast ? 'show' : ''}`}>✅ লিংক কপি হয়েছে!</div>

      {/* Main Reading Area */}
      <main className="main">
        <div className="reader-area">
          <button
            className="nav-arrow"
            onClick={prevPage}
            disabled={getCurrentPageIndex() === 0}
          >
            ◀
          </button>
          
          <div className="book-wrapper">
            <div
              ref={bookRef}
              className={`book theme-${currentBookTheme}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className={`bookmark ${done.has(cur) ? 'saved' : ''}`}
                onClick={() => setDone(prev => {
                  const newSet = new Set(prev)
                  if (newSet.has(cur)) newSet.delete(cur)
                  else newSet.add(cur)
                  return newSet
                })}
              >
                🔖
              </div>
              <div className="spine"></div>
              <div className="pages-container">
                {/* Left Page */}
                <div className={`page page-left ${!isMobile() || mobilePage === 'left' ? 'mobile-active' : ''}`}>
                  <div className={`page-content ${isAnimating ? 'fade-in' : ''}`}>
                    <div className="illust">
                      <div className={`illust-bg ${currentPage.lBg}`}></div>
                      <div className="illust-emojis">
                        {currentPage.lEmoji.map((e, i) => (
                          <span key={i} className="illust-emoji">{e}</span>
                        ))}
                      </div>
                    </div>
                    {cur === 0 && (
                      <div className="chapter-badge">📖 {story?.title}</div>
                    )}
                    <p className="page-text" style={{ fontSize: `${fontSize}px` }}>
                      {currentPage.lText}
                    </p>
                  </div>
                  <div className="page-num">{currentPage.lP}</div>
                </div>

                {/* Right Page */}
                <div className={`page page-right ${!isMobile() || mobilePage === 'right' ? 'mobile-active' : ''}`}>
                  <div className={`page-content ${isAnimating ? 'fade-in' : ''}`}>
                    <div className="illust">
                      <div className={`illust-bg ${currentPage.rBg}`}></div>
                      <div className="illust-emojis">
                        {currentPage.rEmoji.map((e, i) => (
                          <span key={i} className="illust-emoji">{e}</span>
                        ))}
                      </div>
                    </div>
                    <p className="page-text" style={{ fontSize: `${fontSize}px` }}>
                      {currentPage.rText}
                    </p>
                  </div>
                  <div className="page-num">{currentPage.rP}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="nav-arrow"
            onClick={nextPage}
            disabled={getCurrentPageIndex() >= total - 1}
          >
            ▶
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="bottom-bar">
          <div className="progress-section">
            <div className="progress-info">
              <span>📖 পড়া হয়েছে</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
            </div>
          </div>
          <div className="page-dots">{getPageDots()}</div>
          <div className="page-counter">
            <span className="current">{getCurrentPageIndex() + 1}</span>/<span>{total}</span>
          </div>
        </div>
      </main>

      {/* Autoplay Indicator */}
      <div className={`autoplay-ind ${autoplay ? 'show' : ''}`}>
        <span>▶️ পরবর্তী</span>
        <div className="autoplay-progress">
          <div className="autoplay-fill" style={{ width: `${(autoProgress / speed) * 100}%` }}></div>
        </div>
        <span className="timer">{Math.ceil((speed - autoProgress) / 1000)}s</span>
        <button className="close-btn" onClick={toggleAutoplay}>✕ বন্ধ</button>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay show">
          <div className="modal-card">
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">অভিনন্দন!</h2>
            <p className="modal-text">আপনি "{story.title}" সম্পূর্ণ পড়েছেন! 🌟</p>
            
            {quizQuestions.length > 0 && (
              <button 
                className="modal-btn" 
                onClick={() => { 
                  setShowCompleteModal(false)
                  setCurrentQuizIndex(0)
                  setQuizScore(0)
                  setShowQuizModal(true) 
                }}
              >
                🧠 কুইজ খেলুন ({quizQuestions.length} টি প্রশ্ন)
              </button>
            )}
            
            <button 
              className="modal-btn secondary" 
              onClick={() => { 
                setShowCompleteModal(false)
                setShowShareModal(true) 
              }}
            >
              📤 শেয়ার করুন
            </button>
            
            <button 
              className="modal-btn secondary" 
              onClick={() => {
                setShowCompleteModal(false)
                setCur(0)
                setMobilePage('left')
                setDone(new Set())
              }}
            >
              🔄 আবার পড়ুন
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && quizQuestions.length > 0 && (
        <div className="modal-overlay show">
          <div className="modal-card">
            <div className="modal-icon">🧠</div>
            <h2 className="modal-title">
              কুইজ ({currentQuizIndex + 1}/{quizQuestions.length})
            </h2>
            <p className="quiz-q">{quizQuestions[currentQuizIndex]?.question}</p>
            <div className="quiz-opts">
              {quizQuestions[currentQuizIndex]?.options?.map((opt, i) => (
                <div
                  key={i}
                  className={`quiz-opt 
                    ${selectedAnswer === i ? 'selected' : ''} 
                    ${quizResult && quizQuestions[currentQuizIndex].correct_answer === opt ? 'correct' : ''} 
                    ${quizResult && selectedAnswer === i && quizQuestions[currentQuizIndex].correct_answer !== opt ? 'wrong' : ''}
                  `}
                  onClick={() => !quizResult && setSelectedAnswer(i)}
                >
                  {opt}
                </div>
              ))}
            </div>
            <button 
              className="modal-btn" 
              onClick={submitQuiz} 
              disabled={selectedAnswer === null || quizResult !== null}
            >
              {quizResult ? (quizResult === 'correct' ? '✅ সঠিক!' : '❌ ভুল!') : 'উত্তর দিন'}
            </button>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchieveModal && (
        <div className="modal-overlay show">
          <div className="modal-card">
            <div className="modal-icon">🏆</div>
            <h2 className="modal-title">
              {quizScore === quizQuestions.length ? '🎉 দুর্দান্ত!' : 'গল্প শেষ!'}
            </h2>
            <p className="modal-text">
              আপনি {quizQuestions.length} টি প্রশ্নের মধ্যে {quizScore} টি সঠিক উত্তর দিয়েছেন!
              <br /><br />
              {quizScore === quizQuestions.length 
                ? '🌟 অভিনন্দন! আপনি সব প্রশ্নের সঠিক উত্তর দিয়েছেন!'
                : '📚 আবার গল্প পড়ে চেষ্টা করুন!'}
            </p>
            
            <button 
              className="modal-btn" 
              onClick={() => {
                setShowAchieveModal(false)
                setShowShareModal(true)
              }}
            >
              📤 বন্ধুদের সাথে শেয়ার করুন
            </button>
            
            <button className="modal-btn secondary" onClick={restartStory}>
              🔄 আবার পড়ুন
            </button>
            
            <button className="modal-btn secondary" onClick={closeAchieve}>
              🏠 Dashboard এ যান
            </button>
          </div>
        </div>
      )}
    </div>
  )
}