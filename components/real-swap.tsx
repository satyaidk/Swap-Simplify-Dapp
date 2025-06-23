"use client"

import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowUpDown, Zap } from "lucide-react"
import Link from "next/link"
import { getQuote, executeSwap } from "@/utils/jupiter-api"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { WalletAuth } from "@/components/wallet-auth"
import { TokenSelector } from "@/components/token-selector"
import { SwapSkeleton } from "@/components/skeleton-loader"
import { getTokenBySymbol, type TokenData } from "@/utils/token-data"

export function RealSwap() {
  const { connected, publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [fromToken, setFromToken] = useState<TokenData | null>(getTokenBySymbol("SOL"))
  const [toToken, setToToken] = useState<TokenData | null>(getTokenBySymbol("USDC"))
  const [amount, setAmount] = useState("")
  const [quote, setQuote] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey || !isAuthenticated) {
        setBalance(0)
        return
      }

      try {
        if (fromToken?.symbol === "SOL") {
          let retries = 3
          let lastError = null

          while (retries > 0) {
            try {
              const balance = await connection.getBalance(publicKey)
              setBalance(balance / LAMPORTS_PER_SOL)
              return
            } catch (error) {
              lastError = error
              retries--
              if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000))
              }
            }
          }

          console.warn("Failed to fetch balance after retries:", lastError)
          setBalance(0)
        } else {
          setBalance(0)
        }
      } catch (error) {
        console.warn("Error fetching balance:", error)
        setBalance(0)
      }
    }

    fetchBalance()
  }, [connected, publicKey, fromToken, connection, isAuthenticated])

  // Get quote when amount changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || !fromToken || !toToken || Number.parseFloat(amount) <= 0 || !isAuthenticated) {
        setQuote(null)
        return
      }

      setIsLoading(true)
      try {
        const inputAmount = Math.floor(Number.parseFloat(amount) * Math.pow(10, fromToken.decimals))
        const quoteResponse = await getQuote(fromToken.mint, toToken.mint, inputAmount)
        setQuote(quoteResponse)
      } catch (error) {
        console.error("Error fetching quote:", error)
        setQuote(null)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchQuote, 500)
    return () => clearTimeout(debounceTimer)
  }, [amount, fromToken, toToken, isAuthenticated])

  const handleSwap = async () => {
    if (!connected || !publicKey || !quote || !signTransaction) {
      alert("Please connect your wallet first")
      return
    }

    setIsSwapping(true)
    try {
      const result = await executeSwap(quote, publicKey, signTransaction, connection)
      if (result.success) {
        alert(`Swap successful! Transaction: ${result.signature}`)
        setAmount("")
        setQuote(null)
      } else {
        alert(`Swap failed: ${result.error}`)
      }
    } catch (error) {
      console.error("Swap error:", error)
      alert("Swap failed. Please try again.")
    } finally {
      setIsSwapping(false)
    }
  }

  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setAmount("")
    setQuote(null)
  }

  const outputAmount = quote && toToken ? (quote.outAmount / Math.pow(10, toToken.decimals)).toFixed(6) : "0"

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <header className="flex items-center justify-between p-4 sm:p-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-white">Do Real Swap</h1>
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

  if (!connected || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <header className="flex items-center justify-between p-4 sm:p-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-white">Do Real Swap</h1>
          <div className="w-10" />
        </header>

        <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-16">
          <div className="max-w-md w-full">
            <WalletAuth onAuthComplete={() => setIsAuthenticated(true)} />
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
        <h1 className="text-lg sm:text-xl font-bold text-white">Do Real Swap</h1>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm"
        >
          Connected
        </Button>
      </header>

      <div className="flex flex-col items-center px-4 sm:px-6 py-8">
        <div className="max-w-md w-full">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Swap</h2>
                <p className="text-white/70 text-sm">Real token swapping powered by Jupiter</p>
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
                  <div className="text-white/60 text-sm">
                    Balance: {balance > 0 ? balance.toFixed(4) : connected ? "Loading..." : "0.0000"}
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
                    <div className="text-xl sm:text-2xl font-bold text-white flex-1">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        outputAmount
                      )}
                    </div>
                    <TokenSelector selectedToken={toToken} onTokenSelect={setToToken} excludeToken={fromToken} />
                  </div>
                </div>
              </div>

              {/* Quote Info */}
              {quote && (
                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Price Impact</span>
                    <span className="text-white">{(quote.priceImpactPct * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Route</span>
                    <span className="text-white">{quote.routePlan?.length || 1} step(s)</span>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <Button
                onClick={handleSwap}
                disabled={isSwapping || !quote || !amount || Number.parseFloat(amount) <= 0}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-600 hover:to-cyan-500 text-white border-0 rounded-full disabled:opacity-50"
              >
                {isSwapping ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Swapping...
                  </div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Swap
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-white/60 text-xs">Real swap using Jupiter API - transaction fees apply</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
