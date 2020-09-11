import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRep = getRepository(Transaction);

    const transaction = await transactionRep.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found, please provide a valid id');
    }

    await transactionRep.delete(id);
  }
}

export default DeleteTransactionService;
