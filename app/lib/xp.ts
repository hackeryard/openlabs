export function calculateLevel(xp: number): number {
  let level = 1;
  let requiredXP = 1000;
  let currentXP = xp;

  while (currentXP >= requiredXP) {
    currentXP -= requiredXP;
    level++;
    requiredXP = Math.floor(requiredXP * 1.5);
  }

  return level;
}

export function xpForNextLevel(level: number): number {
  let requiredXP = 1000;
  for (let i = 1; i < level; i++) {
    requiredXP = Math.floor(requiredXP * 1.5);
  }
  return requiredXP;
}

export function calculateXPReward(
  type: "simulation" | "exploration" | "editor",
  isChallenge: boolean,
  difficulty: "easy" | "medium" | "hard"
): number {
  let xp = 0;
  if (type === "simulation") xp = 30;
  else if (type === "exploration") xp = 20;
  else if (type === "editor") xp = 25;

  if (isChallenge) {
    if (difficulty === "easy") xp += 50;
    else if (difficulty === "medium") xp += 75;
    else if (difficulty === "hard") xp += 100;
  }

  return xp;
}
