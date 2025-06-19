"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { DebugConsole } from "@/components/debug-console"

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true)
      console.log("🚀 Starting wallet connection process...")

      // Check if we're in World App environment
      const userAgent = navigator.userAgent
      const currentUrl = window.location.href

      console.log("🔍 Environment check:")
      console.log("- User Agent:", userAgent)
      console.log("- Current URL:", currentUrl)
      console.log("- Window location:", window.location)

      const isWorldApp =
        currentUrl.includes("worldapp://") ||
        userAgent.includes("WorldApp") ||
        userAgent.includes("MiniApp") ||
        window.location.hostname.includes("worldcoin")

      console.log("🌍 Is World App environment:", isWorldApp)

      if (!isWorldApp) {
        console.warn("⚠️ Not in World App environment")
        throw new Error("This app must be opened in World App to connect wallet")
      }

      console.log("📦 Importing MiniKit...")
      // Dynamically import MiniKit
      const { MiniKit } = await import("@worldcoin/minikit-js")
      console.log("✅ MiniKit imported successfully")

      console.log("🔧 Installing MiniKit...")
      const appId = process.env.NEXT_PUBLIC_APP_ID || "app_staging_b8e2b5b5c6b8e2b5b5c6b8e2"
      console.log("🆔 App ID:", appId)

      MiniKit.install({
        appId,
        enableTelemetry: true,
      })

      console.log("⏳ Waiting for MiniKit installation...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const isInstalled = MiniKit.isInstalled()
      console.log("🔍 MiniKit installed:", isInstalled)

      if (!isInstalled) {
        throw new Error("MiniKit installation failed")
      }

      console.log("🎫 Getting nonce from server...")
      const nonceRes = await fetch("/api/auth/nonce")
      console.log("📡 Nonce response status:", nonceRes.status)

      if (!nonceRes.ok) {
        const errorText = await nonceRes.text()
        console.error("❌ Nonce request failed:", errorText)
        throw new Error(`Failed to get nonce: ${nonceRes.status} - ${errorText}`)
      }

      const nonceData = await nonceRes.json()
      console.log("✅ Nonce received:", nonceData)

      console.log("🔐 Requesting wallet authentication...")
      const authInput = {
        nonce: nonceData.nonce,
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 5 * 60 * 1000),
        notBefore: new Date(),
        statement: "Connect to PortugaFi",
      }
      console.log("🔑 Auth input:", authInput)

      const walletAuth = await MiniKit.commandsAsync.walletAuth(authInput)
      console.log("📱 Wallet auth response:", walletAuth)

      if (walletAuth.commandPayload.status === "error") {
        console.error("❌ Wallet auth error:", walletAuth.commandPayload)
        throw new Error(`Wallet authentication failed: ${walletAuth.commandPayload.message}`)
      }

      console.log("✅ Wallet authentication successful")
      console.log("📤 Sending login request to server...")

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: walletAuth.commandPayload,
          nonce: nonceData.nonce,
        }),
      })

      console.log("📡 Login response status:", loginRes.status)

      if (!loginRes.ok) {
        const errorText = await loginRes.text()
        console.error("❌ Login request failed:", errorText)
        throw new Error(`Login failed: ${loginRes.status} - ${errorText}`)
      }

      const loginData = await loginRes.json()
      console.log("✅ Login response:", loginData)

      if (!loginData.success) {
        throw new Error("Authentication verification failed")
      }

      console.log("🎉 Login successful! Redirecting to dashboard...")
      router.push("/dashboard")
    } catch (err) {
      console.error("💥 Wallet connection error:", err)
      if (err instanceof Error) {
        console.error("Error message:", err.message)
        console.error("Error stack:", err.stack)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <>
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

      <DebugConsole />
    </>
  )
}
