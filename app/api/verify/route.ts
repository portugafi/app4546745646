import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { type MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export const POST = async (req: NextRequest) => {
  try {
    const { payload, nonce }: IRequestPayload = await req.json()

    const cookieStore = await cookies()
    const siweCookie = cookieStore.get("siwe")?.value

    if (nonce !== siweCookie) {
      return NextResponse.json({
        status: "error",
        isValid: false,
        message: "Invalid nonce",
      })
    }

    const validMessage = await verifySiweMessage(payload, nonce)
    return NextResponse.json({
      status: "success",
      isValid: validMessage.isValid,
    })
  } catch (error) {
    const err = error as Error
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: err.message,
    })
  }
}
