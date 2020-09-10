import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsDTO {
  transactions: Transaction[];
  balance: Balance;
}

class GetTransactionsService {
  public async execute(): Promise<TransactionsDTO> {
    const transactionsRep = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRep.find();

    const balance = await transactionsRep.getBalance();

    return {
      transactions,
      balance,
    };
  }
}

export default GetTransactionsService;
