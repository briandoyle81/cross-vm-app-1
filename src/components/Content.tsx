'use client';

import { useEffect, useState } from 'react';
import TopTenDisplay from './TopTenDisplay';
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
} from 'wagmi';
import TheButton from './TheButton';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as fcl from '@onflow/fcl';
import { CurrentUser } from '@onflow/typedefs';
import { EVMBatchCall, useBatchTransaction } from "../hooks/useBatchTransaction";
import { clickToken } from '../constants/contracts';
import { Abi } from 'viem';

export default function Content() {
  const [flowAddress, setFlowAddress] = useState<string | null>(null);
  const { sendBatchTransaction, isPending, isError, txId, results } = useBatchTransaction();

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

  useEffect(() => {
    const unsub = fcl.currentUser().subscribe((user: CurrentUser) => {
      setFlowAddress(user.addr ?? null);
    });
    return () => unsub();
  }, []);

  const calls: EVMBatchCall[] = Array.from({ length: 10 }, () => ({
    address: clickToken.address,
    abi: clickToken.abi as Abi,
    functionName: 'mintTo',
    args: [account?.address],
  }));

  return (
    <div>
      <div className="flex justify-end p-3">
        <ConnectButton />
      </div>
      <h3>Flow Address: {flowAddress}</h3>
      <h3>EVM Address: {account?.address}</h3>
      <br />
      <div className="flex flex-row items-center justify-center">
        <div className="bg-blue-500 text-white p-4 m-4 rounded">
          <div>
            With the <a href="https://wallet.flow.com/" target="_blank" rel="noopener noreferrer">Flow Wallet</a>, you can sign 10 mint transactions at once!
          </div>
          <button disabled={!flowAddress} onClick={() => sendBatchTransaction(calls)}>
            {flowAddress ? 'Mint 10 at Once!' : 'Requires Flow Wallet'}
          </button>
          {<p>{JSON.stringify({ isPending, isError, txId, results })}</p>}
        </div>
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
      </div>
      {<TopTenDisplay reloadScores={reload} setReloadScores={setReload} />}
    </div>
  );
}
