import Transaction from '../models/Transaction';
import parseTransactionFromCSV from '../utils/csvParseUtils';

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

class ImportTransactionsService {
  async execute({ file }: Request): Promise<Transaction[]> {
    const transactions = await parseTransactionFromCSV(file);
    console.log(transactions);
  }
}

export default ImportTransactionsService;
