"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // 1. Obter nonce
      const nonceResponse = await fetch("/api/auth/nonce")
      const { nonce } = await nonceResponse.json()

      // 2. Aqui você integraria com o Worldcoin MiniKit
      // Por enquanto, simulando um payload
      const mockPayload = {
        address: "0x1234567890123456789012345678901234567890",
        message: "Sign in with Ethereum",
        signature: "mock_signature",
      }

      // 3. Fazer login
      const success = await login(mockPayload, nonce)

      if (success) {
        console.log("Login realizado com sucesso!")
      } else {
        console.error("Falha no login")
      }
    } catch (error) {
      console.error("Erro durante o login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
    >
      {isLoading ? "Conectando..." : "Conectar Carteira"}
    </Button>
  )
}
