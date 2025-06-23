"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, TestTube, Zap } from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"
import { StepGuide } from "@/components/step-guide"

export default function HomePage() {
  const [showGuide, setShowGuide] = useState(false)

  if (showGuide) {
    return <StepGuide onClose={() => setShowGuide(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-purple-500 to-purple-700">
      {/* Header */}
      <header className="flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-white font-bold text-lg sm:text-xl">SwapSimplify</span>
        </div>
        <WalletConnect />
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 text-center">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">SwapSimplify</h1>
          </div>

          {/* Welcome Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Welcome to SwapSimplify</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Learn how to swap tokens on Solana using a step-by-step guide.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => setShowGuide(true)}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-600 hover:to-cyan-500 text-white border-0 rounded-full"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Learning
            </Button>

            <Link href="/mock-swap" className="block">
              <Button
                variant="outline"
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full backdrop-blur-sm"
              >
                <TestTube className="w-5 h-5 mr-2" />
                Try Mock Swap
              </Button>
            </Link>

            <Link href="/real-swap" className="block">
              <Button
                variant="outline"
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full backdrop-blur-sm"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Do Real Swap
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
