export interface MiniKitWalletAuthPayload {
  address: string
  message: string
  signature: string
  nonce: string
}

export interface MiniKitTransactionPayload {
  transactionId: string
  status: "success" | "error"
  message?: string
}

export interface AirdropContract {
  address: string
  abi: any[]
}

export interface PTFToken {
  address: string
  symbol: string
  decimals: number
}
