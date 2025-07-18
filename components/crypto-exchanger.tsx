"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Simulated crypto data and exchange rates
const cryptocurrencies = [
  { id: "btc", name: "Bitcoin", symbol: "BTC" },
  { id: "eth", name: "Ethereum", symbol: "ETH" },
  { id: "usdt", name: "Tether", symbol: "USDT" },
  { id: "bnb", name: "Binance Coin", symbol: "BNB" },
  { id: "sol", name: "Solana", symbol: "SOL" },
]

// Simplified exchange rates (for demonstration purposes)
// 1 unit of 'from' crypto = rate units of 'to' crypto
const exchangeRates = {
  btc_eth: 15, // 1 BTC = 15 ETH
  btc_usdt: 60000, // 1 BTC = 60000 USDT
  btc_bnb: 200, // 1 BTC = 200 BNB
  btc_sol: 400, // 1 BTC = 400 SOL

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

export default function CryptoExchanger() {
  const [sendAmount, setSendAmount] = useState<string>("0.01")
  const [receiveAmount, setReceiveAmount] = useState<string>("0.00")
  const [sendCrypto, setSendCrypto] = useState<string>("btc")
  const [receiveCrypto, setReceiveCrypto] = useState<string>("eth")
  const [walletAddress, setWalletAddress] = useState<string>("")

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
        setReceiveAmount("N/A") // Should not happen with comprehensive rates
      }
    }
    calculateReceiveAmount()
  }, [sendAmount, sendCrypto, receiveCrypto])

  const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAmount(e.target.value)
  }

  const handleSendCryptoChange = (value: string) => {
    setSendCrypto(value)
  }

  const handleReceiveCryptoChange = (value: string) => {
    setReceiveCrypto(value)
  }

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value)
  }

  const handleExchange = () => {
    if (Number.parseFloat(sendAmount) <= 0 || !walletAddress) {
      alert("Please enter a valid amount and wallet address.")
      return
    }
    alert(
      `Simulating exchange: Sending ${sendAmount} ${sendCrypto.toUpperCase()} and receiving ${receiveAmount} ${receiveCrypto.toUpperCase()} to address: ${walletAddress}`,
    )
    // In a real application, this would trigger a backend process
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Crypto Exchanger</CardTitle>
          <CardDescription>Instantly exchange cryptocurrencies.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="send-amount">You send</Label>
            <div className="flex items-center gap-2">
              <Input
                id="send-amount"
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={handleSendAmountChange}
                min="0"
                step="0.0001"
              />
              <Select value={sendCrypto} onValueChange={handleSendCryptoChange}>
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
              <Select value={receiveCrypto} onValueChange={handleReceiveCryptoChange}>
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
            <Label htmlFor="wallet-address">Your {receiveCrypto.toUpperCase()} Wallet Address</Label>
            <Input
              id="wallet-address"
              type="text"
              placeholder={`Enter your ${receiveCrypto.toUpperCase()} wallet address`}
              value={walletAddress}
              onChange={handleWalletAddressChange}
            />
          </div>

          <Button className="w-full" onClick={handleExchange}>
            Exchange Now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
