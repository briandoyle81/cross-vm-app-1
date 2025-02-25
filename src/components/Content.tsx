'use client';

import { useEffect, useState } from 'react';
import TopTenDisplay from './TopTenDisplay';
import { useWaitForTransactionReceipt, useWriteContract, useAccount } from 'wagmi';
import TheButton from './TheButton';

export default function Content() {
  const [reload, setReload] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const account = useAccount();

  const { data, writeContract, error: writeError } = useWriteContract();

  const { data: receipt, error: receiptError } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    if (receipt) {
      console.log('Transaction receipt:', receipt);
      setReload(true);
      setAwaitingResponse(false);
    }
  }, [receipt]);

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

  return (
    <div className="card gap-1">
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
      {<TopTenDisplay reloadScores={reload} setReloadScores={setReload} />}
    </div>
  );
}