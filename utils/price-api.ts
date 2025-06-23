interface PriceData {
  [key: string]: {
    usd: number
    usd_24h_change: number
  }
}

export async function fetchTokenPrices(coingeckoIds: string[]): Promise<PriceData> {
  try {
    const ids = coingeckoIds.join(",")
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch prices")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching prices:", error)
    // Return mock prices as fallback
    return getFallbackPrices(coingeckoIds)
  }
}

function getFallbackPrices(coingeckoIds: string[]): PriceData {
  const fallbackPrices: PriceData = {
    solana: { usd: 114.23, usd_24h_change: 2.45 },
    "usd-coin": { usd: 1.0, usd_24h_change: 0.01 },
    tether: { usd: 1.0, usd_24h_change: 0.0 },
    ethereum: { usd: 2247.83, usd_24h_change: 1.23 },
    "wrapped-bitcoin": { usd: 43250.67, usd_24h_change: 0.87 },
    raydium: { usd: 1.45, usd_24h_change: 3.21 },
    bonk: { usd: 0.000012, usd_24h_change: -1.45 },
    orca: { usd: 3.67, usd_24h_change: 2.11 },
    "jupiter-exchange-solana": { usd: 0.78, usd_24h_change: 4.23 },
  }

  const result: PriceData = {}
  coingeckoIds.forEach((id) => {
    result[id] = fallbackPrices[id] || { usd: 1, usd_24h_change: 0 }
  })

  return result
}

export function calculateSwapAmount(fromAmount: number, fromPrice: number, toPrice: number, slippage = 0.5): number {
  const usdValue = fromAmount * fromPrice
  const toAmount = usdValue / toPrice
  const slippageAmount = toAmount * (slippage / 100)
  return toAmount - slippageAmount
}
