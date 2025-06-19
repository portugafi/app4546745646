"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Globe, Shield, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SobrePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-sm font-bold text-white">PF</span>
          </div>
          <span className="text-white font-semibold">PortugaFi</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Sobre o PortugaFi</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Revolucionando as finanças descentralizadas com tecnologia portuguesa
          </p>
        </div>

        {/* Cards de Informação */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <Globe className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Global</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200">Conectando Portugal ao mundo das finanças descentralizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <Shield className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200">Protocolos de segurança avançados para proteger seus ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200">Transações instantâneas com taxas mínimas</p>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Nossa Missão</h2>
            <div className="space-y-4 text-blue-200">
              <p>
                O PortugaFi nasceu com a missão de democratizar o acesso às finanças descentralizadas, oferecendo uma
                plataforma segura, intuitiva e totalmente adaptada às necessidades dos utilizadores portugueses.
              </p>
              <p>
                Através de tecnologia blockchain de ponta, proporcionamos soluções financeiras inovadoras que permitem
                aos nossos utilizadores ter controlo total sobre os seus ativos digitais.
              </p>
              <p>
                Com foco na educação financeira e na inclusão digital, o PortugaFi está a construir o futuro das
                finanças em Portugal, uma transação de cada vez.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
