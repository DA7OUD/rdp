import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { address, currency } = await request.json()

    if (!address || !currency) {
      return NextResponse.json({ error: "Address and currency are required" }, { status: 400 })
    }

    const newWallet = await sql`
      INSERT INTO public.wallets (id, address, currency, is_admin_wallet)
      VALUES (${uuidv4()}, ${address}, ${currency}, TRUE)
      RETURNING id, address, currency, created_at;
    `

    return NextResponse.json({ message: "Admin wallet registered successfully", wallet: newWallet[0] }, { status: 201 })
  } catch (error: any) {
    // Log the full error for debugging
    console.error("Error in POST /api/admin/wallets:", error)
    if (
      error.message &&
      error.message.includes('duplicate key value violates unique constraint "wallets_address_key"')
    ) {
      return NextResponse.json({ error: "Wallet address already registered" }, { status: 409 })
    }
    // Return a more informative error message to the client
    return NextResponse.json(
      { error: "Failed to register admin wallet", details: error.message || "An unknown error occurred." },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const wallets = await sql`
      SELECT id, address, currency, created_at
      FROM public.wallets
      WHERE is_admin_wallet = TRUE;
    `
    return NextResponse.json(wallets, { status: 200 })
  } catch (error: any) {
    // Log the full error for debugging
    console.error("Error in GET /api/admin/wallets:", error)
    // Return a more informative error message to the client
    return NextResponse.json(
      { error: "Failed to fetch admin wallets", details: error.message || "An unknown error occurred." },
      { status: 500 },
    )
  }
}
