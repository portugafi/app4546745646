"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const handleConnectWallet = () => {
    setIsConnecting(true)
    // Simula conexão da wallet
    setTimeout(() => {
      setIsConnecting(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardContent className="p-8 text-center">
          {/* Logo PortugaFi */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">PF</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">PortugaFi</h1>
            <p className="text-blue-200">Conecte-se ao futuro das finanças</p>
          </div>

          {/* Connect Wallet Button */}
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Conectando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wallet className="mr-2 h-5 w-5" />
                Conectar Carteira
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </Button>

          <p className="text-sm text-blue-200 mt-4">Conecte sua carteira para acessar o ecossistema PortugaFi</p>
        </CardContent>
      </Card>
    </div>
  )
}
