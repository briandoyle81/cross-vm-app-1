'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import { CurrentUser } from '@onflow/typedefs';
import {EVMBatchCall, useBatchTransaction} from "../hooks/useBatchTransaction";
import Content from '../components/Content';
import { clickToken } from '../constants/contracts';
import { Abi } from 'viem';

function Page() {
  const coa = useAccount();
  const [flowAddress, setFlowAddress] = useState<string | null>(null);
  const {sendBatchTransaction, isPending, isError, txId, results} = useBatchTransaction();

  useEffect(() => {
    const unsub = fcl.currentUser().subscribe((user: CurrentUser) => {
      setFlowAddress(user.addr ?? null);
    });
    return () => unsub();
  }, []);

  const calls: EVMBatchCall[] = Array.from({ length: 10 }, () => ({
    address: clickToken.address, // Replace with your actual token contract address.
    abi: clickToken.abi as Abi,
    functionName: "mintTo",
    args: [coa?.address],
  }));

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 12 }}>
        <ConnectButton />
      </div>
      <h3>Flow Address: {flowAddress}</h3>
      <h3>EVM Address: {coa?.address}</h3>
      <br />
      <button onClick={() => sendBatchTransaction(calls)}>
        Send Batch Transaction Example
      </button>
      {<p>{JSON.stringify({isPending, isError, txId, results})}</p>}
      <Content />
    </>
  );
}

export default Page;
