"use client"

import type React from "react"

import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => {
    // Use multiple RPC endpoints as fallbacks
    const endpoints = [
      "https://solana-api.projectserum.com",
      "https://api.mainnet-beta.solana.com",
      clusterApiUrl("mainnet-beta"),
    ]
    return endpoints[0] // Use the first one as primary
  }, [])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
