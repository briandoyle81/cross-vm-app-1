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

export default function TopTenDisplay({
    reloadScores,
    setReloadScores,
}: TopTenDisplayProps) {
    const [scores, setScores] = useState<scoreBoardEntry[]>([]);

    const account = useAccount();
    const queryClient = useQueryClient();

    const { data: scoresData, queryKey: getAllScoresQueryKey } = useReadContract({
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
        return address;
    }

    function renderTopTen() {
        if (scores.length === 0 || !account) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            );
        }

        const topTen = scores.length > 10 ? scores.slice(0, 10) : scores;
        const myRank =
            scores.findIndex((entry) => entry.user === account?.address) + 1 ||
            scores.length + 1;

        const topTenList = topTen.map((entry, index) => {
            const isCurrentUser = entry.user === account.address;
            return (
                <div
                    key={entry.user + index + 1}
                    className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                        isCurrentUser
                            ? 'bg-blue-900/50 border border-blue-500'
                            : 'bg-gray-700/50'
                    }`}
                >
                    <div className="flex items-center">
                        <span className="text-gray-400 w-8">{index + 1}.</span>
                        <span className={`font-mono ${isCurrentUser ? 'text-blue-300' : 'text-gray-300'}`}>
                            {renderAddress(entry.user)}
                        </span>
                    </div>
                    <span className={`font-bold ${isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                        {formatUnits(entry.value, 18)}
                    </span>
                </div>
            );
        });

        if (account?.address && (myRank > 10 || myRank > scores.length)) {
            topTenList.push(
                <div
                    key={myRank}
                    className="flex items-center justify-between p-3 rounded-lg mb-2 bg-blue-900/50 border border-blue-500"
                >
                    <div className="flex items-center">
                        <span className="text-gray-400 w-8">{myRank}.</span>
                        <span className="font-mono text-blue-300">
                            {renderAddress(account.address.toString())}
                        </span>
                    </div>
                    <span className="font-bold text-blue-300">
                        {myRank > scores.length
                            ? '0'
                            : formatUnits(scores[myRank - 1].value, 18)}
                    </span>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <div className="grid grid-cols-2 text-sm text-gray-400 mb-2 px-3">
                    <span>Player</span>
                    <span className="text-right">Score</span>
                </div>
                {topTenList}
            </div>
        );
    }

    return (
        <div className="bg-gray-800/50 rounded-lg p-4">
            {renderTopTen()}
        </div>
    );
}
