"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Rocket, Shield, Globe, Coins, Users, Target } from "lucide-react"
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
            <Image src="/navew-logo.png" alt="NAVEW Logo" fill className="object-contain" />
          </div>
          <span className="text-white font-semibold">NAVEW</span>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 relative animate-pulse">
            <Image src="/navew-logo.png" alt="NAVEW Logo" fill className="object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About NAVEW</h1>
          <p className="text-xl text-cyan-200 max-w-2xl mx-auto">
            Next-Generation Digital Currency Platform representing Portuguese innovation and digital sovereignty
          </p>
        </div>

        {/* Overview Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-2xl">
              <Globe className="w-8 h-8 mr-3 text-cyan-400" />
              Vision Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cyan-200 space-y-4">
            <p>
              <strong className="text-white">NAVEW (NVW)</strong> is a crypto asset created on the Worldchain network
              (ERC-20) that represents the spirit of innovation, digital sovereignty and Portuguese national pride.
            </p>
            <p>
              The project aims to unite the global community of Portuguese speakers with blockchain technology, rewards,
              staking and access via decentralized applications (dApps).
            </p>
          </CardContent>
        </Card>

        {/* Technical Specs */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-2xl">
              <Shield className="w-8 h-8 mr-3 text-purple-400" />
              Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cyan-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Token Name:</span>
                  <span>NAVEW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Symbol:</span>
                  <span>NVW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Network:</span>
                  <span>Worldchain (ERC-20)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Max Supply:</span>
                  <span>1,000,000,000 NVW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Type:</span>
                  <span>Utility Token</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Uses:</span>
                  <span>Staking, Rewards, NFTs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <Coins className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-xl font-bold text-white mb-2">Daily Rewards</h3>
              <p className="text-cyan-200 text-sm">Free daily claims verified via WorldID</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold text-white mb-2">Staking System</h3>
              <p className="text-cyan-200 text-sm">Earn passive rewards by staking NVW tokens</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold text-white mb-2">Community</h3>
              <p className="text-cyan-200 text-sm">Unite Portuguese speakers globally through Web3</p>
            </CardContent>
          </Card>
        </div>

        {/* Roadmap */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-2xl">
              <Rocket className="w-8 h-8 mr-3 text-cyan-400" />
              Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cyan-200">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">✅ Token Creation (ERC-20) Worldchain</h4>
                  <p className="text-sm">Smart contract implementation and deployment</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-cyan-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">🔍 Contract Verification</h4>
                  <p className="text-sm">Worldchain integration and security audit</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-purple-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">📱 Worldcoin Mini-App Launch</h4>
                  <p className="text-sm">Native rewards and staking application</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">🎁 Free Daily Claims</h4>
                  <p className="text-sm">Verified token distribution system</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">🎨 NFTs and Culture (2026)</h4>
                  <p className="text-sm">Explorer, Discoverer, Culture Guardian collections</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">🤝 Real Adoption (2026)</h4>
                  <p className="text-sm">Partnerships with Portuguese regional businesses</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-lg border-cyan-500/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">🌍 Mission</h3>
            <p className="text-cyan-200 text-lg leading-relaxed">
              Promote a digital currency that unites culture, innovation and sovereignty, reinforcing Portugal's
              presence in the crypto and Web3 world.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
