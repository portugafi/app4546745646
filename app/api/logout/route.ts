import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("tpulsefi_session")
    cookieStore.delete("siwe")

    // Adicionar esta linha para garantir que o localStorage também seja limpo no lado do cliente
    // Isso será executado via script no lado do cliente
    cookieStore.set("clear_local_storage", "true", {
      maxAge: 1, // Curta duração, apenas para sinalizar ao cliente
      path: "/",
    })

    return NextResponse.json({ message: "Logged out" }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
