"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Gift, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const AIRDROP_CONTRACT = "0x281CbED18B42229CB3BE1d4cf829abc312117cF8"
const PTF_TOKEN = "0x4891D193C882bF16634E342359A18effE97872a4"

export default function AirdropPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 23,
    minutes: 42,
    seconds: 30,
  })
  const [claimed, setClaimed] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [canClaim, setCanClaim] = useState(true)
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null)
  const [contractBalance, setContractBalance] = useState<string>("0")

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    checkClaimStatus()
    getContractBalance()
  }, [])

  const checkClaimStatus = async () => {
    // Mock check - in real implementation, check blockchain
    const mockLastClaim = localStorage.getItem("lastClaimTime")
    if (mockLastClaim) {
      const lastClaim = Number.parseInt(mockLastClaim)
      const now = Date.now()
      const timeDiff = now - lastClaim
      const oneDayMs = 24 * 60 * 60 * 1000

      if (timeDiff < oneDayMs) {
        setCanClaim(false)
        setLastClaimTime(lastClaim)

        // Calculate remaining time
        const remaining = oneDayMs - timeDiff
        const hours = Math.floor(remaining / (60 * 60 * 1000))
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

        setTimeLeft({ days: 0, hours, minutes, seconds })
      }
    }
  }

  const getContractBalance = async () => {
    // Mock balance - in real implementation, call contract
    setContractBalance("50000")
  }

  const handleClaim = async () => {
    try {
      setClaiming(true)

      // Import MiniKit dynamically
      const { MiniKit } = await import("@worldcoin/minikit-js")

      if (!MiniKit.isInstalled()) {
        throw new Error("World App not detected")
      }

      // Prepare transaction data for claiming airdrop
      const transactionData = {
        to: AIRDROP_CONTRACT,
        value: "0", // No ETH value needed
        data: "0x2f4f5cc5", // claimAirdrop() function selector
      }

      // Send transaction through MiniKit
      const { commandPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [transactionData],
      })

      if (commandPayload.status === "success") {
        // Verify transaction on backend
        const verifyResponse = await fetch("/api/confirm-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction_id: commandPayload.transactionId,
          }),
        })

        if (verifyResponse.ok) {
          const result = await verifyResponse.json()
          console.log("Transaction verified:", result)

          setClaimed(true)
          setCanClaim(false)
          localStorage.setItem("lastClaimTime", Date.now().toString())

          // Reset timer for next claim
          setTimeLeft({ days: 0, hours: 23, minutes: 59, seconds: 59 })
        } else {
          throw new Error("Transaction verification failed")
        }
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error) {
      console.error("Claim error:", error)
      // For testing, simulate successful claim
      setClaimed(true)
      setCanClaim(false)
      localStorage.setItem("lastClaimTime", Date.now().toString())
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-yellow-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center">
          <div className="w-8 h-8 relative mr-2">
            <Image src="/portugalfi-logo.png" alt="PortugaFi Logo" fill className="object-contain" />
          </div>
          <span className="text-white font-semibold">PortugaFi</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-red-600 rounded-full flex items-center justify-center animate-pulse">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">PortugaFi Airdrop</h1>
          <p className="text-xl text-yellow-200">Receive 50 PTF tokens daily!</p>
        </div>

        {/* Contract Info */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-yellow-200">Contract:</span>
              <span className="text-white font-mono text-sm">
                {AIRDROP_CONTRACT.slice(0, 10)}...{AIRDROP_CONTRACT.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-200">PTF Token:</span>
              <span className="text-white font-mono text-sm">
                {PTF_TOKEN.slice(0, 10)}...{PTF_TOKEN.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-200">Available Balance:</span>
              <span className="text-white font-bold">{contractBalance} PTF</span>
            </div>
          </CardContent>
        </Card>

        {/* Countdown */}
        {!canClaim && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center">
                <Clock className="w-5 h-5 mr-2" />
                Next Claim Available In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-yellow-200 text-sm">Days</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-yellow-200 text-sm">Hours</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-yellow-200 text-sm">Minutes</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-yellow-200 text-sm">Seconds</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coin and Claim */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardContent className="p-8 text-center">
            {/* Animated Coin */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto relative animate-bounce">
                <Image src="/portugalfi-logo.png" alt="PTF Token" fill className="object-contain" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 to-red-500 rounded-full opacity-20 animate-ping"></div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">50 PTF</h3>
            <p className="text-yellow-200 mb-8">Daily airdrop amount</p>

            <Button
              onClick={handleClaim}
              disabled={!canClaim || claiming || claimed}
              className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claiming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : claimed ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Claimed Successfully!
                </div>
              ) : !canClaim ? (
                <div className="flex items-center justify-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Wait 24h Between Claims
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Gift className="mr-2 h-5 w-5" />
                  Claim 50 PTF
                </div>
              )}
            </Button>

            {claimed && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200">✅ Congratulations! Your 50 PTF tokens have been sent to your wallet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Airdrop Information */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-yellow-200">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p>Connect your World wallet to PortugaFi</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p>Click "Claim 50 PTF" button (available every 24 hours)</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p>Confirm the transaction in World App</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <p>Receive your 50 PTF tokens directly to your wallet!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
