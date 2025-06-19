import { ethers } from "ethers"
import { MiniKit } from "@worldcoin/minikit-js"
import { AIRDROP_CONTRACT_ADDRESS, RPC_ENDPOINTS, airdropContractABI } from "./airdrop-contract-abi"

// Função para obter o status do airdrop para um endereço
export async function getAirdropStatus(address: string) {
  try {
    // Tentar cada RPC até encontrar um que funcione
    let lastError = null

    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        // Criar provider com timeout
        const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
          staticNetwork: true,
        })

        // Testar conectividade primeiro
        try {
          await Promise.race([
            provider.getBlockNumber(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("RPC timeout")), 10000)),
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
            new Promise((_, reject) => setTimeout(() => reject(new Error("Contract call timeout")), 15000)),
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

          return {
            success: true,
            lastClaimTime: Number(lastClaimTime),
            nextClaimTime: nextClaimTime,
            canClaim: canClaim,
            timeRemaining: timeRemaining,
            airdropAmount: ethers.formatUnits(dailyAirdrop, 18),
            rpcUsed: rpcUrl,
          }
        } catch (contractError) {
          // Se é um erro de revert, tentar com valores padrão
          if (
            contractError.message.includes("execution reverted") ||
            contractError.message.includes("require(false)")
          ) {
            return {
              success: true,
              lastClaimTime: 0,
              nextClaimTime: 0,
              canClaim: true, // Novo endereço pode fazer claim
              timeRemaining: 0,
              airdropAmount: "50", // Valor padrão
              rpcUsed: rpcUrl,
              fallback: true,
            }
          }

          throw contractError
        }
      } catch (error) {
        lastError = error
        // Continuar para o próximo RPC
      }
    }

    // Se chegamos aqui, nenhum RPC funcionou
    throw new Error(`All RPC endpoints failed. Last error: ${lastError?.message || "Unknown error"}`)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch airdrop status from World Chain",
    }
  }
}

// Função para obter o saldo do contrato
export async function getContractBalance() {
  try {
    // Tentar cada RPC até encontrar um que funcione
    let lastError = null

    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        // Criar provider com timeout
        const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
          staticNetwork: true,
        })

        // Testar conectividade primeiro
        try {
          await Promise.race([
            provider.getBlockNumber(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("RPC timeout")), 10000)),
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

        const balance = await Promise.race([
          contract.contractBalance(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Contract call timeout")), 15000)),
        ])

        const formattedBalance = ethers.formatUnits(balance, 18)

        return {
          success: true,
          balance: formattedBalance,
          rpcUsed: rpcUrl,
        }
      } catch (error) {
        lastError = error
        // Continuar para o próximo RPC
      }
    }

    // Se chegamos aqui, nenhum RPC funcionou
    throw new Error(`All RPC endpoints failed. Last error: ${lastError?.message || "Unknown error"}`)
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch contract balance from World Chain",
      details: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Função para reivindicar o airdrop
export async function claimAirdrop(address: string) {
  try {
    if (!MiniKit.isInstalled()) {
      throw new Error("MiniKit is not installed. Please use World App to claim.")
    }

    try {
      // Usar o MiniKit para enviar a transação
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: AIRDROP_CONTRACT_ADDRESS,
            abi: airdropContractABI,
            functionName: "claimAirdrop",
            args: [],
          },
        ],
      })

      if (finalPayload.status === "error") {
        throw new Error(finalPayload.message || "Failed to claim airdrop")
      }

      return {
        success: true,
        txId: finalPayload.transaction_id,
        message: "Airdrop claimed successfully!",
      }
    } catch (error) {
      throw error
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during the claim",
    }
  }
}
