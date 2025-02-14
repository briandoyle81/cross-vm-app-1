# Flow + RainbowKit Integration Demo

A demonstration of integrating Flow blockchain functionality with RainbowKit and Next.js, allowing users to connect both EVM and Flow wallets in a single application.

## Features

- Connect to Flow and EVM wallets using RainbowKit
- Display connected wallet addresses
- Interactive code evaluation sandbox
- Built with Next.js 15 and React 19

## Prerequisites

- Node.js >= 20.0.0
- Flow Wallet Browser Extension
- An EVM wallet (like MetaMask)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js application routes and components
- `src/wagmi.ts` - Wagmi and Flow wallet configuration
- `src/app/code-evaluator.tsx` - Interactive code evaluation component
- `src/app/providers.tsx` - React context providers setup

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection UI
- [Wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [Flow Client Library (FCL)](https://docs.onflow.org/fcl/) - Flow blockchain interaction
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Development

The project uses TypeScript for type safety and Next.js App Router for routing. The main components are:

- `CodeEvaluator`: An interactive sandbox for testing Flow and Wagmi functionality
- `Providers`: Sets up RainbowKit, Wagmi, and query client providers
- `Page`: Main application page with wallet connection buttons and address display

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
