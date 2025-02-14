'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';
import CodeEvaluator from './code-evaluator';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import { CurrentUser } from '@onflow/typedefs';

function Page() {
  const coa = useAccount();
  const [flowAddress, setFlowAddress] = useState<string | null>(null);

  useEffect(() => {
    const unsub = fcl.currentUser().subscribe((user: CurrentUser) => {
      if (user.addr) {
        setFlowAddress(user.addr);
      }
    })

    return () => unsub();
  }, []);

  return (
    <>
        <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <ConnectButton />
    </div>
    <h3>Flow Address: {flowAddress}</h3>
    <h3>EVM Address: {coa?.address}</h3>
    <br />
    <CodeEvaluator></CodeEvaluator>
    </>
  );
}

export default Page;
