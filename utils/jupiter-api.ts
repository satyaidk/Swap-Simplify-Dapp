import { type Connection, type PublicKey, type Transaction, VersionedTransaction } from "@solana/web3.js"

const JUPITER_API_URL = "https://quote-api.jup.ag/v6"

export interface QuoteResponse {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null
  priceImpactPct: number
  routePlan: Array<{
    swapInfo: {
      ammKey: string
      label: string
      inputMint: string
      outputMint: string
      inAmount: string
      outAmount: string
      feeAmount: string
      feeMint: string
    }
    percent: number
  }>
  contextSlot: number
  timeTaken: number
}

export async function getQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps = 50,
): Promise<QuoteResponse> {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
  })

  let retries = 3
  let lastError = null

  while (retries > 0) {
    try {
      const response = await fetch(`${JUPITER_API_URL}/quote?${params}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error
      retries--
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  throw new Error(`Failed to get quote after retries: ${lastError?.message || "Unknown error"}`)
}

export async function getSwapTransaction(
  quote: QuoteResponse,
  userPublicKey: PublicKey,
): Promise<{ swapTransaction: string }> {
  let retries = 3
  let lastError = null

  while (retries > 0) {
    try {
      const response = await fetch(`${JUPITER_API_URL}/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: userPublicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error
      retries--
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  throw new Error(`Failed to get swap transaction after retries: ${lastError?.message || "Unknown error"}`)
}

export async function executeSwap(
  quote: QuoteResponse,
  userPublicKey: PublicKey,
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>,
  connection: Connection,
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    // Get the swap transaction
    const { swapTransaction } = await getSwapTransaction(quote, userPublicKey)

    // Deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64")
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

    // Sign the transaction
    const signedTransaction = (await signTransaction(transaction)) as VersionedTransaction

    // Send the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: true,
      maxRetries: 2,
    })

    // Confirm the transaction
    const confirmation = await connection.confirmTransaction(signature, "confirmed")

    if (confirmation.value.err) {
      return {
        success: false,
        error: "Transaction failed to confirm",
      }
    }

    return {
      success: true,
      signature,
    }
  } catch (error) {
    console.error("Swap execution error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
