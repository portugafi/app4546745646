import { NextResponse } from "next/server"
import { ethers } from "ethers"
import { airdropContractABI, AIRDROP_CONTRACT_ADDRESS, RPC_ENDPOINTS } from "@/lib/airdrop-contract-abi"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: "Address parameter is required",
        },
        { status: 400 },
      )
    }

    // Tentar cada RPC até encontrar um que funcione
    let lastError = null

    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        // Criar provider com configuração otimizada
        const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
          staticNetwork: true,
        })

        // Testar conectividade primeiro com timeout menor
        try {
          await Promise.race([
            provider.getBlockNumber(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("RPC timeout")), 8000)),
          ])
        } catch (connectError) {
          continue
        }

        // Verificar se o contrato existe
        const code = await provider.getCode(AIRDROP_CONTRACT_ADDRESS)
        if (code === "0x") {
          continue // Tentar próximo RPC
        }

        const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, airdropContractABI, provider)

        // Buscar dados do contrato com tratamento de erro específico
        try {
          const [lastClaimTime, claimInterval, dailyAirdrop] = await Promise.race([
            Promise.all([contract.lastClaimTime(address), contract.CLAIM_INTERVAL(), contract.DAILY_AIRDROP()]),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Contract call timeout")), 12000)),
          ])

          // Tentar canClaim separadamente com fallback
          let canClaim = false
          try {
            canClaim = await contract.canClaim(address)
          } catch (canClaimError) {
            // Calcular manualmente se pode fazer claim
            const now = Math.floor(Date.now() / 1000)
            const timeSinceLastClaim = now - Number(lastClaimTime)
            canClaim = timeSinceLastClaim >= Number(claimInterval)
          }

          const now = Math.floor(Date.now() / 1000)
          const nextClaimTime = Number(lastClaimTime) + Number(claimInterval)
          const timeRemaining = canClaim ? 0 : Math.max(0, nextClaimTime - now)

          return NextResponse.json({
            success: true,
            lastClaimTime: Number(lastClaimTime),
            nextClaimTime: nextClaimTime,
            canClaim: canClaim,
            timeRemaining: timeRemaining,
            airdropAmount: ethers.formatUnits(dailyAirdrop, 18),
            rpcUsed: rpcUrl,
          })
        } catch (contractError) {
          // Se é um erro de revert, tentar com valores padrão
          if (
            contractError.message.includes("execution reverted") ||
            contractError.message.includes("require(false)")
          ) {
            return NextResponse.json({
              success: true,
              lastClaimTime: 0,
              nextClaimTime: 0,
              canClaim: true, // Novo endereço pode fazer claim
              timeRemaining: 0,
              airdropAmount: "50", // Valor padrão
              rpcUsed: rpcUrl,
              fallback: true,
            })
          }

          throw contractError
        }
      } catch (error) {
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
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while fetching airdrop status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
