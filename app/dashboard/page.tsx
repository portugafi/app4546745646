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
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated tech grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

        {/* Loading animation */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-cyan-400 text-xl font-light tracking-wider">{"INITIALIZING NAVEW..."}</div>
          <div className="text-cyan-500/60 text-sm mt-2 animate-pulse">{"Connecting to Digital Currency Network"}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated tech background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>

        {/* Tech lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm bg-black/10 border-b border-cyan-500/20">
        <div className="flex items-center">
          <div className="w-14 h-14 relative mr-4 p-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <Image src="/navew-logo.png" alt="NAVEW Logo" width={40} height={40} className="object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
              {"NAVEW DASHBOARD"}
            </h1>
            {user && (
              <p className="text-sm text-cyan-300/80 font-mono tracking-wide">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-cyan-300/80 text-sm font-light">{"ONLINE"}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 pb-32">
        <div className="text-center">
          {/* Logo container with tech effects */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Rotating rings */}
            <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-spin"></div>
            <div
              className="absolute inset-2 border border-purple-500/30 rounded-full animate-spin animation-delay-1000"
              style={{ animationDirection: "reverse" }}
            ></div>
            <div className="absolute inset-4 border border-blue-500/30 rounded-full animate-spin animation-delay-2000"></div>

            {/* Logo */}
            <div className="absolute inset-8 flex items-center justify-center">
              <Image
                src="/navew-logo.png"
                alt="NAVEW Logo"
                width={96}
                height={96}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Welcome text */}
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 mb-4 tracking-wider">
            {"WELCOME TO NAVEW"}
          </h2>

          <p className="text-xl text-cyan-300/80 max-w-2xl mx-auto mb-8 font-light tracking-wide">
            {"Next-Generation Digital Currency Platform"}
          </p>

          {/* Tech stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{"24/7"}</div>
              <div className="text-sm text-cyan-300/60">{"ACTIVE"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{"∞"}</div>
              <div className="text-sm text-purple-300/60">{"POSSIBILITIES"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{"100%"}</div>
              <div className="text-sm text-blue-300/60">{"SECURE"}</div>
            </div>
          </div>

          {/* Connectivity indicator */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse animation-delay-400"></div>
              <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse animation-delay-600"></div>
            </div>
            <span className="text-cyan-300/80 text-sm font-light tracking-wide">{"QUANTUM NETWORK ACTIVE"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Additional tech elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </div>
  )
}
