"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Simulated crypto data and exchange rates (same as before)
const cryptocurrencies = [
  { id: "btc", name: "Bitcoin", symbol: "BTC" },
  { id: "eth", name: "Ethereum", symbol: "ETH" },
  { id: "usdt", name: "Tether", symbol: "USDT" },
  { id: "bnb", name: "Binance Coin", symbol: "BNB" },
  { id: "sol", name: "Solana", symbol: "SOL" },
]

const exchangeRates: { [key: string]: number } = {
  btc_eth: 15,
  btc_usdt: 60000,
  btc_bnb: 200,
  btc_sol: 400,

  eth_btc: 1 / 15,
  eth_usdt: 4000,
  eth_bnb: 13,
  eth_sol: 27,

  usdt_btc: 1 / 60000,
  usdt_eth: 1 / 4000,
  usdt_bnb: 1 / 300,
  usdt_sol: 1 / 150,

  bnb_btc: 1 / 200,
  bnb_eth: 1 / 13,
  bnb_usdt: 300,
  bnb_sol: 2,

  sol_btc: 1 / 400,
  sol_eth: 1 / 27,
  sol_usdt: 150,
  sol_bnb: 1 / 2,
}

export default function UserOrderForm({ userId = "a1b2c3d4-e5f6-7890-1234-567890abcdef" }: { userId?: string }) {
  const [sendAmount, setSendAmount] = useState<string>("0.01")
  const [receiveAmount, setReceiveAmount] = useState<string>("0.00")
  const [sendCrypto, setSendCrypto] = useState<string>("btc")
  const [receiveCrypto, setReceiveCrypto] = useState<string>("eth")
  const [recipientAddress, setRecipientAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const sendCurrency = sendCrypto // Declare sendCurrency variable
  const receiveCurrency = receiveCrypto // Declare receiveCurrency variable

  useEffect(() => {
    const calculateReceiveAmount = () => {
      const amount = Number.parseFloat(sendAmount)
      if (isNaN(amount) || amount <= 0) {
        setReceiveAmount("0.00")
        return
      }

      if (sendCrypto === receiveCrypto) {
        setReceiveAmount(amount.toFixed(4))
        return
      }

      const rateKey = `${sendCrypto}_${receiveCrypto}`
      const rate = exchangeRates[rateKey]

      if (rate) {
        setReceiveAmount((amount * rate).toFixed(4))
      } else {
        setReceiveAmount("N/A")
      }
    }
    calculateReceiveAmount()
  }, [sendAmount, sendCrypto, receiveCrypto])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const parsedSendAmount = Number.parseFloat(sendAmount)
    const parsedReceiveAmount = Number.parseFloat(receiveAmount)

    if (
      isNaN(parsedSendAmount) ||
      parsedSendAmount <= 0 ||
      isNaN(parsedReceiveAmount) ||
      parsedReceiveAmount <= 0 ||
      !recipientAddress
    ) {
      toast({
        title: "Validation Error",
        description: "Please ensure all fields are filled correctly and amounts are valid.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          sendAmount: parsedSendAmount,
          sendCurrency, // Use declared variable
          receiveAmount: parsedReceiveAmount,
          receiveCurrency, // Use declared variable
          recipientAddress,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Order Placed!",
          description: `Your order ${data.order.id} has been placed with status: ${data.order.status}.`,
        })
        // Reset form or navigate
        setSendAmount("0.01")
        setReceiveAmount("0.00")
        setRecipientAddress("")
      } else {
        toast({
          title: "Error!",
          description: data.error || "Failed to place order.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Error!",
        description: "An unexpected error occurred while placing your order.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Place New Order</CardTitle>
        <CardDescription>Exchange cryptocurrencies instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="send-amount">You send</Label>
            <div className="flex items-center gap-2">
              <Input
                id="send-amount"
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                min="0"
                step="0.0001"
                required
              />
              <Select value={sendCrypto} onValueChange={setSendCrypto}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Crypto" />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.id} value={crypto.id}>
                      {crypto.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="receive-amount">You receive</Label>
            <div className="flex items-center gap-2">
              <Input
                id="receive-amount"
                type="text"
                value={receiveAmount}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
              <Select value={receiveCrypto} onValueChange={setReceiveCrypto}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Crypto" />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.id} value={crypto.id}>
                      {crypto.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient-address">Your {receiveCrypto.toUpperCase()} Wallet Address</Label>
            <Input
              id="recipient-address"
              type="text"
              placeholder={`Enter your ${receiveCrypto.toUpperCase()} wallet address`}
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
