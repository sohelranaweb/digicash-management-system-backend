"use strict";
// utils/calculate.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFeeAndCommissions = void 0;
const calculateFeeAndCommissions = (amount, percentageAgent = 22.22, percentageAdmin = 77.78) => {
    const fee = (amount / 1000) * 18;
    const agentCommission = +(fee * (percentageAgent / 100)).toFixed(2);
    const adminCommission = +(fee * (percentageAdmin / 100)).toFixed(2);
    return { fee, agentCommission, adminCommission };
};
exports.calculateFeeAndCommissions = calculateFeeAndCommissions;
