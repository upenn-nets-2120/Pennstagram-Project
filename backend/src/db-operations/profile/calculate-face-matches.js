// database operations corresponding to profileUpdates.js backend routes
import {
    getUser,
    getProfilePic
} from '../index.js';
import face_api from '../../utils/actor-face-match/index.js';
import { ChromaClient } from "chromadb";
import fs from 'fs';
import path from 'path';

const calculateFaceMatches = async (username) => {
    // retrieve user profile photo from username
    const user = await getUser(username);
    const profilePic = user[0].profilePicURL;

    const client = new ChromaClient();
    await face_api.initializeFaceModels();

    const collection = await client.getOrCreateCollection({
        name: "face-api",
        embeddingFunction: null,
        metadata: { "hnsw:space": "l2" },
    });

    console.info("Looking for files");
    const promises = [];
    
    // Loop through all the files in the images directory
    const files = await fs.promises.readdir("./src/utils/actor-face-match/images");
    files.forEach((file, index) => {
        console.info("Adding task for " + file + " to index.");
        promises.push(face_api.indexAllFaces(path.join("./src/utils/actor-face-match/images", file), file, collection));
    });

    console.info("Done adding promises, waiting for completion.");
    await Promise.all(promises);
    console.info("All images indexed.");

    console.log('\nTop-k indexed matches to ' + profilePic + ':');
    const matchResults = await face_api.findTopKMatches(collection, profilePic, 5);

    // Package the results into the desired format
    const topMatches = matchResults.map(item => {
        const results = [];
        for (let i = 0; i < item.ids[0].length; i++) {
            const imageFile = item.documents[0][i];
            const actorNconst = imageFile.replace('.jpg', ''); // Assuming the file name is the nconst
            results.push({
                image_file: imageFile,
                actor_nconst: actorNconst
            });
        }
        return results;
    });

    // Flatten the array of arrays to a single array
    const flattenedTopMatches = topMatches.flat();
    
    return {
        top_matches: flattenedTopMatches
    };
};

export default calculateFaceMatches;


// const calculateFaceMatches = async (username) => {
//     // retrieve user profile photo from username
//     const user = await getUser(username);
//     const profilePic = user[0].profilePicURL;

//     const client = new ChromaClient();
//     face_api.initializeFaceModels()
//     .then(async () => {

//         const collection = await client.getOrCreateCollection({
//             name: "face-api",
//             embeddingFunction: null,
//             // L2 here is squared L2, not Euclidean distance
//             metadata: { "hnsw:space": "l2" },
//         });

//         console.info("Looking for files");
//         const promises = [];
        
//         // Loop through all the files in the images directory
//         fs.readdir("./src/utils/actor-face-match/images", function (err, files) {
//             if (err) {
//                 console.error("Could not list the directory.", err);
//                 process.exit(1);
//             }

//             files.forEach(function (file, index) {
//                 console.info("Adding task for " + file + " to index.");
//                 promises.push(face_api.indexAllFaces(path.join("./src/utils/actor-face-match/images", file), file, collection));
//             });
//             console.info("Done adding promises, waiting for completion.");
//             Promise.all(promises)
//             .then(async (results) => {
//                 console.info("All images indexed.");

//                 console.log('\nTop-k indexed matches to ' + profilePic + ':');
//                 for (var item of await face_api.findTopKMatches(collection, profilePic, 5)) {
//                     for (var i = 0; i < item.ids[0].length; i++) {
//                         console.log(item.ids[0][i] + " (Euclidean distance = " + Math.sqrt(item.distances[0][i]) + ") in " + item.documents[0][i]);
//                     }
//                 }
        
//             }).catch((err) => {
//                 console.error("Error indexing images:", err);
//             });
//         });
//     });
    
    // const client = new ChromaClient();
    // await face_match.initializeFaceModels();

    // let formattedResults;
    // try {
    //     const collection = await client.getOrCreateCollection({
    //         name: "face-api",
    //         embeddingFunction: null,
    //         metadata: { "hnsw:space": "l2" },
    //       });

    //     console.info("Looking for files");
    //     const files = await fs.promises.readdir("./src/utils/actor-face-match/images");
    //     const indexPromises = files.map(file => face_match.indexAllFaces(path.join("./src/utils/actor-face-match/images", file), file, collection));
    //     await Promise.all(indexPromises);
    //     console.info("All images indexed.");

    //     console.log(`\nTop-k indexed matches to ${profilePic}:`);
    //     for (var item of await face_match.findTopKMatches(collection, profilePic, 5)) {
    //         for (var i = 0; i < item.ids[0].length; i++) {
    //             console.log(item.ids[0][i] + " (Euclidean distance = " + Math.sqrt(item.distances[0][i]) + ") in " + item.documents[0][i]);
    //         }
    //     }

        // const matchResults = await face_match.findTopKMatches(collection, profilePic, 5);
        // formattedResults = matchResults.map(item => {
        //   const results = [];
        //   for (let i = 0; i < item.ids[0].length; i++) {
        //     const resultDetails = {
        //       id: item.ids[0][i],
        //       distance: Math.sqrt(item.distances[0][i]),
        //       document: item.documents[0][i]
        //     };
        //     console.log(`${resultDetails.id} (Euclidean distance = ${resultDetails.distance}) in ${resultDetails.document}`);
        //     results.push(resultDetails);
        //   }
        //   return results;
        // });
    // } catch (err) {
    //     console.error("Error during face matching:", err);
    //     throw err;
    // }

    // return formattedResults;
// };
 
// export default calculateFaceMatches;
