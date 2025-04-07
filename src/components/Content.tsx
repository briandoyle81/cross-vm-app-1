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
    <div>
      <div className="flex justify-end p-3">
        <ConnectButton />
      </div>
      <h3>Flow Address: {flowAddress}</h3>
      <h3>EVM Address: {account?.address}</h3>
      <br />
      <div className="flex flex-row items-center justify-center">
        <div className="bg-green-500 text-white p-4 m-4 rounded">
          {account.address && (
            <div className="mb-4">
              <TheButton
                writeContract={writeContract}
                awaitingResponse={awaitingResponse}
                setAwaitingResponse={setAwaitingResponse}
              />
            </div>
          )}
          <br />
        </div>
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
      {<TopTenDisplay reloadScores={reload} setReloadScores={setReload} />}
    </div>
  );
}
