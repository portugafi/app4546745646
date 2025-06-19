"use client"

import { useState, useEffect } from "react"
import { getAirdropContract, switchToWorldChain, checkWorldChainNetwork } from "@/lib/airdrop-contract"
import { ethers } from "ethers"

export function useAirdrop(userAddress?: string) {
  const [canClaim, setCanClaim] = useState(false)
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0)
  const [contractBalance, setContractBalance] = useState("0")
  const [userBalance, setUserBalance] = useState("0")
  const [dailyAmount, setDailyAmount] = useState("50")
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [lastClaimTime, setLastClaimTime] = useState(0)
  const [error, setError] = useState<string>("")
  const [networkError, setNetworkError] = useState<string>("")

  useEffect(() => {
    if (userAddress) {
      loadData()
      const interval = setInterval(loadData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [userAddress])

  const loadData = async () => {
    if (!userAddress) return

    try {
      setLoading(true)
      setError("")
      setNetworkError("")

      console.log("🔄 Loading airdrop data for:", userAddress)

      // Buscar status do airdrop
      const [statusResponse, balanceResponse] = await Promise.all([
        fetch(`/api/airdrop/status?address=${userAddress}`),
        fetch(`/api/airdrop/balance?userAddress=${userAddress}`),
      ])

      if (!statusResponse.ok) {
        throw new Error("Failed to fetch airdrop status from World Chain")
      }

      if (!balanceResponse.ok) {
        throw new Error("Failed to fetch balances from World Chain")
      }

      const statusData = await statusResponse.json()
      const balanceData = await balanceResponse.json()

      console.log("📊 Airdrop status:", statusData)
      console.log("💰 Balances:", balanceData)

      if (!statusData.success) {
        throw new Error(statusData.error || "Failed to fetch airdrop status")
      }

      if (!balanceData.success) {
        throw new Error(balanceData.error || "Failed to fetch balances")
      }

      setCanClaim(statusData.canClaim)
      setTimeUntilNextClaim(statusData.timeRemaining)
      setDailyAmount(statusData.airdropAmount)
      setLastClaimTime(statusData.lastClaimTime)
      setContractBalance(balanceData.contractBalance)
      setUserBalance(balanceData.userBalance || "0")
    } catch (error) {
      console.error("❌ Error loading airdrop data:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load data"

      if (errorMessage.includes("World Chain")) {
        setNetworkError(errorMessage)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const claimAirdrop = async () => {
    if (!userAddress) {
      throw new Error("User address not provided")
    }

    try {
      setClaiming(true)
      setError("")
      setNetworkError("")

      console.log("🎯 Starting claim process for:", userAddress)

      // Verificar se temos MetaMask
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("Please install MetaMask or use World App")
      }

      // Conectar carteira
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Verificar se estamos na World Chain
      const provider = new ethers.BrowserProvider(window.ethereum)
      const isCorrectNetwork = await checkWorldChainNetwork(provider)

      if (!isCorrectNetwork) {
        console.log("🔄 Switching to World Chain...")
        await switchToWorldChain()

        // Aguardar um pouco para a rede trocar
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      // Obter contrato com signer
      const contract = await getAirdropContract(true)

      console.log("🎯 Calling claimAirdrop on contract...")
      const tx = await contract.claimAirdrop()

      console.log("⏳ Transaction sent:", tx.hash)
      console.log("⏳ Waiting for confirmation...")

      // Aguardar confirmação
      const receipt = await tx.wait()
      console.log("✅ Transaction confirmed!", receipt)

      // Registrar o claim na API
      try {
        await fetch("/api/airdrop/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAddress,
            txHash: tx.hash,
          }),
        })
      } catch (apiError) {
        console.warn("⚠️ Failed to record claim in API:", apiError)
      }

      // Recarregar dados após 3 segundos
      setTimeout(() => {
        loadData()
      }, 3000)

      return tx.hash
    } catch (error: any) {
      console.error("❌ Error claiming airdrop:", error)

      let errorMessage = "Failed to claim airdrop"

      if (error.message?.includes("Wait 24h between claims")) {
        errorMessage = "You must wait 24 hours between claims"
      } else if (error.message?.includes("Transfer failed")) {
        errorMessage = "Contract has insufficient TPF tokens"
      } else if (error.message?.includes("user rejected") || error.code === 4001) {
        errorMessage = "Transaction was rejected by user"
      } else if (error.message?.includes("MetaMask") || error.message?.includes("World App")) {
        errorMessage = error.message
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    } finally {
      setClaiming(false)
    }
  }

  // Convert seconds to time object
  const getTimeLeft = () => {
    const days = Math.floor(timeUntilNextClaim / (24 * 60 * 60))
    const hours = Math.floor((timeUntilNextClaim % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((timeUntilNextClaim % (60 * 60)) / 60)
    const seconds = timeUntilNextClaim % 60

    return { days, hours, minutes, seconds }
  }

  return {
    canClaim,
    timeLeft: getTimeLeft(),
    contractBalance,
    userBalance,
    dailyAmount,
    loading,
    claiming,
    lastClaimTime,
    error,
    networkError,
    claimAirdrop,
    refreshData: loadData,
    switchToWorldChain,
  }
}
