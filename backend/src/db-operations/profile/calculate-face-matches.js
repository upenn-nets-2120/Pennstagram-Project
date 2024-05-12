// database operations corresponding to profileUpdates.js backend routes
import {
    getUser
} from '../index.js';
import {
  initializeFaceModels,
  findTopKMatches,
  indexAllFaces
} from '../../utils/actor-face-match/index.js';
import { ChromaClient } from "chromadb";

const calculateFaceMatches = async (username) => {
    // retrieve user profile photo from username
    const user = await getUser(username);
    const profilePic = await getS3Image(user.userProfilePic);
    
    const client = new ChromaClient();
    await initializeFaceModels();

    let formattedResults;
    try {
        const collection = await client.getOrCreateCollection({
            name: "face-api",
            embeddingFunction: null,
            metadata: { "hnsw:space": "l2" },
          });

        console.info("Looking for files");
        const files = await fs.promises.readdir("images");
        const indexPromises = files.map(file => indexAllFaces(path.join("images", file), file, collection));
        await Promise.all(indexPromises);
        console.info("All images indexed.");

        console.log(`\nTop-k indexed matches to ${profilePhoto}:`);

        const matchResults = await findTopKMatches(collection, profilePhoto, 5);
        formattedResults = matchResults.map(item => {
          const results = [];
          for (let i = 0; i < item.ids[0].length; i++) {
            const resultDetails = {
              id: item.ids[0][i],
              distance: Math.sqrt(item.distances[0][i]),
              document: item.documents[0][i]
            };
            console.log(`${resultDetails.id} (Euclidean distance = ${resultDetails.distance}) in ${resultDetails.document}`);
            results.push(resultDetails);
          }
          return results;
        });
    } catch (err) {
        console.error("Error during face matching:", err);
        throw err;
    }

    return formattedResults;
};
 
export default calculateFaceMatches;
