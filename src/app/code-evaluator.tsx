import React, { useState } from 'react';
import * as wagmi from '@wagmi/core';
import { useConfig } from 'wagmi';
import * as fcl from '@onflow/fcl';

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

function CodeEvaluator() {
  const config = useConfig()
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');

  const handleEvaluate = async () => {
    try {
      const func = new AsyncFunction('config', 'fcl', 'wagmi', code);
      const output = await func(config, fcl, wagmi);

      setResult(String(output));
    } catch (error: any) {
      setResult(`Error: ${error?.message || error}`);
      throw error
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Code Evaluator</h2>
      <textarea
        rows={6}
        cols={50}
        value={code} 
        onChange={(e) => setCode(e.target.value)}
        placeholder="Type your code here.  The following variables are available: wagmi, fcl, config (wagmi config)"
      />
      <br />
      <button onClick={handleEvaluate}>Evaluate</button>
      <button onClick={() => setCode('')}>Clear</button>
      <div style={{ marginTop: '1rem' }}>
        <strong>Result:</strong> {result}
      </div>
    </div>
  );
}

export default CodeEvaluator;