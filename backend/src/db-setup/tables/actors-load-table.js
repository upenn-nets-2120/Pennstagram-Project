import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Construct __dirname based on the file URL of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const actorsLoadTable = async (db) => {
  const results = [];

  // Construct an absolute path to the CSV file
  const csvFilePath = path.resolve(__dirname, '../../utils/actor-face-match/names.csv');

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      // Modify data to handle \N values appropriately
      data.birthYear = data.birthYear === '\\N' ? null : parseInt(data.birthYear, 10);
      data.deathYear = data.deathYear === '\\N' ? null : parseInt(data.deathYear, 10);
      results.push(data);
    })
    .on('end', () => {
      console.log('CSV file has been read and parsed');
      insertDataIntoDB(db, results);
    });
};

function insertDataIntoDB(db, data) {
  data.forEach(item => {
    // Construct the query using `${}` string interpolation

    const fixedPrimaryName = item.primaryName.replace(/'/g, "''");

    const query = `
      INSERT INTO actors (primaryName, birthYear, deathYear, actor_nconst_short)
      VALUES ('${fixedPrimaryName}', ${item.birthYear === null ? 'NULL' : item.birthYear}, ${item.deathYear === null ? 'NULL' : item.deathYear}, '${item.nconst_short}')
    `;

    db.send_sql(query, [], (error, results) => {
      if (error) {
        console.error(error.message);
        return;
      }
      console.log('Inserted Row ID:', results.insertId);
    });
  });
}

export default actorsLoadTable;
