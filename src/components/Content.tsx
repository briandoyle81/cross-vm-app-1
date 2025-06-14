'use client';

import { useEffect, useState } from 'react';
import TopTenDisplay from './TopTenDisplay';
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
} from 'wagmi';
import TheButton from './TheButton';
import SuperButton from './SuperButton';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as fcl from '@onflow/fcl';
import { CurrentUser } from '@onflow/typedefs';
import { useBatchTransaction } from '../hooks/useBatchTransaction';

export default function Content() {
  const [flowAddress, setFlowAddress] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const account = useAccount();

  const { sendBatchTransaction, isPending, isError, txId, results } = useBatchTransaction();

  const { data, writeContract, error: writeError } = useWriteContract();

  const { data: receipt, error: receiptError } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    if (receipt || results.length > 0) {
      console.log('Transaction receipt:', receipt);
      setReload(true);
      setAwaitingResponse(false);
    }
  }, [receipt, results]);

  useEffect(() => {
    if (writeError) {
      console.error(writeError);
      setAwaitingResponse(false);
    }
  }, [writeError]);

  useEffect(() => {
    if (receiptError) {
      console.error(receiptError);
      setAwaitingResponse(false);
    }
  }, [receiptError]);

  useEffect(() => {
    const unsub = fcl.currentUser().subscribe((user: CurrentUser) => {
      setFlowAddress(user.addr ?? null);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-8">
          <ConnectButton />
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Click to Mint</h1>
          <div className="mb-4">
            <a 
              href="https://developers.flow.com/tutorials/cross-vm-apps/introduction" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Learn how to build an app with batched transactions on Flow
            </a>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Flow Address</h3>
              <p className="font-mono text-gray-300">{flowAddress || 'Not connected'}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">EVM Address</h3>
              <p className="font-mono text-gray-300">{account?.address || 'Not connected'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Single Click</h2>
            {account.address && (
              <TheButton
                writeContract={writeContract}
                awaitingResponse={awaitingResponse}
                setAwaitingResponse={setAwaitingResponse}
              />
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Batch Click</h2>
            {account.address && (
              <SuperButton
                flowAddress={flowAddress}
                awaitingResponse={awaitingResponse}
                setAwaitingResponse={setAwaitingResponse}
                sendBatchTransaction={sendBatchTransaction}
                isPending={isPending}
                isError={isError}
                txId={txId}
                results={results}
              />
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <TopTenDisplay reloadScores={reload} setReloadScores={setReload} />
        </div>
      </div>
    </div>
  );
}
