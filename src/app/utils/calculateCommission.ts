// utils/calculate.ts

export const calculateFeeAndCommissions = (
  amount: number,
  percentageAgent = 22.22,
  percentageAdmin = 77.78
) => {
  const fee = (amount / 1000) * 18;
  const agentCommission = +(fee * (percentageAgent / 100)).toFixed(2);
  const adminCommission = +(fee * (percentageAdmin / 100)).toFixed(2);
  return { fee, agentCommission, adminCommission };
};
