"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Flag, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-red-900 to-yellow-800 p-4 pb-24">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
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

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Hero Section - Ultra Compact */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-2 relative animate-pulse">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/portugalfi-logo-nYrlfOrZ7lrgx26ivt1whF48Ts33tk.png"
              alt="PortugaFi Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">About PortugaFi</h1>
          <p className="text-sm text-yellow-200">Portuguese heritage & innovative finance</p>
        </div>

        {/* Main Content - Ultra Compact */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-sm">
              <Flag className="w-4 h-4 mr-1 text-yellow-400" />
              Mission & Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white/5 rounded p-3">
              <p className="text-yellow-200 leading-tight text-xs">
                <strong className="text-white text-xs">Mission:</strong> PortugaFi is dedicated to Portuguese
                constitution highlights: culture, history and achievements. We preserve long-term value with TPulseFi
                partnership for continuous development.
              </p>
            </div>
            <div className="bg-white/5 rounded p-3">
              <p className="text-yellow-200 leading-tight text-xs">
                <strong className="text-white text-xs">Vision:</strong> Sustainable financial ecosystem honoring
                Portuguese heritage while embracing blockchain technology, bridging traditional values with progressive
                finance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Section - Ultra Compact */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-sm">
              <Heart className="w-4 h-4 mr-1 text-red-400" />
              TPulseFi Partnership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-200 leading-tight mb-3 text-xs">
              Strategic partnership ensuring continuous innovation. Building robust financial infrastructure respecting
              Portuguese traditions while embracing decentralized finance future.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-white/5 rounded p-2">
                <div className="text-sm mb-1">🏛️</div>
                <h3 className="text-white font-semibold text-xs mb-1">Heritage</h3>
                <p className="text-yellow-200 text-xs">Culture & history</p>
              </div>
              <div className="text-center bg-white/5 rounded p-2">
                <div className="text-sm mb-1">💎</div>
                <h3 className="text-white font-semibold text-xs mb-1">Value</h3>
                <p className="text-yellow-200 text-xs">Long-term growth</p>
              </div>
              <div className="text-center bg-white/5 rounded p-2">
                <div className="text-sm mb-1">🚀</div>
                <h3 className="text-white font-semibold text-xs mb-1">Innovation</h3>
                <p className="text-yellow-200 text-xs">Blockchain tech</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
