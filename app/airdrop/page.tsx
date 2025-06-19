"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Coins, Gift } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AirdropPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 42,
    seconds: 30,
  })
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClaim = () => {
    setClaimed(true)
    // Aqui seria implementada a lógica real do claim
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-sm font-bold text-white">PF</span>
          </div>
          <span className="text-white font-semibold">PortugaFi</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Airdrop PortugaFi</h1>
          <p className="text-xl text-purple-200">Receba tokens PFI gratuitamente!</p>
        </div>

        {/* Countdown */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">Tempo Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-purple-200 text-sm">Dias</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-purple-200 text-sm">Horas</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-purple-200 text-sm">Minutos</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-purple-200 text-sm">Segundos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moeda e Claim */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardContent className="p-8 text-center">
            {/* Moeda Animada */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
                <Coins className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-ping"></div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">1,000 PFI</h3>
            <p className="text-purple-200 mb-8">Tokens disponíveis para claim</p>

            <Button
              onClick={handleClaim}
              disabled={claimed}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claimed ? (
                <div className="flex items-center justify-center">
                  <Coins className="mr-2 h-5 w-5" />
                  Tokens Reclamados!
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Gift className="mr-2 h-5 w-5" />
                  Reclamar Tokens
                </div>
              )}
            </Button>

            {claimed && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200">✅ Parabéns! Seus tokens PFI foram enviados para sua carteira.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações do Airdrop */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-purple-200">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p>Conecte sua carteira compatível</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p>Clique no botão "Reclamar Tokens"</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p>Confirme a transação em sua carteira</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <p>Receba seus tokens PFI gratuitamente!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
