"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Shield, CheckCircle, AlertCircle } from "lucide-react"

interface WalletAuthProps {
  onAuthComplete: () => void
}

export function WalletAuth({ onAuthComplete }: WalletAuthProps) {
  const { connected, connecting, publicKey, signMessage } = useWallet()
  const [authStep, setAuthStep] = useState<"connect" | "sign" | "complete">("connect")
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (connected && publicKey) {
      setAuthStep("sign")
    } else if (!connected) {
      setAuthStep("connect")
    }
  }, [connected, publicKey])

  const handleSignIn = async () => {
    if (!signMessage || !publicKey) {
      setAuthError("Wallet not properly connected")
      return
    }

    setIsSigningIn(true)
    setAuthError(null)

    try {
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with SwapSimplify.\n\nWallet: ${publicKey.toString()}\nTimestamp: ${Date.now()}`,
      )

      await signMessage(message)
      setAuthStep("complete")

      // Simulate authentication delay
      setTimeout(() => {
        onAuthComplete()
      }, 1500)
    } catch (error) {
      console.error("Sign in error:", error)
      setAuthError("Failed to sign message. Please try again.")
    } finally {
      setIsSigningIn(false)
    }
  }

  const getStepIcon = (step: string) => {
    switch (step) {
      case "connect":
        return <Wallet className="w-6 h-6" />
      case "sign":
        return <Shield className="w-6 h-6" />
      case "complete":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      default:
        return <Wallet className="w-6 h-6" />
    }
  }

  const getStepStatus = (step: string) => {
    if (authStep === "connect" && step === "connect") return "active"
    if (authStep === "sign" && step === "sign") return "active"
    if (authStep === "complete" && step === "complete") return "active"
    if ((authStep === "sign" || authStep === "complete") && step === "connect") return "completed"
    if (authStep === "complete" && step === "sign") return "completed"
    return "pending"
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {["connect", "sign", "complete"].map((step, index) => {
          const status = getStepStatus(step)
          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  status === "completed"
                    ? "bg-green-500 border-green-500 text-white"
                    : status === "active"
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "bg-white/10 border-white/30 text-white/50"
                }`}
              >
                {status === "completed" ? <CheckCircle className="w-5 h-5" /> : getStepIcon(step)}
              </div>
              {index < 2 && (
                <div className={`w-8 h-0.5 mx-2 ${status === "completed" ? "bg-green-500" : "bg-white/20"}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center space-y-4">
          {authStep === "connect" && (
            <>
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-white/70 text-sm mb-4">
                  Select and connect your Phantom wallet to start swapping tokens
                </p>
              </div>
              <div className="wallet-adapter-button-trigger">
                <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !border-0 !rounded-full !px-8 !py-3 !text-white !font-semibold" />
              </div>
              {connecting && (
                <div className="flex items-center justify-center space-x-2 text-white/70">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Connecting...</span>
                </div>
              )}
            </>
          )}

          {authStep === "sign" && (
            <>
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Sign to Authenticate</h3>
                <p className="text-white/70 text-sm mb-4">
                  Sign a message to verify your wallet ownership and enable trading
                </p>
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <p className="text-white/60 text-xs">
                    Wallet: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full font-semibold"
              >
                {isSigningIn ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing...</span>
                  </div>
                ) : (
                  "Sign Message"
                )}
              </Button>
              {authError && (
                <div className="flex items-center justify-center space-x-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{authError}</span>
                </div>
              )}
            </>
          )}

          {authStep === "complete" && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Authentication Complete!</h3>
                <p className="text-white/70 text-sm">
                  Your wallet is now connected and verified. Redirecting to swap interface...
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/70">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Loading swap interface...</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
