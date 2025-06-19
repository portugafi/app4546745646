"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"

interface MiniKitContextType {
  minikit: any | null // Holds the SDK namespace once loaded
  isInstalled: boolean // True when running inside the World App
}

export const MiniKitContext = createContext<MiniKitContextType>({
  minikit: null,
  isInstalled: false,
})

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [minikit, setMinikit] = useState<any | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return // SSR guard

    // Optional: rudimentary World App sniffing (can be improved)
    const isWorldApp = navigator.userAgent.includes("WorldApp")
    if (!isWorldApp) return // Don’t even try to load MiniKit in a normal browser
    ;(async () => {
      try {
        // Dynamic import so the file is never evaluated unless we’re really in World App
        const mod = await import("@worldcoin/minikit-js")
        const MiniKit = (mod as any).MiniKit ?? (mod as any).default
        if (!MiniKit) throw new Error("MiniKit export not found")

        setIsInstalled(MiniKit.isInstalled?.() ?? false)
        setMinikit(MiniKit)
      } catch (err) {
        console.error("MiniKit dynamic-import failed:", err)
      }
    })()
  }, [])

  return <MiniKitContext.Provider value={{ minikit, isInstalled }}>{children}</MiniKitContext.Provider>
}
