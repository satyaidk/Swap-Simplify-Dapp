"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export function WalletConnect() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="wallet-adapter-button-trigger">
      <WalletMultiButton className="!bg-white/20 !backdrop-blur-sm !border-white/30 !text-white !rounded-full !px-6 !py-2 !text-sm !font-medium hover:!bg-white/30" />
    </div>
  )
}
