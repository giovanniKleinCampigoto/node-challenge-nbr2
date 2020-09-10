import { getRepository } from 'typeorm';

import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

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

    const categoryService = new CreateCategoryService();
    const categoryResp = await categoryService.execute({ title: category });

    const transactionRepository = getRepository(Transaction);

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
