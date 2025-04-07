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
    <div className="bg-blue-500 text-white p-4 m-4 rounded">
      <div>
        With the <a href="https://wallet.flow.com/" target="_blank" rel="noopener noreferrer">Flow Wallet</a>, you can sign 10 mint transactions at once!
      </div>
      {!awaitingResponse && (
        <button
          disabled={!flowAddress}
          onClick={handleClick}
          className="w-full py-4 px-8 text-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-transform transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {flowAddress ? 'Mint 10 at Once!' : 'Requires Flow Wallet'}
        </button>
      )}
      {awaitingResponse && (
        <button
          className="w-full py-4 px-8 text-2xl font-bold text-white bg-gray-500 rounded-lg shadow-lg disabled:cursor-not-allowed"
          disabled
        >
          Please Wait...
        </button>
      )}
      {<p>{JSON.stringify({ isPending, isError, txId, results })}</p>}
    </div>
  );
}
