import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';
import csv from 'csv-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const processed = path.join(__dirname, 'processed');
const file = path.join(processed, 'all.csv');

const departments = new Map();

fs.createReadStream(file)
  .pipe(csv())
  .on('data', item => {
    const departmentName = item.Bereich;

    if (!departments.has(departmentName)) departments.set(departmentName, []);

    const department = departments.get(departmentName);
    department.push(item);
  })
  .on('end', async () => {
    console.log('done sorting.');

    for (const [_departmentName, department] of departments) {
      const departmentName =
        _departmentName?.replace(/\//g, '-').slice(0, 20) || 'no-department';

      const csvWriter = createObjectCsvWriter({
        path: path.join(processed, 'by-department', `${departmentName}.csv`),
        header: [
          'ID',
          'IdentNr',
          'Titel',
          'Beteiligte',
          'Bereich',
          'MatTech',
          'Objekttyp',
          'Datierung'
        ].map(title => ({ id: title, title }))
      });

      await csvWriter.writeRecords(department);
    }

    console.log('Done.');
  });
