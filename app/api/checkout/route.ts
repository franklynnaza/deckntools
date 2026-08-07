import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Card payments via Stripe are disabled in this project.
  return NextResponse.json({ error: "Card payments are disabled" }, { status: 501 })
}
