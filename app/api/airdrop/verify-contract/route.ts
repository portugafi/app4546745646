import { NextResponse } from "next/server"
import { getAirdropContract, AIRDROP_CONTRACT_ADDRESS } from "@/lib/airdrop-contract"

export async function GET() {
  try {
    console.log(`🔍 Verifying contract at: ${AIRDROP_CONTRACT_ADDRESS}`)

    // Obter contrato real
    const contract = await getAirdropContract()

    // Verificar se o contrato existe
    const provider = contract.runner?.provider
    if (!provider) {
      throw new Error("No provider available")
    }

    const code = await provider.getCode(AIRDROP_CONTRACT_ADDRESS)
    if (code === "0x") {
      throw new Error("Contract not found at the specified address")
    }

    console.log("✅ Contract exists, verifying functions...")

    // Testar funções do contrato
    const verificationResults: any = {
      contractExists: true,
      address: AIRDROP_CONTRACT_ADDRESS,
      functions: {},
    }

    try {
      const claimInterval = await contract.CLAIM_INTERVAL()
      verificationResults.functions.CLAIM_INTERVAL = Number(claimInterval)
      console.log(`✅ CLAIM_INTERVAL: ${Number(claimInterval)} seconds`)
    } catch (error) {
      console.error("❌ CLAIM_INTERVAL failed:", error)
      verificationResults.functions.CLAIM_INTERVAL = "ERROR"
    }

    try {
      const dailyAirdrop = await contract.DAILY_AIRDROP()
      verificationResults.functions.DAILY_AIRDROP = (Number(dailyAirdrop) / 1e18).toString()
      console.log(`✅ DAILY_AIRDROP: ${Number(dailyAirdrop) / 1e18} TPF`)
    } catch (error) {
      console.error("❌ DAILY_AIRDROP failed:", error)
      verificationResults.functions.DAILY_AIRDROP = "ERROR"
    }

    try {
      const owner = await contract.owner()
      verificationResults.functions.owner = owner
      console.log(`✅ Owner: ${owner}`)
    } catch (error) {
      console.error("❌ Owner failed:", error)
      verificationResults.functions.owner = "ERROR"
    }

    try {
      const tpfToken = await contract.tpfToken()
      verificationResults.functions.tpfToken = tpfToken
      console.log(`✅ TPF Token: ${tpfToken}`)
    } catch (error) {
      console.error("❌ tpfToken failed:", error)
      verificationResults.functions.tpfToken = "ERROR"
    }

    // Tentar obter saldo do contrato
    try {
      const balance = await contract.getContractBalance()
      verificationResults.functions.contractBalance = (Number(balance) / 1e18).toString()
      console.log(`✅ Contract Balance: ${Number(balance) / 1e18} TPF`)
    } catch (error) {
      console.error("❌ getContractBalance failed:", error)
      verificationResults.functions.contractBalance = "ERROR"
    }

    // Verificar se pelo menos as funções básicas funcionam
    const criticalFunctions = ["CLAIM_INTERVAL", "DAILY_AIRDROP", "owner"]
    const workingFunctions = criticalFunctions.filter((func) => verificationResults.functions[func] !== "ERROR")

    verificationResults.isValid = workingFunctions.length >= 2
    verificationResults.workingFunctions = workingFunctions.length
    verificationResults.totalFunctions = Object.keys(verificationResults.functions).length

    return NextResponse.json({
      success: true,
      ...verificationResults,
    })
  } catch (error) {
    console.error("❌ Contract verification failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Contract verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        address: AIRDROP_CONTRACT_ADDRESS,
      },
      { status: 500 },
    )
  }
}
