"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const handleConnectWallet = () => {
    setIsConnecting(true)
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-red-800 to-yellow-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardContent className="p-8 text-center">
          {/* PortugalFi Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image src="/portugalfi-logo.png" alt="PortugalFi Logo" fill className="object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">PortugalFi</h1>
            <p className="text-yellow-200">Connect to the future of Portuguese finance</p>
          </div>

          {/* Connect Wallet Button */}
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </Button>

          <p className="text-sm text-yellow-200 mt-4">Connect your wallet to access the PortugalFi ecosystem</p>
        </CardContent>
      </Card>
    </div>
  )
}
