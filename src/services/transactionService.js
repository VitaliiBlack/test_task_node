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
    const {
      operation: { amount },
      type,
      date,
      user_id,
      user_type,
    } = transaction;

    const weekNumber = getYearWeek(new Date(date));

    if (!this.userCashOut[user_id]) {
      this.userCashOut[user_id] = {};
    }
    if (!this.userCashOut[user_id][weekNumber]) {
      this.userCashOut[user_id][weekNumber] = 0;
    }

    let commission = 0;

    if (type === 'cash_in') {
      commission = Math.min(
        amount * (this.cashInConfig.percents / 100),
        this.cashInConfig.max.amount,
      );
    } else if (type === 'cash_out') {
      if (user_type === 'natural') {
        const weekAmount = this.userCashOut[user_id][weekNumber];
        const freeAmount = Math.max(
          this.cashOutNaturalConfig.week_limit.amount - weekAmount,
          0,
        );
        const taxableAmount = Math.max(amount - freeAmount, 0);
        commission = taxableAmount * (this.cashOutNaturalConfig.percents / 100);
        this.userCashOut[user_id][weekNumber] += amount;
      } else if (user_type === 'juridical') {
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

/**
 * export only for testing purposes
 * @type {TransactionService}
 */
export { TransactionService };
