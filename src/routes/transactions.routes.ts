import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import GetTransactionsService from '../services/GetTransactionsService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const getTransactionsService = new GetTransactionsService();
  const transactions = await getTransactionsService.execute();
  return response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    category,
    type,
    value,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();
  const entity = await deleteTransactionService.execute({ id });

  return response.json(entity);
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { file } = request;

    const importTransactionService = new ImportTransactionsService();
    const transactions = await importTransactionService.execute({ file });

    return response.json(transactions);
  },
);

export default transactionsRouter;
