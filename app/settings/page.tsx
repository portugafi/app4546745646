"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log("Logging out...")
      await fetch("/api/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-red-900 to-yellow-800 p-4">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center">
          <div className="w-8 h-8 relative mr-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/portugalfi-logo-nYrlfOrZ7lrgx26ivt1whF48Ts33tk.png"
              alt="PortugaFi Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-white font-semibold">PortugaFi</span>
        </div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 relative animate-pulse">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/portugalfi-logo-nYrlfOrZ7lrgx26ivt1whF48Ts33tk.png"
              alt="PortugaFi Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
          <p className="text-xl text-yellow-200">Manage your account</p>
        </div>

        {/* Disconnect Wallet Card */}
        <Card className="bg-red-500/10 backdrop-blur-lg border-red-500/20">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <LogOut className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-white font-semibold text-xl mb-2">Disconnect Wallet</h3>
              <p className="text-red-200 text-sm">This will log you out and clear your session</p>
            </div>
            <Button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
