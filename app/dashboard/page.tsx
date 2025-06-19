"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text3D, Environment } from "@react-three/drei"
import { useState, Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Image from "next/image"

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

      {/* Menu items positioned closer together */}
      <MenuItem position={[-1.2, 0.3, 0]} text="ABOUT" onClick={() => router.push("/about")} color="#006600" />
      <MenuItem position={[1.2, -0.3, 0]} text="AIRDROP" onClick={() => router.push("/airdrop")} color="#FF0000" />

      <Environment preset="city" />
    </>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session")

      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setUser(data.user)
        } else {
          // Create a mock user for testing
          const mockUser = {
            id: "mock_user",
            walletAddress: "0x1234...5678",
            authTime: new Date().toISOString(),
          }
          setUser(mockUser)
        }
      } else {
        // Create a mock user for testing
        const mockUser = {
          id: "mock_user",
          walletAddress: "0x1234...5678",
          authTime: new Date().toISOString(),
        }
        setUser(mockUser)
      }
    } catch (error) {
      console.error("Session check failed:", error)
      // Create a mock user for testing
      const mockUser = {
        id: "mock_user",
        walletAddress: "0x1234...5678",
        authTime: new Date().toISOString(),
      }
      setUser(mockUser)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-green-900 via-red-900 to-yellow-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
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

      {/* 3D Menu - More compact */}
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <Suspense fallback={null}>
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

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-white/70 text-sm">Click on menu items to navigate • Drag to rotate</p>
      </div>
    </div>
  )
}
