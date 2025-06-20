"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Rocket, Shield, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-4 pb-24">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
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
            <Image src="/navew-logo.png" alt="NAVEW Logo" fill className="object-contain" />
          </div>
          <span className="text-white font-semibold">NAVEW</span>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Hero Section - Ultra Compact */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-2 relative animate-pulse">
            <Image src="/navew-logo.png" alt="NAVEW Logo" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">About NAVEW</h1>
          <p className="text-sm text-cyan-200">Next-Generation Digital Currency</p>
        </div>

        {/* Main Content - Ultra Compact */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-sm">
              <Globe className="w-4 h-4 mr-1 text-cyan-400" />
              Vision Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white/5 rounded p-3">
              <p className="text-cyan-200 leading-tight text-xs">
                <strong className="text-white text-xs">NAVEW (NVW)</strong> is a crypto asset created on Worldchain
                (ERC-20) representing innovation, digital sovereignty and Portuguese national pride.
              </p>
            </div>
            <div className="bg-white/5 rounded p-3">
              <p className="text-cyan-200 leading-tight text-xs">
                <strong className="text-white text-xs">Mission:</strong> Unite the global Portuguese-speaking community
                with blockchain technology, rewards, staking and decentralized applications.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specs - Ultra Compact */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-sm">
              <Shield className="w-4 h-4 mr-1 text-purple-400" />
              Technical Specs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/5 rounded p-2">
                <p className="text-white font-semibold text-xs">Token:</p>
                <p className="text-cyan-200 text-xs">NAVEW (NVW)</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="text-white font-semibold text-xs">Network:</p>
                <p className="text-cyan-200 text-xs">Worldchain</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="text-white font-semibold text-xs">Supply:</p>
                <p className="text-cyan-200 text-xs">1B NVW</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="text-white font-semibold text-xs">Type:</p>
                <p className="text-cyan-200 text-xs">Utility</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-white/5 rounded p-2">
                <div className="text-sm mb-1">🎁</div>
                <h3 className="text-white font-semibold text-xs mb-1">Daily Claims</h3>
                <p className="text-cyan-200 text-xs">Free rewards</p>
              </div>
              <div className="text-center bg-white/5 rounded p-2">
                <div className="text-sm mb-1">🔒</div>
                <h3 className="text-white font-semibold text-xs mb-1">Staking</h3>
                <p className="text-cyan-200 text-xs">Earn rewards</p>
              </div>
              <div className="text-center bg-white/5 rounded p-2">
                <div className="text-sm mb-1">🎨</div>
                <h3 className="text-white font-semibold text-xs mb-1">NFTs</h3>
                <p className="text-cyan-200 text-xs">Culture</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap - Ultra Compact */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-sm">
              <Rocket className="w-4 h-4 mr-1 text-cyan-400" />
              Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-cyan-200">✅ Token Creation (ERC-20)</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-cyan-200">🔍 Contract Verification</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-cyan-200">📱 Worldcoin Mini-App</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-cyan-200">🎁 Daily Claims System</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-gray-400">🎨 NFTs & Culture (2026)</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-gray-400">🤝 Real Adoption (2026)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer - Compact */}
        <div className="text-center">
          <p className="text-xs text-cyan-300/60 mb-1">v1.0.0 - © NAVEW 2025</p>
          <p className="text-xs text-cyan-300/60">Built with 💙 by NAVEW Labs 🇵🇹</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
