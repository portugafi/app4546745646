import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MiniKitProvider } from "@/components/minikit-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NAVEW - Next-Generation Digital Currency Platform",
  description:
    "NAVEW (NVW) represents the spirit of innovation, digital sovereignty and Portuguese national pride on WorldChain",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  )
}
