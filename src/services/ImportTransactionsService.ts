import { DeepPartial, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import parseTransactionFromCSV from '../utils/csvParseUtils';
import AppError from '../errors/AppError';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
}

interface BulkTransactionsDTO {
  title: string;
  value: number;
  type: string;
  category_id: string;
}

class ImportTransactionsService {
  async execute({ file }: Request): Promise<Transaction[]> {
    const transactions = await parseTransactionFromCSV(file);

    const trxRepository = getRepository(Transaction);

    const categoryService = new CreateCategoryService();
    const trxArray: Transaction[] = [];

    // eslint-disable-next-line
    for (let i = 0; i < transactions.length; i++) {
      const { title, type, value, category } = transactions[i];

      // eslint-disable-next-line
      const { id } = await categoryService.execute({ title: category });

      if (type !== 'income' && type !== 'outcome') {
        throw new AppError('Type must be either income or outcome');
      }

      // eslint-disable-next-line
      const trxResp = await trxRepository.save({
        title,
        type,
        value,
        category_id: id,
      });

      trxArray.push(trxResp);
    }

    return trxArray;
  }
}

export default ImportTransactionsService;
