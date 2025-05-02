import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

export default function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold">Click to Mint</h1>
          <p className="text-gray-400 text-sm mt-1">A fun demo, not a production app</p>
        </div>
        <ConnectButton />
      </div>
      <div className="mb-4">
        <a 
          href="https://evm-testnet.flowscan.io/address/0xA7Cf2260e501952c71189D04FAd17c704DFB36e6?tab=txs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          View Transactions on Testnet Flowscan
        </a>
      </div>
    </div>
  );
} 