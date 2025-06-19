import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { airdropContractABI, AIRDROP_CONTRACT_ADDRESS, RPC_ENDPOINTS } from "@/lib/airdrop-contract-abi"

export async function GET() {
  try {
    console.log(`💰 API: Fetching contract balance from address: ${AIRDROP_CONTRACT_ADDRESS}`)

    // Tentar cada RPC até encontrar um que funcione
    let lastError = null

    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        console.log(`🌐 API: Trying RPC endpoint: ${rpcUrl}`)

        // Criar provider com configuração otimizada
        const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
          staticNetwork: true,
        })

        // Testar conectividade primeiro
        try {
          await Promise.race([
            provider.getBlockNumber(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("RPC timeout")), 8000)),
          ])
        } catch (connectError) {
          console.log(`❌ API: RPC ${rpcUrl} connection failed:`, connectError.message)
          continue
        }

        // Verificar se o contrato existe
        const code = await provider.getCode(AIRDROP_CONTRACT_ADDRESS)
        if (code === "0x") {
          console.log(`❌ API: Contract not found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)
          continue // Tentar próximo RPC
        }

        console.log(`✅ API: Contract found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)

        const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, airdropContractABI, provider)

        const balance = await Promise.race([
          contract.contractBalance(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Contract call timeout")), 12000)),
        ])

        const formattedBalance = ethers.formatUnits(balance, 18)

        console.log(`💰 API: Contract balance: ${formattedBalance} TPF`)

        return NextResponse.json({
          success: true,
          balance: formattedBalance,
          contractBalance: formattedBalance, // Adicionar campo alternativo
          rpcUsed: rpcUrl,
        })
      } catch (error) {
        console.error(`❌ API: Error with RPC ${rpcUrl}:`, error.message)
        lastError = error
        // Continuar para o próximo RPC
      }
    }

    // Se chegamos aqui, nenhum RPC funcionou
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to World Chain network",
        details: `All RPC endpoints failed. Last error: ${lastError?.message || "Unknown error"}`,
        endpoints: RPC_ENDPOINTS,
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("💥 API: Error fetching airdrop contract balance:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while fetching contract balance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
