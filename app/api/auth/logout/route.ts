import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("tpulsefi_session")
    cookieStore.delete("siwe")

    return NextResponse.json({ message: "Logged out" }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Logged out" }, { status: 200 })
  }
}
