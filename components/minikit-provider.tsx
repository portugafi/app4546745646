"use client"

import { type ReactNode, useEffect } from "react"

export function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === "undefined") return

    // Check if we're in World App environment
    const isWorldApp =
      window.location.href.includes("worldapp://") ||
      navigator.userAgent.includes("WorldApp") ||
      navigator.userAgent.includes("MiniApp")

    if (!isWorldApp) {
      console.log("Not in World App environment, skipping MiniKit installation")
      return
    }

    try {
      // Configurar o MiniKit
      ;(async () => {
        const { MiniKit } = await import("@worldcoin/minikit-js")

        try {
          MiniKit.install({
            appId: process.env.NEXT_PUBLIC_APP_ID || "app_staging_b8e2b5b5c6b8e2b5b5c6b8e2",
            enableTelemetry: true,
          })
          console.log("MiniKit installed successfully")
        } catch (installError) {
          console.log("MiniKit install error (might be already installed):", installError)
        }
      })()
    } catch (error) {
      console.error("Error with MiniKit:", error)
    }
  }, [])

  return <>{children}</>
}
