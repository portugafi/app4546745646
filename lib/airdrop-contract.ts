import { ethers } from "ethers"

// Endereços corretos do contrato na World Chain
export const AIRDROP_CONTRACT_ADDRESS = "0x281CbED18B42229CB3BE1d4cf829abc312117cF8"
export const TPF_TOKEN_ADDRESS = "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45"

// World Chain Network Configuration
export const WORLD_CHAIN_MAINNET = {
  chainId: 480, // 0x1e0
  name: "World Chain",
  rpcUrl: "https://worldchain-mainnet.g.alchemy.com/public",
  blockExplorer: "https://worldscan.org",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
}

export const WORLD_CHAIN_TESTNET = {
  chainId: 4801, // 0x12C1
  name: "World Chain Sepolia",
  rpcUrl: "https://worldchain-sepolia.g.alchemy.com/public",
  blockExplorer: "https://worldchain-sepolia.explorer.alchemy.com",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
}

// Lista de RPCs para World Chain (mainnet e testnet)
export const RPC_ENDPOINTS = [WORLD_CHAIN_MAINNET.rpcUrl, WORLD_CHAIN_TESTNET.rpcUrl]

// ABI mais precisa do contrato de airdrop
export const airdropContractABI = [
  // Função para verificar se pode fazer claim
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "canClaim",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Função para fazer claim
  {
    inputs: [],
    name: "claimAirdrop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Último tempo de claim do usuário
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "lastClaimTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Intervalo entre claims (24h)
  {
    inputs: [],
    name: "CLAIM_INTERVAL",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Quantidade diária do airdrop
  {
    inputs: [],
    name: "DAILY_AIRDROP",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Saldo do contrato (função que retorna saldo real)
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Endereço do token TPF
  {
    inputs: [],
    name: "tpfToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  // Owner do contrato
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  // Event de claim
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "AirdropClaimed",
    type: "event",
  },
] as const

// TPF Token ABI
export const TPF_TOKEN_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Função para verificar se estamos na rede correta
export async function checkWorldChainNetwork(provider: ethers.Provider): Promise<boolean> {
  try {
    const network = await provider.getNetwork()
    const chainId = Number(network.chainId)
    return chainId === WORLD_CHAIN_MAINNET.chainId || chainId === WORLD_CHAIN_TESTNET.chainId
  } catch (error) {
    console.error("Error checking network:", error)
    return false
  }
}

// Função para adicionar World Chain ao MetaMask
export async function addWorldChainToWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found")
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${WORLD_CHAIN_MAINNET.chainId.toString(16)}`,
          chainName: WORLD_CHAIN_MAINNET.name,
          nativeCurrency: WORLD_CHAIN_MAINNET.nativeCurrency,
          rpcUrls: [WORLD_CHAIN_MAINNET.rpcUrl],
          blockExplorerUrls: [WORLD_CHAIN_MAINNET.blockExplorer],
        },
      ],
    })
  } catch (error) {
    console.error("Error adding World Chain to wallet:", error)
    throw error
  }
}

// Função para trocar para World Chain
export async function switchToWorldChain() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${WORLD_CHAIN_MAINNET.chainId.toString(16)}` }],
    })
  } catch (error: any) {
    // Se a rede não existe, adicionar ela
    if (error.code === 4902) {
      await addWorldChainToWallet()
    } else {
      throw error
    }
  }
}

// Criar uma instância do contrato
export const getAirdropContract = async (withSigner = false) => {
  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      console.log(`🔗 Trying RPC endpoint: ${rpcUrl}`)

      const provider = new ethers.JsonRpcProvider(rpcUrl)

      // Verificar se estamos na rede correta
      const isCorrectNetwork = await checkWorldChainNetwork(provider)
      if (!isCorrectNetwork) {
        console.log(`❌ Wrong network for RPC: ${rpcUrl}`)
        continue
      }

      // Verificar se o contrato existe
      const code = await provider.getCode(AIRDROP_CONTRACT_ADDRESS)
      if (code === "0x") {
        console.log(`❌ Contract not found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)
        continue
      }

      console.log(`✅ Contract found at ${AIRDROP_CONTRACT_ADDRESS} using RPC ${rpcUrl}`)

      if (withSigner && typeof window !== "undefined" && window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        const signer = await browserProvider.getSigner()
        const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, airdropContractABI, signer)
        const isValid = await verifyContract(contract)
        if (!isValid) {
          throw new Error("Contract verification failed")
        }
        return contract
      }

      const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, airdropContractABI, provider)
      const isValid = await verifyContract(contract)
      if (!isValid) {
        throw new Error("Contract verification failed")
      }
      return contract
    } catch (error) {
      console.error(`❌ Error with RPC ${rpcUrl}:`, error)
      continue
    }
  }

  throw new Error("Failed to connect to World Chain - no working RPC endpoints found")
}

// Obter contrato do token TPF
export const getTPFTokenContract = async () => {
  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl)

      // Verificar se estamos na rede correta
      const isCorrectNetwork = await checkWorldChainNetwork(provider)
      if (!isCorrectNetwork) {
        continue
      }

      // Verificar se o contrato existe
      const code = await provider.getCode(TPF_TOKEN_ADDRESS)
      if (code === "0x") {
        console.log(`❌ TPF Token contract not found at ${TPF_TOKEN_ADDRESS}`)
        continue
      }

      console.log(`✅ TPF Token contract found at ${TPF_TOKEN_ADDRESS}`)
      return new ethers.Contract(TPF_TOKEN_ADDRESS, TPF_TOKEN_ABI, provider)
    } catch (error) {
      console.error(`❌ Error with TPF token RPC ${rpcUrl}:`, error)
      continue
    }
  }

  throw new Error("Failed to connect to TPF Token contract")
}

// Função para verificar se o contrato existe e tem as funções corretas
export const verifyContract = async (contract: ethers.Contract): Promise<boolean> => {
  try {
    // Testar algumas funções básicas para verificar se é o contrato correto
    await contract.CLAIM_INTERVAL()
    await contract.DAILY_AIRDROP()
    console.log("✅ Contract verification successful")
    return true
  } catch (error) {
    console.error("❌ Contract verification failed:", error)
    return false
  }
}
