import path from 'path';
import { ChromaClient } from "chromadb";
import fs from 'fs';
import * as tf from '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api';

let optionsSSDMobileNet;

// Helper function, converts "descriptor" Int32Array to JavaScript array
const getArray = (array) => {
  let ret = [];
  for (let i = 0; i < array.length; i++) {
    ret.push(array[i]);
  }
  return ret;
};

// Compute the face embeddings within an image file
async function getEmbeddings(imageFile) {
  const buffer = fs.readFileSync(imageFile);
  const tensor = tf.node.decodeImage(buffer, 3);

  const faces = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet)
    .withFaceLandmarks()
    .withFaceDescriptors();
  tf.dispose(tensor);

  return faces.map(face => getArray(face.descriptor));
};

async function initializeFaceModels() {
  console.log("Initializing FaceAPI...");

  await tf.ready();
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('../');
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5, maxResults: 1 });
  await faceapi.nets.faceLandmark68Net.loadFromDisk('model');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('model');

  return;
}

async function indexAllFaces(pathName, image, collection) {
  const embeddings = await getEmbeddings(pathName);

  let success = true;
  let inx = 1;
  for (let embedding of embeddings) {
    const data = {
      ids: [image + '-' + inx++],
      embeddings: [embedding],
      metadatas: [{ source: "imdb" }],
      documents: [image],
    };
    let res = await collection.add(data);

    if (res === true) {
      console.info(`Added image embedding for ${image} to collection.`);
    } else {
      console.error(res.error);
      success = false;
    }
  }
  return success;
}

async function findTopKMatches(collection, image, k) {
  let ret = [];

  let queryEmbeddings = await getEmbeddings(image);
  for (let queryEmbedding of queryEmbeddings) {
    let results = await collection.query({
      queryEmbeddings: queryEmbedding,
      nResults: k
    });

    ret.push(results);
  }
  return ret;
}

async function compareImages(file1, file2) {
  console.log(`Comparing images: ${file1}, ${file2}`);

  const desc1 = await getEmbeddings(file1);
  const desc2 = await getEmbeddings(file2);

  const distance = faceapi.euclideanDistance(desc1[0], desc2[0]);
  console.log(`L2 distance between most prominent detected faces: ${distance}`);
  console.log(`Similarity between most prominent detected faces: ${1 - distance}`);
};

// main for example
const client = new ChromaClient();
await initializeFaceModels();

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
  const formattedResults = matchResults.map(item => {
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

  return formattedResults;
} catch (err) {
  console.error("Error during face matching:", err);
  throw err;
}

// ES6 Export
export default {
  initializeFaceModels,
  compareImages,
  findTopKMatches,
  getEmbeddings,
  indexAllFaces,
}
