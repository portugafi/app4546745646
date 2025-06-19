import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userAddress, txHash } = data

    if (!userAddress || !txHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters",
        },
        { status: 400 },
      )
    }

    console.log(`📝 Recording claim for address: ${userAddress}, tx: ${txHash}`)

    // Aqui você pode salvar o claim em um banco de dados se necessário
    // Por enquanto, apenas retornamos sucesso

    return NextResponse.json({
      success: true,
      message: "Claim recorded successfully",
      txHash,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error recording claim:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to record claim",
      },
      { status: 500 },
    )
  }
}
