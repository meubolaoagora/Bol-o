type BolaoWithInscriptionsAndRules = {
  quotaValue: number;
  orgFeePercent: number;
  inscriptions: { paymentStatus: string }[];
  prizeRules: { position: number; percentage: number }[];
};

export type PrizeCalculation = {
  totalCollected: number;
  orgFee: number;
  netPot: number;
  positionPrizes: { position: number; amount: number }[];
};

export function calculatePrize(bolao: BolaoWithInscriptionsAndRules): PrizeCalculation {
  // Only count confirmed inscriptions for total collected
  const confirmedCount = bolao.inscriptions.filter(
    (i) => i.paymentStatus === "CONFIRMED"
  ).length;

  const totalCollected = confirmedCount * bolao.quotaValue;
  
  const orgFee = (totalCollected * bolao.orgFeePercent) / 100;
  const netPot = totalCollected - orgFee;

  const positionPrizes = bolao.prizeRules
    .sort((a, b) => a.position - b.position)
    .map((rule) => {
      const amount = (netPot * rule.percentage) / 100;
      return {
        position: rule.position,
        amount,
      };
    });

  return {
    totalCollected,
    orgFee,
    netPot,
    positionPrizes,
  };
}
