"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowUpDown, Coins } from "lucide-react"
import Link from "next/link"
import { TokenSelector } from "@/components/token-selector"
import { SwapSkeleton } from "@/components/skeleton-loader"
import { getTokenBySymbol, type TokenData } from "@/utils/token-data"
import { fetchTokenPrices, calculateSwapAmount } from "@/utils/price-api"

export function SwapSimulator() {
  const [fromToken, setFromToken] = useState<TokenData | null>(getTokenBySymbol("SOL"))
  const [toToken, setToToken] = useState<TokenData | null>(getTokenBySymbol("USDC"))
  const [amount, setAmount] = useState("0.5")
  const [isSwapping, setIsSwapping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [mockBalances] = useState<Record<string, number>>({
    SOL: 3.25,
    USDC: 150.5,
    USDT: 100.0,
    ETH: 0.5,
    RAY: 45.7,
    BONK: 1000000,
    ORCA: 25.3,
    JUP: 78.9,
    WBTC: 0.01,
  })

  // Load real prices
  useEffect(() => {
    const loadPrices = async () => {
      setIsLoading(true)
      try {
        const coingeckoIds = [
          "solana",
          "usd-coin",
          "tether",
          "ethereum",
          "raydium",
          "bonk",
          "orca",
          "jupiter-exchange-solana",
          "wrapped-bitcoin",
        ]
        const priceData = await fetchTokenPrices(coingeckoIds)

        const priceMap: Record<string, number> = {
          SOL: priceData["solana"]?.usd || 114.23,
          USDC: priceData["usd-coin"]?.usd || 1.0,
          USDT: priceData["tether"]?.usd || 1.0,
          ETH: priceData["ethereum"]?.usd || 2247.83,
          RAY: priceData["raydium"]?.usd || 1.45,
          BONK: priceData["bonk"]?.usd || 0.000012,
          ORCA: priceData["orca"]?.usd || 3.67,
          JUP: priceData["jupiter-exchange-solana"]?.usd || 0.78,
          WBTC: priceData["wrapped-bitcoin"]?.usd || 43250.67,
        }

        setPrices(priceMap)
      } catch (error) {
        console.error("Error loading prices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPrices()
  }, [])

  const handleSwap = async () => {
    setIsSwapping(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSwapping(false)

    const outputAmount = getOutputAmount()
    alert(`Mock swap completed! You would receive ${outputAmount} ${toToken?.symbol}`)
  }

  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  const getOutputAmount = () => {
    if (!fromToken || !toToken || !amount) return "0"

    const fromPrice = prices[fromToken.symbol] || 1
    const toPrice = prices[toToken.symbol] || 1
    const inputAmount = Number.parseFloat(amount)

    return calculateSwapAmount(inputAmount, fromPrice, toPrice).toFixed(6)
  }

  const fromBalance = fromToken ? mockBalances[fromToken.symbol] || 0 : 0
  const outputAmount = getOutputAmount()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <header className="flex items-center justify-between p-4 sm:p-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-white">Try Mock Swap</h1>
          <div className="w-10" />
        </header>
        <div className="flex flex-col items-center px-4 sm:px-6 py-8">
          <div className="max-w-md w-full">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 sm:p-6">
                <SwapSkeleton />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      <header className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold text-white">Try Mock Swap</h1>
        <div className="w-10" />
      </header>

      <div className="flex flex-col items-center px-4 sm:px-6 py-8">
        <div className="max-w-md w-full">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Swap</h2>
                <p className="text-white/70 text-sm">Practice token swapping with real market prices</p>
              </div>

              {/* From Token */}
              <div className="space-y-3">
                <label className="text-white/80 text-sm font-medium">From</label>
                <div className="bg-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent border-0 text-xl sm:text-2xl font-bold text-white placeholder-white/50 p-0 h-auto flex-1"
                      placeholder="0.0"
                    />
                    <TokenSelector selectedToken={fromToken} onTokenSelect={setFromToken} excludeToken={toToken} />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Balance: {fromBalance.toFixed(4)}</span>
                    {fromToken && prices[fromToken.symbol] && (
                      <span className="text-white/60">
                        $
                        {prices[fromToken.symbol] < 1
                          ? prices[fromToken.symbol].toFixed(6)
                          : prices[fromToken.symbol].toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={swapTokens}
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full"
                >
                  <ArrowUpDown className="w-5 h-5" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-3">
                <label className="text-white/80 text-sm font-medium">To</label>
                <div className="bg-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <div className="text-xl sm:text-2xl font-bold text-white flex-1">{outputAmount}</div>
                    <TokenSelector selectedToken={toToken} onTokenSelect={setToToken} excludeToken={fromToken} />
                  </div>
                  {toToken && prices[toToken.symbol] && (
                    <div className="text-right text-sm text-white/60">
                      $
                      {prices[toToken.symbol] < 1
                        ? prices[toToken.symbol].toFixed(6)
                        : prices[toToken.symbol].toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Info */}
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Rate</span>
                  <span className="text-white">
                    {fromToken && toToken && prices[fromToken.symbol] && prices[toToken.symbol]
                      ? `1 ${fromToken.symbol} = ${(prices[fromToken.symbol] / prices[toToken.symbol]).toFixed(6)} ${toToken.symbol}`
                      : "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Slippage</span>
                  <span className="text-white">0.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Fee</span>
                  <span className="text-white">~$0.01</span>
                </div>
              </div>

              {/* Swap Button */}
              <Button
                onClick={handleSwap}
                disabled={isSwapping || !amount || Number.parseFloat(amount) <= 0}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-600 hover:to-cyan-500 text-white border-0 rounded-full disabled:opacity-50"
              >
                {isSwapping ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Swapping...
                  </div>
                ) : (
                  <>
                    <Coins className="w-5 h-5 mr-2" />
                    Swap
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-white/60 text-xs">
                  This is a mock swap with real prices - no actual tokens will be exchanged
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
