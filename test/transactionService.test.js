import { TransactionService } from '../src/services/transactionService.js';
import getYearWeek from '../src/utils/index.js';
import getCashInConfig from '../src/configs/cashInConfig.js';
import getCashOutNaturalConfig from '../src/configs/cashOutNaturalConfig.js';
import getCashOutJuridicalConfig from '../src/configs/cashOutJuridicalConfig.js';

jest.mock('../src/utils/index.js');
jest.mock('../src/configs/cashInConfig.js');
jest.mock('../src/configs/cashOutNaturalConfig.js');
jest.mock('../src/configs/cashOutJuridicalConfig.js');

describe('TransactionService', () => {
  let transactionService;

  beforeEach(async () => {
    getCashInConfig.mockResolvedValue({
      percents: 0.03,
      max: { amount: 5, currency: 'EUR' },
    });

    getCashOutNaturalConfig.mockResolvedValue({
      percents: 0.3,
      week_limit: { amount: 1000, currency: 'EUR' },
    });

    getCashOutJuridicalConfig.mockResolvedValue({
      percents: 0.3,
      min: { amount: 0.5, currency: 'EUR' },
    });

    transactionService = new TransactionService();
    await transactionService.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateCommission', () => {
    it('should calculate cash in commission correctly', async () => {
      const transaction = {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200.0, currency: 'EUR' },
      };

      const commission =
        await transactionService.calculateCommission(transaction);
      expect(commission).toBe('0.06');
    });

    it('should limit cash in commission to max amount', async () => {
      const transaction = {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 100000.0, currency: 'EUR' },
      };

      const commission =
        await transactionService.calculateCommission(transaction);
      expect(commission).toBe('5.00');
    });

    it('should calculate cash out commission for natural user correctly', async () => {
      getYearWeek.mockReturnValue('2016-01');
      const transaction = {
        date: '2016-01-06',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 30000, currency: 'EUR' },
      };

      const commission =
        await transactionService.calculateCommission(transaction);
      expect(commission).toBe('87.00');
    });

    it('should calculate cash out commission for juridical user correctly', async () => {
      const transaction = {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: { amount: 300.0, currency: 'EUR' },
      };

      const commission =
        await transactionService.calculateCommission(transaction);
      expect(commission).toBe('0.90');
    });

    it('should limit cash out commission to min amount for juridical user', async () => {
      const transaction = {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: { amount: 100.0, currency: 'EUR' },
      };

      const commission =
        await transactionService.calculateCommission(transaction);
      expect(commission).toBe('0.50');
    });

    it('should calculate cash out commission for natural user within weekly limit', async () => {
      getYearWeek.mockReturnValue('2016-02');
      const transaction1 = {
        date: '2016-02-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000.0, currency: 'EUR' },
      };

      const commission =
        await transactionService.calculateCommission(transaction1);
      expect(commission).toBe('0.00');
    });

    it('should calculate cash out commission for natural user exceeding weekly limit', async () => {
      getYearWeek.mockReturnValue('2016-02');
      const transaction1 = {
        date: '2016-02-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000.0, currency: 'EUR' },
      };
      const transaction2 = {
        date: '2016-02-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 2000.0, currency: 'EUR' },
      };

      await transactionService.calculateCommission(transaction1); // add first transaction to week limit
      const commission =
        await transactionService.calculateCommission(transaction2); // check commission for second transaction
      expect(commission).toBe('6.00'); // only 2000 EUR is taxable at 0.3%
    });

    it('should handle multiple cash out transactions within the same week correctly', async () => {
      getYearWeek.mockReturnValue('2016-03');
      const transaction1 = {
        date: '2016-03-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 400.0, currency: 'EUR' },
      };
      const transaction2 = {
        date: '2016-03-02',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 600.0, currency: 'EUR' },
      };
      const transaction3 = {
        date: '2016-03-03',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 500.0, currency: 'EUR' },
      };

      await transactionService.calculateCommission(transaction1);
      await transactionService.calculateCommission(transaction2);
      const commission =
        await transactionService.calculateCommission(transaction3);
      expect(commission).toBe('1.50'); // only 500 EUR is taxable at 0.3%
    });
  });

  describe('processTransactions', () => {
    it('should process transactions and return commissions', async () => {
      getYearWeek.mockReturnValue('2016-01');
      const transactions = [
        {
          date: '2016-01-05',
          user_id: 1,
          user_type: 'natural',
          type: 'cash_in',
          operation: { amount: 200.0, currency: 'EUR' },
        },
        {
          date: '2016-01-06',
          user_id: 2,
          user_type: 'juridical',
          type: 'cash_out',
          operation: { amount: 300.0, currency: 'EUR' },
        },
        {
          date: '2016-01-06',
          user_id: 1,
          user_type: 'natural',
          type: 'cash_out',
          operation: { amount: 30000, currency: 'EUR' },
        },
        {
          date: '2016-01-07',
          user_id: 1,
          user_type: 'natural',
          type: 'cash_out',
          operation: { amount: 1000.0, currency: 'EUR' },
        },
      ];

      const commissions =
        await transactionService.processTransactions(transactions);
      expect(commissions).toEqual(['0.06', '0.90', '87.00', '3.00']);
    });
  });
});
