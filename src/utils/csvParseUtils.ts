import fs from 'fs';
import csvParser from 'csv-parse';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface TransactionDTO {
  title: string;
  type: string;
  value: number;
  category: string;
}

interface FileDTO {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export default function parseTransactionFromCSV(
  file: FileDTO,
): Promise<TransactionDTO[]> {
  const output: string[][] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csvParser({ delimiter: ',' }))
      .on('data', data => {
        output.push(data);
      })
      .on('error', err => {
        console.error(err);
        reject(new AppError('CSV parsing error!'));
      })
      .on('end', () => {
        const headers = output.shift();

        if (headers?.length !== 4) {
          reject(
            new AppError(
              'Headers are wrong on CSV file, please provide at least 4 headers with correct keys',
            ),
          );
        }

        const transactions = output.map(element => {
          return {
            title: element[0].trim(),
            type: element[1].trim(),
            value: Number(element[2].trim()),
            category: element[3].trim(),
          };
        });
        resolve(transactions);
      });
  });
}
