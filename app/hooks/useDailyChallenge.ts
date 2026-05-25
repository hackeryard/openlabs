import { useState, useEffect, useCallback } from "react";

export interface Challenge {
  challenge: string;
  hint: string;
  targetParam: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
}

export interface ValidationResult {
  correct: boolean;
  xpEarned?: number;
  newLevel?: number;
  leveledUp?: boolean;
  newStreak?: number;
  badgesEarned?: string[];
  attempts?: number;
}

export function useDailyChallenge(labId: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      try {
        const encodedLabId = encodeURIComponent(labId);
        const res = await fetch(`/api/challenges/${encodedLabId}`);
        if (res.ok) {
          const data = await res.json();
          setChallenge(data.challenge);
          setAlreadyCompleted(!!data.alreadyCompleted);
        }
      } catch (err) {
        console.error("Failed to fetch challenge:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [labId]);

  const validateChallenge = useCallback(async (achievedValue: number, targetParam: string) => {
    try {
      const authCheck = await fetch("/api/auth/me");
      if (!authCheck.ok) return;

      const dateStr = new Date().toISOString();
      const res = await fetch("/api/challenges/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labId,
          targetParam,
          achievedValue,
          date: dateStr,
        }),
      });

      if (!res.ok) return;

      const data = await res.json();
      
      if (data.alreadyCompleted) {
        setAlreadyCompleted(true);
        return;
      }

      setResult(data);
      if (data.attempts !== undefined) {
        setAttempts(data.attempts);
      }

    } catch (err) {
      console.error("Failed to validate challenge:", err);
    }
  }, [labId]);

  return { challenge, loading, validateChallenge, result, attempts, alreadyCompleted };
}
