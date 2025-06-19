"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, TrendingUp, Lock, Coins, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

export default function StakingPage() {
  const router = useRouter()
  const [stakeAmount, setStakeAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)

  const handleStake = async () => {
    setIsStaking(true)
    // Simulate staking process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsStaking(false)
    setStakeAmount("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-red-900 to-yellow-800 p-4 pb-24">
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

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-yellow-600 rounded-full flex items-center justify-center animate-pulse">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">PTF Staking</h1>
          <p className="text-xl text-yellow-200">Earn passive rewards by staking your PTF tokens</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <h3 className="text-2xl font-bold text-white mb-2">12.5%</h3>
              <p className="text-yellow-200">Annual APY</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <Lock className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white mb-2">50,000</h3>
              <p className="text-yellow-200">Total Staked PTF</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-red-400" />
              <h3 className="text-2xl font-bold text-white mb-2">7 Days</h3>
              <p className="text-yellow-200">Lock Period</p>
            </CardContent>
          </Card>
        </div>

        {/* Staking Interface */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Stake PTF */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Coins className="w-6 h-6 mr-3 text-yellow-400" />
                Stake PTF Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-yellow-200 text-sm mb-2 block">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="Enter PTF amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
              <div className="text-sm text-yellow-200">
                <p>Available Balance: 1,000 PTF</p>
                <p>
                  Estimated Rewards: {stakeAmount ? (Number.parseFloat(stakeAmount) * 0.125).toFixed(2) : "0"} PTF/year
                </p>
              </div>
              <Button
                onClick={handleStake}
                disabled={!stakeAmount || isStaking}
                className="w-full bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white font-bold py-3"
              >
                {isStaking ? "Staking..." : "Stake PTF"}
              </Button>
            </CardContent>
          </Card>

          {/* Your Stakes */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-6 h-6 mr-3 text-green-400" />
                Your Stakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Active Stake</span>
                    <span className="text-yellow-400">500 PTF</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-yellow-200 text-sm">Rewards Earned</span>
                    <span className="text-green-400">15.6 PTF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200 text-sm">Unlock Date</span>
                    <span className="text-white text-sm">Dec 25, 2024</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Claim Rewards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
