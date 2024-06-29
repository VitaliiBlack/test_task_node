import getYearWeek from '../utils/index.js';
import getCashInConfig from '../configs/cashInConfig.js';
import getCashOutNaturalConfig from '../configs/cashOutNaturalConfig.js';
import getCashOutJuridicalConfig from '../configs/cashOutJuridicalConfig.js';
import '../types/index.js';

/**
 * @typedef {import("../types/index.js").InputTransaction} InputTransaction
 */

class TransactionService {
  constructor() {
    this.userCashOut = {};
  }

  async init() {
    this.cashInConfig = await getCashInConfig();
    this.cashOutJuridicalConfig = await getCashOutJuridicalConfig();
    this.cashOutNaturalConfig = await getCashOutNaturalConfig();
  }

  /**
   * @param {InputTransaction} transaction
   * @returns {Promise<number>}
   */
  calculateCommission(transaction) {
    const operationType = transaction.type;
    const userType = transaction.user_type;
    const { amount } = transaction.operation;
    const userId = transaction.user_id;
    const date = new Date(transaction.date);
    const weekNumber = getYearWeek(date);

    if (!this.userCashOut[userId]) {
      this.userCashOut[userId] = {};
    }
    if (!this.userCashOut[userId][weekNumber]) {
      this.userCashOut[userId][weekNumber] = 0;
    }

    let commission = 0;

    if (operationType === 'cash_in') {
      commission = Math.min(
        amount * (this.cashInConfig.percents / 100),
        this.cashInConfig.max.amount,
      );
    } else if (operationType === 'cash_out') {
      if (userType === 'natural') {
        const weekAmount = this.userCashOut[userId][weekNumber];
        const freeAmount = Math.max(
          this.cashOutNaturalConfig.week_limit.amount - weekAmount,
          0,
        );
        const taxableAmount = Math.max(amount - freeAmount, 0);
        commission = taxableAmount * (this.cashOutNaturalConfig.percents / 100);
        this.userCashOut[userId][weekNumber] += amount;
      } else if (userType === 'juridical') {
        commission = Math.max(
          amount * (this.cashOutJuridicalConfig.percents / 100),
          this.cashOutJuridicalConfig.min.amount,
        );
      }
    }

    commission = Math.ceil(commission * 100) / 100;
    return commission.toFixed(2);
  }

  /**
   * @param {InputTransaction[]} transactions
   * @returns {number[]}
   */
  processTransactions(transactions) {
    return transactions.map((transaction) => {
      const commission = this.calculateCommission(transaction);
      return commission;
    });
  }
}

const transactionServiceInstance = new TransactionService();
export default transactionServiceInstance;

// export for testing not use in production
export { TransactionService };
