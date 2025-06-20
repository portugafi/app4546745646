"use client"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import WorldWalletConnect from "@/components/world-wallet-connect"

export default function HomePage() {
  const router = useRouter()

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* NAVEW Logo */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <Image src="/navew-logo.png" alt="NAVEW Logo" fill className="object-contain" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">NAVEW</h1>
              <p className="text-cyan-200">Connect to the future of digital currency</p>
            </div>

            {/* Connect Wallet Component */}
            <WorldWalletConnect />

            <p className="text-sm text-cyan-200 mt-4">Connect your World wallet to access the NAVEW ecosystem</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
