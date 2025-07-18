import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { userId, sendAmount, sendCurrency, receiveAmount, receiveCurrency, recipientAddress } = await request.json()

    if (!userId || !sendAmount || !sendCurrency || !receiveAmount || !receiveCurrency || !recipientAddress) {
      return NextResponse.json({ error: "All order details are required" }, { status: 400 })
    }

    const newOrder = await sql`
      INSERT INTO public.orders (id, user_id, send_amount, send_currency, receive_amount, receive_currency, recipient_address, status)
      VALUES (${uuidv4()}, ${userId}, ${sendAmount}, ${sendCurrency}, ${receiveAmount}, ${receiveCurrency}, ${recipientAddress}, 'pending')
      RETURNING id, created_at, status;
    `

    return NextResponse.json({ message: "Order placed successfully", order: newOrder[0] }, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/orders:", error)
    return NextResponse.json(
      { error: "Failed to place order", details: error.message || "An unknown error occurred." },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const orders = await sql`
      SELECT id, created_at, send_amount, send_currency, receive_amount, receive_currency, recipient_address, status
      FROM public.orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `
    return NextResponse.json(orders, { status: 200 })
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch user orders", details: error.message || "An unknown error occurred." },
      { status: 500 },
    )
  }
}
