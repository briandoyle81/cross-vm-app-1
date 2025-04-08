'use client';

import { useAccount } from 'wagmi';
import { clickToken } from '../constants/contracts';

interface theButtonProps {
    // eslint-disable-next-line
    writeContract: Function;
    awaitingResponse: boolean;
    setAwaitingResponse: (value: boolean) => void;
}

export default function TheButton({
  writeContract,
  awaitingResponse,
  setAwaitingResponse,
}: theButtonProps) {
  const account = useAccount();

  function handleClick() {
    try {
      writeContract({
        abi: clickToken.abi,
        address: clickToken.address,
        functionName: 'mintTo',
        args: [account.address],
      });
      setAwaitingResponse(true);
    } catch (error) {
      console.error('Write contract failed:', error);
    }
  }

  return (
    <>
      <div className="mb-4 text-gray-300 h-12 flex items-center">
        Click to mint one token.
      </div>
      {!awaitingResponse && (
        <button
          onClick={handleClick}
          className="w-full py-4 px-8 text-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Click Me!
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
    </>
  );
}
