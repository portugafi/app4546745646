"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

interface DashboardUser {
  id: string
  walletAddress: string
  authTime: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      console.log("Checking session...")
      const response = await fetch("/api/session")

      console.log("Session response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Session data:", data)

        if (data.authenticated && data.user) {
          setUser(data.user)
        } else {
          console.log("User not authenticated, redirecting to home")
          router.push("/")
        }
      } else {
        console.log("Session check failed, redirecting to home")
        router.push("/")
      }
    } catch (error) {
      console.error("Session check error:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 relative mr-4">
            <Image src="/navew-logo.png" alt="NAVEW Logo" fill className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">NAVEW Dashboard</h1>
            {user && (
              <p className="text-sm text-cyan-200">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 pb-32">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 relative animate-pulse">
            <Image src="/navew-logo.png" alt="NAVEW Logo" fill className="object-contain" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Welcome to NAVEW</h2>
          <p className="text-xl text-cyan-200 max-w-2xl mx-auto mb-8">Connected to the future of digital currency</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
