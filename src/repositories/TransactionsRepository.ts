import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const { income, outcome } = transactions.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === 'income') {
          accumulator.income += currentValue.value;
        } else {
          accumulator.outcome += currentValue.value;
        }
        return accumulator;
      },
      balance,
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
