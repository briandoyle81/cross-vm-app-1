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

import * as fcl from '@onflow/fcl';
import { CurrentUser } from '@onflow/typedefs';
import { useBatchTransaction } from '../hooks/useBatchTransaction';
import Header from './Header';

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
        <Header />
        <div className="mb-8">
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
