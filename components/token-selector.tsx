"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Search } from "lucide-react"
import { SUPPORTED_NETWORKS, getTokensByNetwork, type TokenData } from "@/utils/token-data"
import { TokenSkeleton } from "@/components/skeleton-loader"
import { fetchTokenPrices } from "@/utils/price-api"

interface TokenSelectorProps {
  selectedToken: TokenData | null
  onTokenSelect: (token: TokenData) => void
  excludeToken?: TokenData | null
}

export function TokenSelector({ selectedToken, onTokenSelect, excludeToken }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("solana")
  const [isLoading, setIsLoading] = useState(true)
  const [prices, setPrices] = useState<Record<string, number>>({})

  const availableTokens = getTokensByNetwork(selectedNetwork).filter((token) => token.symbol !== excludeToken?.symbol)

  const filteredTokens = availableTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const loadPrices = async () => {
      setIsLoading(true)
      try {
        const coingeckoIds = availableTokens.filter((token) => token.coingeckoId).map((token) => token.coingeckoId!)

        const priceData = await fetchTokenPrices(coingeckoIds)
        const priceMap: Record<string, number> = {}

        availableTokens.forEach((token) => {
          if (token.coingeckoId && priceData[token.coingeckoId]) {
            priceMap[token.symbol] = priceData[token.coingeckoId].usd
          }
        })

        setPrices(priceMap)
      } catch (error) {
        console.error("Error loading prices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      loadPrices()
    }
  }, [isOpen, selectedNetwork, availableTokens])

  const handleTokenSelect = (token: TokenData) => {
    onTokenSelect(token)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-auto p-2 min-w-[100px]"
        >
          {selectedToken ? (
            <div className="flex items-center space-x-2">
              <img
                src={selectedToken.logoURI || "/placeholder.svg"}
                alt={selectedToken.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                }}
              />
              <span className="font-medium">{selectedToken.symbol}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Select Token</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Select Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Network Selector */}
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {SUPPORTED_NETWORKS.map((network) => (
                <SelectItem key={network.id} value={network.id}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${network.color}`} />
                    <span>{network.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Token List */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <TokenSkeleton key={i} />
                ))}
              </>
            ) : (
              filteredTokens.map((token) => (
                <Button
                  key={token.mint}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-gray-800"
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <img
                      src={token.logoURI || "/placeholder.svg"}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                    {prices[token.symbol] && (
                      <div className="text-sm text-gray-300">
                        ${prices[token.symbol].toFixed(prices[token.symbol] < 1 ? 6 : 2)}
                      </div>
                    )}
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
