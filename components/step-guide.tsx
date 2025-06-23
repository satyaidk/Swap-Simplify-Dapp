"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Zap, Shield, TrendingUp, Wallet } from "lucide-react"

interface StepGuideProps {
  onClose: () => void
}

const steps = [
  {
    title: "What is a Token Swap?",
    icon: <Zap className="w-8 h-8 text-purple-600" />,
    content:
      "A token swap lets you exchange one cryptocurrency for another. For example, you can swap SOL for USDC at current market rates.",
    tip: "Think of it like exchanging dollars for euros, but with digital tokens!",
  },
  {
    title: "How DEXs Work",
    icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
    content:
      "Decentralized Exchanges (DEXs) like Jupiter find the best prices across multiple liquidity pools to give you the best swap rate.",
    tip: "Jupiter aggregates prices from many sources to find you the best deal!",
  },
  {
    title: "Understanding Slippage",
    icon: <Shield className="w-8 h-8 text-purple-600" />,
    content:
      "Slippage is the difference between expected and actual swap prices. It happens due to market movements during your transaction.",
    tip: "Lower slippage = more predictable results, but trades might fail in volatile markets.",
  },
  {
    title: "Wallet Connection",
    icon: <Wallet className="w-8 h-8 text-purple-600" />,
    content:
      "You need to connect your Phantom wallet to perform real swaps. Your wallet holds your tokens and signs transactions securely.",
    tip: "Never share your seed phrase! Your wallet is your bank account.",
  },
  {
    title: "Mock vs Real Swaps",
    icon: <BookOpen className="w-8 h-8 text-purple-600" />,
    content:
      "Mock swaps let you practice without spending real money. Real swaps use your actual tokens and cost transaction fees.",
    tip: "Always try mock swaps first to understand the process!",
  },
]

export function StepGuide({ onClose }: StepGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-white shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">{currentStepData.icon}</div>
            <CardTitle className="text-xl font-bold text-gray-800">Learn About Token Swaps</CardTitle>
            <div className="flex justify-center space-x-2 mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-purple-600" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">{currentStepData.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{currentStepData.content}</p>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded">
                <p className="text-purple-700 text-xs font-medium">💡 {currentStepData.tip}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>

              {currentStep === steps.length - 1 ? (
                <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-700">
              Skip Tutorial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
