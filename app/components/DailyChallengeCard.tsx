import React, { useEffect } from "react";
import { useDailyChallenge } from "@/app/hooks/useDailyChallenge";

export default function DailyChallengeCard({ labId, currentParams }) {
  const { challenge, validateChallenge, result, alreadyCompleted } = useDailyChallenge(labId);

  if (!challenge) return null;

  return (
    <div className="w-full space-y-3 mb-4">
      {!alreadyCompleted && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-bold text-yellow-800">Daily Challenge: {challenge.difficulty.toUpperCase()}</h3>
            <p className="text-yellow-700">{challenge.challenge}</p>
            {challenge.hint && <p className="text-sm text-yellow-600 mt-1">Hint: {challenge.hint}</p>}
          </div>
          <button 
            onClick={() => {
              const val = currentParams[challenge.targetParam];
              if (val !== undefined) {
                validateChallenge(Math.abs(val), challenge.targetParam);
              } else {
                alert(`Error: Parameter ${challenge.targetParam} not found in current experiment state.`);
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Submit Attempt
          </button>
        </div>
      )}

      {alreadyCompleted && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">Daily Challenge Completed!</h3>
          <p className="text-green-700">You have already completed today's challenge for this lab. Check back tomorrow!</p>
        </div>
      )}

      {result && result.correct && !alreadyCompleted && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg border border-green-300">
          <p className="font-bold">Challenge Successful!</p>
          <p>You earned +{result.xpEarned} XP!</p>
          {result.leveledUp && <p className="font-bold text-yellow-600 mt-1">Level Up! You are now level {result.newLevel}</p>}
          {result.badgesEarned && result.badgesEarned.length > 0 && (
            <p className="font-bold text-purple-600 mt-1">Badges Earned: {result.badgesEarned.join(", ")}</p>
          )}
        </div>
      )}

      {result && !result.correct && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-300">
          <p className="font-bold">Not quite right.</p>
          <p>Attempts so far: {result.attempts}</p>
        </div>
      )}
    </div>
  );
}
