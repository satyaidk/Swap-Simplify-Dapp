export interface TokenData {
  symbol: string
  name: string
  mint: string
  decimals: number
  logoURI: string
  network: string
  coingeckoId?: string
}

export const SUPPORTED_NETWORKS = [
  { id: "solana", name: "Solana", icon: "◉", color: "bg-purple-500" },
  { id: "ethereum", name: "Ethereum", icon: "Ξ", color: "bg-blue-500" },
  { id: "bsc", name: "BSC", icon: "♦", color: "bg-yellow-500" },
]

export const SUPPORTED_TOKENS: TokenData[] = [
  // Solana Tokens
  {
    symbol: "SOL",
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    network: "solana",
    coingeckoId: "solana",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    network: "solana",
    coingeckoId: "usd-coin",
  },
  {
    symbol: "USDT",
    name: "Tether",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
    network: "solana",
    coingeckoId: "tether",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
    network: "solana",
    coingeckoId: "raydium",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
    network: "solana",
    coingeckoId: "bonk",
  },
  {
    symbol: "ORCA",
    name: "Orca",
    mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png",
    network: "solana",
    coingeckoId: "orca",
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png",
    network: "solana",
    coingeckoId: "jupiter-exchange-solana",
  },
  // Ethereum Tokens (for cross-chain demo)
  {
    symbol: "ETH",
    name: "Ethereum",
    mint: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    network: "ethereum",
    coingeckoId: "ethereum",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    mint: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
    network: "ethereum",
    coingeckoId: "wrapped-bitcoin",
  },
]

export function getTokensByNetwork(network: string): TokenData[] {
  return SUPPORTED_TOKENS.filter((token) => token.network === network)
}

export function getTokenBySymbol(symbol: string): TokenData | undefined {
  return SUPPORTED_TOKENS.find((token) => token.symbol === symbol)
}
