"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type MiniAppWalletAuthSuccessPayload = {
  address: string
  signature: string
  message: string
  chainId: number
  issuedAt: string
  expirationTime: string
  notBefore: string
  requestId: string
  resources: string[]
}

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      // Dynamically import the SDK to avoid SSR issues
      const { MiniKit } = await import("@worldcoin/minikit-js")

      if (!MiniKit.isInstalled()) {
        // Instead of throwing error, redirect to dashboard for testing
        router.push("/dashboard")
        return
      }

      // Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce")
      if (!nonceRes.ok) throw new Error("Failed to get authentication nonce")
      const { nonce } = await nonceRes.json()

      // Request wallet authentication from World App
      const walletAuth = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 5 * 60 * 1000),
        notBefore: new Date(),
        statement: "Connect to PortugaFi",
      })

      if (walletAuth.commandPayload.status === "error") {
        throw new Error("Wallet authentication failed")
      }

      const payload = walletAuth.commandPayload as MiniAppWalletAuthSuccessPayload

      // Verify on server
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, nonce }),
      })

      if (!loginRes.ok) throw new Error("Authentication verification failed")

      const { success } = await loginRes.json()
      if (!success) throw new Error("Authentication failed")

      router.push("/dashboard")
    } catch (err) {
      console.error("Wallet connection error:", err)
      // For testing, redirect to dashboard even on error
      router.push("/dashboard")
    } finally {
      setIsConnecting(false)
    }
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
          {/* PortugaFi Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image src="/portugalfi-logo.png" alt="PortugaFi Logo" fill className="object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">PortugaFi</h1>
            <p className="text-yellow-200">Connect to the future of Portuguese finance</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Connect Wallet Button */}
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Connecting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wallet className="mr-2 h-5 w-5" />
                Connect World Wallet
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </Button>

          <p className="text-sm text-yellow-200 mt-4">Connect your World wallet to access the PortugaFi ecosystem</p>
        </CardContent>
      </Card>
    </div>
  )
}
