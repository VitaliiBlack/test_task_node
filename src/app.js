import fs from 'fs';
import path from 'path';
import transactionService from './services/transactionService.js';

const inputFilePath = process.argv[2];

if (!inputFilePath) {
  console.error('Please provide a path to the input file.');
  process.exit(1);
}

const inputData = JSON.parse(
  fs.readFileSync(path.resolve(inputFilePath), 'utf-8'),
);
(async () => {
  await transactionService.init();
  const results = transactionService.processTransactions(inputData);

  results.forEach((result) => {
    console.log(result);
  });
})();
