import fs from 'fs/promises';
import { createReadStream } from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { createArrayCsvWriter } from 'csv-writer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = path.join(__dirname, 'raw');
const processed = path.join(__dirname, 'processed');

const store = [];
const broken = [];

const files = (await fs.readdir(raw)).map(f => path.join(raw, f));

// remove trailing quotes and semicolons
const cleanString = str => str.replace(/^"*(.*?)"*;*$/, '$1');

const promises = [];

for (const file of files) {
  const promise = new Promise(resolve => {
    const input = createReadStream(file);

    const rl = readline.createInterface({
      input,
      crlfDelay: Infinity
    });

    let first = true;

    rl.on('line', line => {
      if (first) return (first = false);

      const split = line.split(/,"{2,}/);
      const clean = split.map(cleanString);

      if (!/\d+/.test(clean[0])) {
        return broken.push(line);
      }

      store.push(clean);
    });

    input.on('end', resolve);
  });

  promises.push(promise);
}

await Promise.all(promises);

const csvWriter = createArrayCsvWriter({
  header: [
    'ID',
    'IdentNr',
    'Titel',
    'Beteiligte',
    'Bereich',
    'MatTech',
    'Objekttyp',
    'Datierung'
  ],
  path: path.join(processed, 'all.csv')
});

await Promise.all([
  csvWriter.writeRecords(store),
  fs.writeFile(path.join(processed, 'broken.csv'), broken.join('\n'))
]);

console.log('Done.', store.length);
