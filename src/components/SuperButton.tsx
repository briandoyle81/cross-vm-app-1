'use client';

import { useAccount } from 'wagmi';
import { clickToken } from '../constants/contracts';
import { CallOutcome, EVMBatchCall } from "../hooks/useBatchTransaction";
import { Abi } from 'viem';

interface SuperButtonProps {
    flowAddress: string | null;
    awaitingResponse: boolean;
    setAwaitingResponse: (value: boolean) => void;
    sendBatchTransaction: (calls: EVMBatchCall[]) => void;
    isPending: boolean;
    isError: boolean;
    txId: string;
    results: CallOutcome[];
}

export default function SuperButton({
  flowAddress,
  awaitingResponse,
  setAwaitingResponse,
  sendBatchTransaction,
  isPending,
  isError,
  txId,
  results,
}: SuperButtonProps) {
  const account = useAccount();
    
  const calls: EVMBatchCall[] = Array.from({ length: 10 }, () => ({
    address: clickToken.address,
    abi: clickToken.abi as Abi,
    functionName: 'mintTo',
    args: [account?.address],
  }));

  function handleClick() {
    setAwaitingResponse(true);
    sendBatchTransaction(calls);
  }

  return (
    <div>
      <div className="mb-4 text-gray-300 h-12 flex items-center">
        <span>
          With the <a href="https://wallet.flow.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Flow Wallet</a>, you can sign 10 mint transactions at once!
        </span>
      </div>
      {!awaitingResponse && (
        <button
          disabled={!flowAddress}
          onClick={handleClick}
          className="w-full py-4 px-8 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {flowAddress ? 'Mint 10 at Once!' : 'Requires Flow Wallet'}
        </button>
      )}
      {awaitingResponse && (
        <button
          className="w-full py-4 px-8 text-xl font-bold text-white bg-gray-600 rounded-lg shadow-lg cursor-not-allowed"
          disabled
        >
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        </button>
      )}
    </div>
  );
}
