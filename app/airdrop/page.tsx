"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, AlertCircle, Wallet, RefreshCw, Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"
import { getAirdropStatus, getContractBalance, claimAirdrop } from "@/lib/airdrop-service"

export default function AirdropPage() {
  const router = useRouter()
  const [userAddress, setUserAddress] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [canClaim, setCanClaim] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [contractBalance, setContractBalance] = useState("0")
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)
  const [txId, setTxId] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [formattedBalance, setFormattedBalance] = useState<string>("0")
  const [user, setUser] = useState<any>(null)
  const [dailyAmount, setDailyAmount] = useState("50")
  const [hasClaimed, setHasClaimed] = useState(false)

  useEffect(() => {
    getUserAddress()
  }, [])

  const getUserAddress = async () => {
    try {
      // First try to get from session
      const response = await fetch("/api/session")
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated && data.user?.walletAddress) {
          setUser(data.user)
          setUserAddress(data.user.walletAddress)
          setWalletConnected(true)
          return
        }
      }

      // If no session, try to get from wallet
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setUserAddress(accounts[0])
          setWalletConnected(true)
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }

  // Fetch contract balance
  const fetchContractBalance = async () => {
    try {
      setIsRefreshingBalance(true)

      const balanceData = await getContractBalance()

      if (balanceData.success) {
        setContractBalance(balanceData.balance)
        setFormattedBalance(Number(balanceData.balance).toLocaleString())
        setApiError(null)
      } else {
        setApiError(balanceData.error || "Failed to fetch contract balance")
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to fetch contract balance")
    } finally {
      setIsRefreshingBalance(false)
    }
  }

  // Check claim status
  const checkClaimStatus = async () => {
    if (!userAddress) return

    try {
      setIsLoading(true)

      const statusData = await getAirdropStatus(userAddress)

      if (statusData.success) {
        setCanClaim(statusData.canClaim && !hasClaimed)
        setDailyAmount(statusData.airdropAmount)
        setApiError(null)

        if (!statusData.canClaim || hasClaimed) {
          const timeRemainingSeconds = statusData.timeRemaining || 0

          if (timeRemainingSeconds > 0) {
            const hours = Math.floor(timeRemainingSeconds / 3600)
            const minutes = Math.floor((timeRemainingSeconds % 3600) / 60)
            const seconds = timeRemainingSeconds % 60

            setTimeLeft({ hours, minutes, seconds })
          } else if (!hasClaimed) {
            setTimeout(checkClaimStatus, 1000)
          }
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        }
      } else {
        setApiError(statusData.error || "Failed to fetch airdrop status")
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to check claim status")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userAddress) {
      checkClaimStatus()
      fetchContractBalance()
    }
  }, [userAddress, hasClaimed])

  // Update countdown every second
  useEffect(() => {
    if (canClaim || hasClaimed) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          if (!hasClaimed) {
            checkClaimStatus()
          }
          return prev
        } else if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [canClaim, hasClaimed])

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          setUserAddress(accounts[0])
          setWalletConnected(true)
          setError("")
        }
      } else {
        setError("Please install MetaMask or use World App")
      }
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
    }
  }

  // Handle claim
  const handleClaim = async () => {
    if (!canClaim || isClaiming || hasClaimed) return

    try {
      setIsClaiming(true)
      setClaimError(null)
      setClaimSuccess(false)
      setTxId(null)
      setError("")
      setSuccess("")

      if (!walletConnected) {
        await connectWallet()
        return
      }

      // Call the claimAirdrop function
      const result = await claimAirdrop(userAddress)

      if (result.success) {
        setClaimSuccess(true)
        setSuccess(`Airdrop claimed successfully! TX: ${result.txId?.slice(0, 10)}...`)
        setTxId(result.txId)
        setHasClaimed(true) // Bloquear o botão após claim
        setCanClaim(false)

        // Set 24h countdown
        setTimeLeft({ hours: 24, minutes: 0, seconds: 0 })

        // Update balance after successful claim
        setTimeout(async () => {
          await fetchContractBalance()
        }, 2000)

        // Clear success message after 5 seconds
        setTimeout(() => {
          setClaimSuccess(false)
          setSuccess("")
        }, 5000)
      } else {
        setClaimError(result.error || "Failed to claim tokens. Please try again.")
        setError(result.error || "Failed to claim airdrop")
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during the claim. Please try again."
      setClaimError(errorMessage)
      setError(errorMessage)
    } finally {
      setIsClaiming(false)
    }
  }

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time
  }

  const formatBalance = (balance: string) => {
    const num = Number.parseFloat(balance)
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const isButtonDisabled = () => {
    if (isClaiming || isLoading || hasClaimed) return true
    if (!walletConnected) return false // Allow clicking to connect
    if (apiError) return false // Allow retry on error
    return !canClaim // Only disable if cannot claim
  }

  const getButtonText = () => {
    if (isClaiming) return "Processing..."
    if (!walletConnected) return "Connect Wallet"
    if (apiError) return "Retry Connection"
    if (isLoading) return "Loading..."
    if (hasClaimed || (!canClaim && timeLeft.hours + timeLeft.minutes + timeLeft.seconds > 0)) {
      return "Wait 24h Between Claims"
    }
    return `Claim ${dailyAmount} TPF`
  }

  if (isLoading && userAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-yellow-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading from World Chain...</div>
          <div className="text-yellow-200 text-sm mt-2">Connecting to contract...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-6 pb-20 overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-yellow-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full max-w-md px-4">
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
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/portugalfi-logo-nYrlfOrZ7lrgx26ivt1whF48Ts33tk.png"
              alt="PortugaFi Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-white font-semibold">PortugaFi</span>
        </div>
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4 relative z-10"
      >
        <h1 className="text-3xl font-bold tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
            PTF Airdrop
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Claim your daily PTF tokens</p>
      </motion.div>

      {/* Contract Info */}
      {walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md px-4 mb-4 relative z-10"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Available for Airdrop</span>
              <div className="flex items-center">
                <span className="text-white font-medium">{formatBalance(contractBalance)}</span>
                <span className="text-gray-400 text-xs ml-1">PTF</span>
                <button
                  onClick={fetchContractBalance}
                  disabled={isRefreshingBalance}
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshingBalance ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
            {(!canClaim || hasClaimed) && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">Next Claim In</span>
                <span className="text-white font-medium">
                  {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 3D Logo - Reduzido */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full h-[150px] relative z-10 border border-gray-800/30 rounded-lg overflow-hidden max-w-md mx-4"
      >
        <div className="relative h-full flex items-center justify-center">
          <div className="w-24 h-24 mx-auto relative animate-bounce">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/portugalfi-logo-nYrlfOrZ7lrgx26ivt1whF48Ts33tk.png"
              alt="TPF Token"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-red-500 rounded-full opacity-20 animate-ping"></div>
        </div>
      </motion.div>

      {/* Claim Button - Movido para cima */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="-mt-4 relative z-10"
      >
        <button
          className={`w-56 py-3 px-5 rounded-full ${
            canClaim && walletConnected && !apiError && !isLoading && !hasClaimed
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-400"
              : !walletConnected || apiError
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-blue-400"
                : "bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400 border-gray-600"
          } font-bold text-xs shadow-lg border relative overflow-hidden hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          onClick={handleClaim}
          disabled={isButtonDisabled()}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b ${canClaim && walletConnected && !hasClaimed ? "from-white/30" : "from-white/10"} to-transparent opacity-70`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent ${canClaim && walletConnected && !hasClaimed ? "animate-shine" : ""}`}
          />
          <div className="relative flex items-center justify-center gap-2">
            {isClaiming ? (
              <>
                <div className="w-4 h-4 border-2 border-t-gray-800 border-gray-400 rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : !walletConnected ? (
              <>
                <Wallet className="w-3 h-3" />
                Connect Wallet
              </>
            ) : (
              <>
                <Coins className="w-3 h-3" />
                {getButtonText()}
              </>
            )}
          </div>
        </button>
      </motion.div>

      {/* Success Message */}
      {(claimSuccess || success) && (
        <div className="mt-4 p-2 bg-green-900/30 border border-green-500/30 rounded-lg text-center max-w-md mx-4">
          <div className="flex items-center justify-center">
            <CheckCircle className="mr-1 text-green-400" size={16} />
            <span className="font-medium text-green-400 text-sm">{success || "Tokens claimed successfully!"}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(claimError || error || apiError) && (
        <div className="mt-4 p-2 bg-red-900/30 border border-red-500/30 rounded-lg text-center max-w-md mx-4">
          <div className="flex items-center justify-center">
            <AlertCircle className="mr-1 text-red-400" size={16} />
            <span className="text-red-400 text-sm">{claimError || error || apiError}</span>
          </div>
        </div>
      )}

      {user && <BottomNavigation />}
    </main>
  )
}
