"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Float } from "@react-three/drei"
import { useState, useRef, Suspense } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { useRouter } from "next/navigation"

function MenuItem({ position, text, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={position}>
        {/* Background cylinder */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
          scale={hovered ? 1.1 : 1}
        >
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial
            color={hovered ? "#ff4757" : "#2ed573"}
            emissive={hovered ? "#ff4757" : "#2ed573"}
            emissiveIntensity={0.2}
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>

        {/* 3D Text */}
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
          outlineWidth={0.02}
          outlineColor="#000000"
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          {text}
        </Text>
      </group>
    </Float>
  )
}

function Scene({ router }: any) {
  const menuItems = [
    { text: "About", key: "about", path: "/about" },
    { text: "Airdrop", key: "airdrop", path: "/airdrop" },
    { text: "Staking", key: "staking", path: "/staking" },
    { text: "Settings", key: "settings", path: "/settings" },
  ]

  return (
    <>
      {/* Strong lighting setup */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#ffffff" />

      {menuItems.map((item, index) => (
        <MenuItem
          key={item.key}
          position={[(index - 1.5) * 2.5, 0, 0]}
          text={item.text}
          onClick={() => router.push(item.path)}
        />
      ))}

      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} maxPolarAngle={Math.PI / 2} />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="h-32 w-full bg-black/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
      <div className="text-white">Loading 3D Menu...</div>
    </div>
  )
}

export default function Menu3D({ onLogout }: { onLogout: () => void }) {
  const router = useRouter()

  return (
    <div className="relative">
      {/* Menu Labels */}
      <div className="flex justify-center space-x-8 mb-4">
        {["About", "Airdrop", "Staking", "Settings"].map((label, index) => (
          <span
            key={label}
            className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            onClick={() => {
              const paths = ["/about", "/airdrop", "/staking", "/settings"]
              router.push(paths[index])
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* 3D Menu Canvas with Error Boundary */}
      <div className="h-32 w-full bg-black/10 rounded-lg backdrop-blur-sm">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [0, 2, 6], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            onError={(error) => {
              console.error("3D Canvas Error:", error)
            }}
          >
            <Scene router={router} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  )
}
