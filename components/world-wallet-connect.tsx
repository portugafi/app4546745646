"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

type WalletAuthInput = {
  nonce: string
  requestId: string
  expirationTime: Date
  notBefore: Date
  statement: string
}

export default function WorldWalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [miniKitReady, setMiniKitReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    checkMiniKitStatus()
  }, [])

  const addDebugInfo = (info: string) => {
    console.log(info)
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  const checkMiniKitStatus = async () => {
    try {
      addDebugInfo("Checking MiniKit status...")

      // Verificar se estamos no browser
      if (typeof window === "undefined") {
        addDebugInfo("❌ Not in browser environment")
        return
      }

      // Verificar User Agent para World App
      const userAgent = navigator.userAgent
      addDebugInfo(`User Agent: ${userAgent}`)

      const isWorldApp = userAgent.includes("WorldApp") || userAgent.includes("MiniApp")
      addDebugInfo(`Is World App: ${isWorldApp}`)

      // Tentar carregar o MiniKit
      const { MiniKit } = await import("@worldcoin/minikit-js")
      addDebugInfo("✅ MiniKit imported successfully")

      // Verificar se está instalado
      const isInstalled = MiniKit.isInstalled()
      addDebugInfo(`MiniKit installed: ${isInstalled}`)

      if (isInstalled) {
        setMiniKitReady(true)
        addDebugInfo("✅ MiniKit is ready")
      } else {
        addDebugInfo("❌ MiniKit not installed")
        setError("Please open this app in World App to connect your wallet")
      }
    } catch (error) {
      addDebugInfo(`❌ Error checking MiniKit: ${error}`)
      setError(`MiniKit error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

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
      addDebugInfo("🚀 Starting wallet connection...")
      setIsConnecting(true)
      setError(null)

      // Verificar se o MiniKit está pronto
      if (!miniKitReady) {
        throw new Error("MiniKit is not ready. Please ensure you're using World App.")
      }

      // Importar MiniKit novamente para garantir
      const { MiniKit } = await import("@worldcoin/minikit-js")
      addDebugInfo("✅ MiniKit imported for connection")

      // Verificar instalação novamente
      if (!MiniKit.isInstalled()) {
        throw new Error("World App not detected. Please open this app in World App.")
      }

      addDebugInfo("📡 Getting nonce from server...")

      // Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce")
      if (!nonceRes.ok) {
        throw new Error(`Failed to get nonce: ${nonceRes.status} ${nonceRes.statusText}`)
      }

      const { nonce } = await nonceRes.json()
      addDebugInfo(`✅ Got nonce: ${nonce}`)

      // Preparar input para autenticação
      const authInput = walletAuthInput(nonce)
      addDebugInfo(`🔐 Prepared auth input: ${JSON.stringify(authInput, null, 2)}`)

      addDebugInfo("🔑 Requesting wallet authentication...")

      // Request wallet authentication from World App
      const result = await MiniKit.commandsAsync.walletAuth(authInput)
      addDebugInfo(`📱 Wallet auth result: ${JSON.stringify(result, null, 2)}`)

      if (result.commandPayload.status === "error") {
        throw new Error(`Wallet authentication failed: ${result.commandPayload.message || "Unknown error"}`)
      }

      const payload = result.commandPayload
      addDebugInfo(`✅ Authentication successful for address: ${payload.address}`)

      // Verify on server
      addDebugInfo("🔍 Verifying authentication on server...")
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, nonce }),
      })

      if (!loginRes.ok) {
        const errorData = await loginRes.json()
        throw new Error(`Server verification failed: ${errorData.error || loginRes.statusText}`)
      }

      const { success, user } = await loginRes.json()
      if (!success) {
        throw new Error("Authentication verification failed")
      }

      addDebugInfo(`✅ Login successful: ${JSON.stringify(user, null, 2)}`)
      addDebugInfo("🎉 Redirecting to dashboard...")

      router.push("/dashboard")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet"
      addDebugInfo(`❌ Connection failed: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  // Função para testar sem World App (apenas para desenvolvimento)
  const handleTestConnection = () => {
    addDebugInfo("🧪 Test connection (bypassing World App)")
    router.push("/dashboard")
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleConnectWallet}
        disabled={isConnecting || !miniKitReady}
        className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Connecting...
          </div>
        ) : !miniKitReady ? (
          <div className="flex items-center justify-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            World App Required
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Wallet className="mr-2 h-5 w-5" />
            Connect World Wallet
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        )}
      </Button>

      {/* Botão de teste para desenvolvimento */}
      {process.env.NODE_ENV === "development" && (
        <Button
          onClick={handleTestConnection}
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          🧪 Test Connection (Dev Only)
        </Button>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === "development" && debugInfo.length > 0 && (
        <div className="mt-4 p-4 bg-black/20 rounded-lg max-h-40 overflow-y-auto">
          <h4 className="text-white text-sm font-semibold mb-2">Debug Info:</h4>
          {debugInfo.map((info, index) => (
            <p key={index} className="text-xs text-gray-300 font-mono">
              {info}
            </p>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
