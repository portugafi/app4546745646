"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type WalletAuthInput = {
  nonce: string
  requestId: string
  expirationTime: Date
  notBefore: Date
  statement: string
}

type WalletAuthSuccessPayload = {
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

export default function WorldWalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const walletAuthInput = (nonce: string): WalletAuthInput => {
    return {
      nonce,
      requestId: crypto.randomUUID(),
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notBefore: new Date(),
      statement: "Connect to PortugaFi",
    }
  }

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      console.log("Starting wallet connection process...")

      // Dynamically import the SDK to avoid SSR issues
      const { MiniKit } = await import("@worldcoin/minikit-js")

      if (!MiniKit.isInstalled()) {
        console.error("World App not detected")
        setError("World App not detected. Please open this app in World App.")
        return
      }

      console.log("MiniKit is installed, getting nonce...")

      // Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce")
      if (!nonceRes.ok) {
        throw new Error("Failed to get authentication nonce")
      }
      const { nonce } = await nonceRes.json()
      console.log("Got nonce:", nonce)

      // Request wallet authentication from World App
      console.log("Requesting wallet auth with nonce:", nonce)
      const { commandPayload } = await MiniKit.commandsAsync.walletAuth(walletAuthInput(nonce))
      console.log("Wallet auth response:", commandPayload)

      if (commandPayload.status === "error") {
        console.error("Wallet auth error:", commandPayload)
        throw new Error(`Wallet authentication failed: ${commandPayload.message || "Unknown error"}`)
      }

      const payload = commandPayload as WalletAuthSuccessPayload
      console.log("Wallet address:", payload.address)

      // Verify on server
      console.log("Sending login request to server...")
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, nonce }),
      })

      if (!loginRes.ok) {
        const errorData = await loginRes.json()
        throw new Error(`Authentication verification failed: ${errorData.error || loginRes.statusText}`)
      }

      const { success, user } = await loginRes.json()
      if (!success) {
        throw new Error("Authentication failed")
      }

      console.log("Login successful, user:", user)
      router.push("/dashboard")
    } catch (err) {
      console.error("Wallet connection error:", err)
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
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
  )
}
