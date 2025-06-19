"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Info, Settings } from "lucide-react"
import Image from "next/image"

export default function BottomNavigation() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)

  const handleCenterButtonClick = () => {
    setIsGlowing(true)
    setIsMenuOpen(!isMenuOpen)

    // Remove glow effect after animation
    setTimeout(() => setIsGlowing(false), 300)
  }

  const menuItems = [
    {
      icon: <Gift className="w-6 h-6" />,
      label: "Airdrop",
      path: "/airdrop",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Info className="w-6 h-6" />,
      label: "About",
      path: "/about",
      color: "from-blue-500 to-purple-500",
    },
  ]

  return (
    <>
      {/* Menu Popup */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pb-40">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mx-4 relative z-50 animate-in slide-in-from-bottom-4 duration-300">
            <CardContent className="p-6">
              <div className="flex space-x-6">
                {menuItems.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.path)
                      setIsMenuOpen(false)
                    }}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg bg-gradient-to-r ${item.color} hover:scale-105 transition-all duration-200 min-w-[100px]`}
                  >
                    <div className="text-white">{item.icon}</div>
                    <span className="text-white text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="bg-gradient-to-r from-green-600 via-red-600 to-yellow-600 p-4 pb-6">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            {/* Left spacer */}
            <div className="w-12"></div>

            {/* Center Button - Raised */}
            <button
              onClick={handleCenterButtonClick}
              className={`relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-lg border-2 border-white/30 flex items-center justify-center transition-all duration-300 transform hover:scale-110 -translate-y-2 ${
                isGlowing ? "animate-pulse shadow-lg shadow-yellow-400/50 scale-110" : ""
              }`}
            >
              <div className="w-10 h-10 relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/portugalfi-logo-nYrlfOrZ7lrgx26ivt1whF48Ts33tk.png"
                  alt="PortugaFi Logo"
                  fill
                  className="object-contain"
                />
              </div>
              {isGlowing && <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping"></div>}
            </button>

            {/* Right - Settings - Raised */}
            <button
              onClick={() => router.push("/settings")}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 -translate-y-2"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
