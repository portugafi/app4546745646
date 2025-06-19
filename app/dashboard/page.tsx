"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text3D, Environment } from "@react-three/drei"
import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Image from "next/image"

function MenuItem({ position, text, onClick, color = "#006600" }: any) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      <Text3D
        font="/fonts/Geist_Bold.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
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
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <MenuItem position={[-2, 1, 0]} text="ABOUT" onClick={() => router.push("/about")} color="#006600" />
      <MenuItem position={[2, -1, 0]} text="AIRDROP" onClick={() => router.push("/airdrop")} color="#FF0000" />
      <Environment preset="city" />
    </>
  )
}

export default function Dashboard() {
  const router = useRouter()

  return (
    <div className="h-screen bg-gradient-to-br from-green-900 via-red-900 to-yellow-800 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 relative mr-3">
            <Image src="/portugalfi-logo.png" alt="PortugalFi Logo" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-white">PortugalFi</h1>
        </div>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>

      {/* 3D Menu */}
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-white/70 text-sm">Click on menu items to navigate</p>
      </div>
    </div>
  )
}
