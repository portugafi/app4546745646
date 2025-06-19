export interface User {
  id: string
  walletAddress: string
  authTime: string
}

export interface MiniAppWalletAuthSuccessPayload {
  address: string
  message: string
  signature: string
}

export interface AuthResponse {
  authenticated: boolean
  user?: User
}

export interface LoginRequest {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}
