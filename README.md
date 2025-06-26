# SwapSimplify - Learn Token Swapping on Solana

A beginner-friendly decentralized application (dApp) that helps users understand and perform token swaps on the Solana blockchain using the Jupiter Aggregator API.

## Features

- **Educational Step-by-Step Guide**: Learn about token swaps, DEXs, slippage, and wallet connections
- **Mock Swap Simulator**: Practice token swapping with fake data before using real tokens
- **Real Token Swapping**: Perform actual token swaps using Jupiter Aggregator API
- **Phantom Wallet Integration**: Secure wallet connection using Solana Wallet Adapter
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **Beginner-Friendly**: Simple explanations and tooltips for DeFi concepts

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Wallet**: Solana Wallet Adapter with Phantom support
- **DEX API**: Jupiter Aggregator API for best swap rates
- **Blockchain**: Solana mainnet-beta

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Phantom wallet browser extension
- Some SOL tokens for testing real swaps

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/satyaidk/Swap-Simplify-Dapp.git
cd swap-simplify
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Learning Mode
1. Click "Start Learning" to go through the educational guide
2. Learn about token swaps, DEXs, slippage, and wallet security

### Mock Swap
1. Click "Try Mock Swap" to practice without real tokens
2. Select tokens, enter amounts, and see simulated results
3. No wallet connection required

### Real Swap
1. Connect your Phantom wallet
2. Click "Do Real Swap"
3. Select tokens and amounts
4. Review the quote from Jupiter API
5. Execute the swap (requires SOL for transaction fees)

## Supported Tokens

- SOL (Solana)
- USDC (USD Coin)
- USDT (Tether)

More tokens can be added by updating the `supportedTokens` array in `components/real-swap.tsx`.

## API Integration

The app uses Jupiter Aggregator API v6 for:
- Getting best swap quotes across multiple DEXs
- Executing swaps with optimal routing
- Minimizing slippage and fees

## Security

- Never stores private keys or seed phrases
- Uses Solana Wallet Adapter for secure wallet connections
- All transactions are signed locally in your wallet
- Open source code for transparency

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is educational software. Always understand the risks before swapping tokens:
- Token prices are volatile
- Transaction fees apply
- Slippage can affect final amounts
- Only swap tokens you can afford to lose

## Support

For questions or issues:
- Open a GitHub issue
- Check the Jupiter API documentation
- Review Solana Wallet Adapter docs

## Roadmap

- [ ] Add more supported tokens
- [ ] Implement transaction history
- [ ] Add price charts
- [ ] Support for other wallets (Solflare, etc.)
- [ ] Advanced trading features
- [ ] Multi-language support
