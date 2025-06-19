"use client"

import { MiniKit, type WalletAuthInput } from "@worldcoin/minikit-js"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: crypto.randomUUID(),
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement: "Welcome to PortugaFi",
  }
}

type LoginProps = {
  onLoginSuccess?: (user: any) => void
}

export default function WorldWalletConnect({ onLoginSuccess }: LoginProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [miniKitReady, setMiniKitReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      checkMiniKitStatus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const checkMiniKitStatus = () => {
    try {
      if (typeof window === "undefined") return

      // Verificar se MiniKit está instalado
      const isInstalled = MiniKit.isInstalled()
      console.log("MiniKit installed:", isInstalled)

      if (isInstalled) {
        setMiniKitReady(true)
        console.log("MiniKit is ready")
      } else {
        console.log("MiniKit not installed")
        // Para desenvolvimento, permitir mesmo sem MiniKit
        if (process.env.NODE_ENV === "development") {
          setMiniKitReady(true)
        } else {
          setError("Please open this app in World App to connect your wallet")
        }
      }
    } catch (error) {
      console.error("Error checking MiniKit:", error)
      setError(`MiniKit error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Starting login process...")

      // Obter nonce do servidor
      console.log("Fetching nonce from /api/nonce...")
      const res = await fetch(`/api/nonce`)
      console.log("Nonce response status:", res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Nonce fetch failed:", errorText)
        throw new Error(`Failed to get nonce: ${res.status} - ${errorText}`)
      }

      const { nonce } = await res.json()
      console.log("Got nonce:", nonce)

      let finalPayload: any

      // Verificar se estamos no World App
      if (MiniKit.isInstalled()) {
        console.log("Using MiniKit for authentication")
        // Autenticar com World Wallet
        const result = await MiniKit.commandsAsync.walletAuth(walletAuthInput(nonce))
        console.log("WalletAuth response:", result)

        if (result.finalPayload.status === "error") {
          throw new Error(`Wallet authentication failed: ${result.finalPayload.message || "Unknown error"}`)
        }

        finalPayload = result.finalPayload
      } else {
        // Para desenvolvimento - simular payload
        console.log("Simulating wallet auth for development")
        finalPayload = {
          address: "0x1234567890123456789012345678901234567890",
          message: "Welcome to PortugaFi",
          signature: "0xmocksignature",
          status: "success",
        }
      }

      console.log("Final payload:", finalPayload)

      // Fazer login no servidor
      console.log("Sending login request to /api/login...")
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      })

      console.log("Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Login failed:", errorData)
        throw new Error(`Server verification failed: ${errorData.error || response.statusText}`)
      }

      const userData = await response.json()
      console.log("Login response:", userData)

      if (!userData.success) {
        throw new Error("Authentication verification failed")
      }

      // Preparar informações do usuário
      const userInfo = {
        ...userData.user,
        walletAddress: finalPayload.address || userData.user.walletAddress,
      }

      console.log("Final user info:", userInfo)

      // Callback de sucesso ou redirecionamento
      if (onLoginSuccess) {
        onLoginSuccess(userInfo)
      } else {
        // Use window.location instead of router.push to avoid potential issues
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Função para testar sem World App (apenas para desenvolvimento)
  const handleTestConnection = () => {
    console.log("🧪 Test connection (bypassing World App)")
    window.location.href = "/dashboard"
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
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

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
