import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import addUser from '../../db-operations/registration/add-user.js';
import uploadImageToS3 from '../../db-operations/s3-operations/uploadImageToS3.js'; // Ensure the correct path

// Construct __dirname based on the file URL of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    .on('end', async () => {
      console.log('CSV file has been read and parsed');
      await insertDataIntoDB(db, results);
    });
};

// Helper function to clean primaryName
function cleanPrimaryName(name) {
  return name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
}

async function insertDataIntoDB(db, data) {
  const imagesDir = path.resolve(__dirname, '../../utils/actor-face-match/images/');

  for (const item of data) {
    // Escape single quotes in primaryName
    const fixedPrimaryName = item.primaryName.replace(/'/g, "''");

    // Check if the image exists
    const imageFileName = `${item.nconst_short}.jpg`;
    const imagePath = path.join(imagesDir, imageFileName);
    let localActorImage = null;

    if (fs.existsSync(imagePath)) {
      try {
        const imageFile = {
          originalname: imageFileName,
          buffer: fs.readFileSync(imagePath),
          mimetype: 'image/jpeg',
        };
        localActorImage = await uploadImageToS3(imageFile, false);
      } catch (error) {
        console.error('Error uploading image to S3:', error);
      }
    }

    // Only proceed if there's a localActorImage
    if (localActorImage) {
      // Insert actor into the actors table
      const actorQuery = `
        INSERT INTO actors (primaryName, birthYear, deathYear, actor_nconst_short, local_actor_image)
        VALUES ('${fixedPrimaryName}', ${item.birthYear === null ? 'NULL' : item.birthYear}, ${item.deathYear === null ? 'NULL' : item.deathYear}, '${item.nconst_short}', '${localActorImage}')
      `;

      try {
        await db.send_sql(actorQuery);
        console.log(`Inserted actor: ${fixedPrimaryName}`);
      } catch (error) {
        console.error(`Error inserting actor ${fixedPrimaryName}:`, error);
      }

      // Create user profile for the actor
      const cleanedPrimaryName = cleanPrimaryName(item.primaryName);
      const username = `user-${cleanedPrimaryName}`;
      const password = `pass-${cleanedPrimaryName}`;
      const email = `${cleanedPrimaryName}@gmail.com`;
      const affiliation = 'actor';
      const birthday = 'actor-birthday';
      const userVisibility = 'public';
      const linkedActor = item.nconst_short; // Set the linked_actor_nconst

      try {
        await addUser(username, password, email, affiliation, birthday, userVisibility, linkedActor);
        console.log(`Created user profile for actor: ${fixedPrimaryName}`);
      } catch (error) {
        console.error(`Error creating user profile for actor ${fixedPrimaryName}:`, error);
      }
    }
  }
}

export default actorsLoadTable;
