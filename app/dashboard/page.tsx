"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text3D, Environment } from "@react-three/drei"
import { useState, Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Image from "next/image"
import { DebugConsole } from "@/components/debug-console"

interface DashboardUser {
  id: string
  walletAddress: string
  authTime: string
}

function MenuItem({ position, text, onClick, color = "#006600" }: any) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      <Text3D
        font="/fonts/Geist_Bold.json"
        size={0.3}
        height={0.05}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={3}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        scale={hovered ? 1.1 : 1}
      >
        {text}
        <meshStandardMaterial color={hovered ? "#FFD700" : color} />
      </Text3D>
    </group>
  )
}

function Scene() {
  const router = useRouter()

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, 5]} intensity={0.4} />

      <MenuItem position={[-1.2, 0.3, 0]} text="ABOUT" onClick={() => router.push("/about")} color="#006600" />
      <MenuItem position={[1.2, -0.3, 0]} text="AIRDROP" onClick={() => router.push("/airdrop")} color="#FF0000" />

      <Environment preset="city" />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white">Loading 3D Menu...</div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🏠 Dashboard mounted")
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      console.log("🔍 Checking session...")

      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("📡 Session response status:", response.status)
      console.log("📡 Session response headers:", Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Session data:", data)

        if (data.authenticated && data.user) {
          setUser(data.user)
          console.log("👤 User authenticated:", data.user)
        } else {
          console.log("❌ User not authenticated")
          setUser(null)
        }
      } else {
        const errorText = await response.text()
        console.error("❌ Session check failed:", errorText)
        setUser(null)
      }
    } catch (error) {
      console.error("💥 Session check error:", error)
      setUser(null)
    } finally {
      setLoading(false)
      console.log("✅ Session check completed")
    }
  }

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...")
      await fetch("/api/auth/logout", { method: "POST" })
      console.log("✅ Logout successful")
      router.push("/")
    } catch (error) {
      console.error("💥 Logout error:", error)
      router.push("/")
    }
  }

  if (loading) {
    return (
      <>
        <div className="h-screen bg-gradient-to-br from-green-900 via-red-900 to-yellow-800 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <DebugConsole />
      </>
    )
  }

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-green-900 via-red-900 to-yellow-800 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 relative mr-3">
              <Image src="/portugalfi-logo.png" alt="PortugaFi Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PortugaFi</h1>
              {user && (
                <p className="text-xs text-yellow-200">
                  {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>

        {/* 3D Menu */}
        <div className="h-full pb-20">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 60 }}
            gl={{
              preserveDrawingBuffer: true,
              powerPreference: "high-performance",
              antialias: false,
            }}
            onCreated={({ gl }) => {
              console.log("🎨 WebGL context created")
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <Scene />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-24 left-4 right-4 text-center">
          <p className="text-white/70 text-sm">Click on menu items to navigate • Drag to rotate</p>
        </div>
      </div>

      <DebugConsole />
    </>
  )
}
