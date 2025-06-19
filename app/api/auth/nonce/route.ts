import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Expects only alphanumeric characters
    const nonce: string = crypto.randomUUID().replace(/-/g, "")

    // The nonce should be stored somewhere that is not tamperable by the client
    // Optionally you can HMAC the nonce with a secret key stored in your environment
    const cookieStore = await cookies()
    cookieStore.set("siwe", nonce, { secure: true })

    return NextResponse.json({ nonce })
  } catch (error) {
    console.error("Error generating nonce:", error)
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 })
  }
}
