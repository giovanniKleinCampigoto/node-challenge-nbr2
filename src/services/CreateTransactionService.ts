import { getCustomRepository } from 'typeorm';

import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionDTO): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Provide either income or outcome as a type');
    }

    const transactionRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && (balance.total === 0 || value > balance.total)) {
      throw new AppError('Not enough funds');
    }

    const categoryService = new CreateCategoryService();
    const categoryResp = await categoryService.execute({ title: category });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryResp.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
