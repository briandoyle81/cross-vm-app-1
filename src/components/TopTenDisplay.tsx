import { useAccount, useReadContract } from 'wagmi';
import { clickToken } from '../constants/contracts';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { formatUnits } from 'viem';

type scoreBoardEntry = {
    user: string;
    value: bigint;
};

interface TopTenDisplayProps {
    reloadScores: boolean;
    setReloadScores: (value: boolean) => void;
}

export default function TopTenDisplay({ reloadScores, setReloadScores }: TopTenDisplayProps) {
  const [scores, setScores] = useState<scoreBoardEntry[]>([]);

  const account = useAccount();
  const queryClient = useQueryClient();
  

  const {
    data: scoresData,
    queryKey: getAllScoresQueryKey,
  } = useReadContract({
    abi: clickToken.abi,
    address: clickToken.address as `0x${string}`,
    functionName: 'getAllScores',
  });

  useEffect(() => {
    if (scoresData) {
      const sortedScores = scoresData as scoreBoardEntry[];
      // Sort scores in descending order
      sortedScores.sort((a, b) => Number(b.value) - Number(a.value));

      setScores(sortedScores);
    }
  }, [scoresData]);

  useEffect(() => {
    if (reloadScores) {
      console.log('Reloading scores...');
      queryClient.invalidateQueries({ queryKey: getAllScoresQueryKey });
      setReloadScores(false);
    }
  }, [reloadScores]);

  function renderAddress(address: string) {
    return address?.slice(0, 5) + '...' + address?.slice(-3);
  }

  function renderTopTen() {
    if (scores.length === 0 || !account) {
      return <ol><li>Loading...</li></ol>;
    }
    // Only display the top 10 scores.  If the user is in the top 10, bold the item with their score.  If not, show it at the bottom with their ranking number
    const topTen = scores.length > 10 ? scores.slice(0, 10) : scores;
    // myRank is my address's position in the array of scores, +1.  If it's not present, my rank is the length of the array
    const myRank = scores.findIndex((entry) => entry.user === account?.address) + 1 || scores.length + 1;

    const topTenList = topTen.map((entry, index) => {
      return (
        <li key={entry.user + index + 1}>
          {entry.user === account.address ? (
            <strong>
              {index + 1} -- {renderAddress(entry.user)} -- {formatUnits(entry.value, 18)}
            </strong>
          ) : (
            <>
              {index + 1} -- {renderAddress(entry.user)} -- {formatUnits(entry.value, 18)}
            </>
          )}
        </li>
      );
    });

    // Append my score if myRank is > 10
    if (account?.address && (myRank > 10 || myRank > scores.length)) {
      topTenList.push(
        <li key={myRank}>
          <strong>
            {myRank} -- {renderAddress(account.address.toString())} -- {myRank > scores.length ? 0 : formatUnits(scores[myRank - 1].value, 18)}
          </strong>
        </li>
      );
    }

    return <ol>{topTenList}</ol>;

  }

  return (
    <div>
      <h3>Top 10 Scores</h3>
      {renderTopTen()}
    </div>
  );
}