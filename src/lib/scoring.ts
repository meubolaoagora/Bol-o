import { prisma } from "./db";

type ScoringRules = {
  exactScorePoints: number;
  winnerDiffPoints: number;
  winnerOnlyPoints: number;
  wrongPoints: number;
};

export function calculatePoints(
  prediction: { predictedScoreA: number; predictedScoreB: number },
  actualScore: { scoreA: number; scoreB: number },
  rules: ScoringRules
): number {
  const { predictedScoreA, predictedScoreB } = prediction;
  const { scoreA, scoreB } = actualScore;

  // Exact score
  if (predictedScoreA === scoreA && predictedScoreB === scoreB) {
    return rules.exactScorePoints;
  }

  const predictedWinner =
    predictedScoreA > predictedScoreB
      ? "A"
      : predictedScoreA < predictedScoreB
      ? "B"
      : "DRAW";
  const actualWinner =
    scoreA > scoreB ? "A" : scoreA < scoreB ? "B" : "DRAW";

  // If winner is wrong, 0 points (or wrongPoints)
  if (predictedWinner !== actualWinner) {
    return rules.wrongPoints;
  }

  // Same winner and same goal difference
  const predictedDiff = Math.abs(predictedScoreA - predictedScoreB);
  const actualDiff = Math.abs(scoreA - scoreB);

  if (predictedDiff === actualDiff) {
    return rules.winnerDiffPoints;
  }

  // Same winner only
  return rules.winnerOnlyPoints;
}

export async function recalculateAllScores(gameId: number): Promise<void> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      bolao: true,
      predictions: true,
    },
  });

  if (!game || game.scoreA === null || game.scoreB === null) {
    throw new Error("Jogo inválido ou sem placar definido.");
  }

  const rules = {
    exactScorePoints: game.bolao.exactScorePoints,
    winnerDiffPoints: game.bolao.winnerDiffPoints,
    winnerOnlyPoints: game.bolao.winnerOnlyPoints,
    wrongPoints: game.bolao.wrongPoints,
  };

  const actualScore = {
    scoreA: game.scoreA,
    scoreB: game.scoreB,
  };

  for (const prediction of game.predictions) {
    const points = calculatePoints(
      {
        predictedScoreA: prediction.predictedScoreA,
        predictedScoreB: prediction.predictedScoreB,
      },
      actualScore,
      rules
    );

    if (points !== prediction.pointsEarned) {
      await prisma.prediction.update({
        where: { id: prediction.id },
        data: { pointsEarned: points },
      });
    }
  }
}
