// app/dashboard/layout.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user")
    
    if (!userData) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    setLoading(false)
  }, [router, pathname])

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

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}