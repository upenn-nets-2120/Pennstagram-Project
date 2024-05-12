import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { load } from "cheerio";
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import { env } from 'process';
const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: "apiKey", 
    model: "text-embedding-3-small"
})
import sql from './db_access';

export default {
    get_connection
}

async function get_connection() {
    // Create vector store and index the docs
    const vectorStore = await Chroma.fromExistingCollection(new OpenAIEmbeddings(), {
    collectionName: "imdb_reviews2",
    url: "http://localhost:8000", // Optional, will default to this value
    });

    console.log(vectorStore.collectionName);

    // Search for the most similar document
    const response = await vectorStore.similaritySearch("RENDITION", 1);
    return response;
}

async function get_collection() {
    const client = new ChromaClient({
        path: 'http://localhost:8000'
    });

  // Get all documents from the collection
//   const documents = await client.query('rendition');

  api_key = env.OPENAI_API_KEY;
  const emb_fn = new OpenAIEmbeddingFunction({
    openai_api_key: api_key, 
    model: "text-embedding-3-small"
  });

  const collections = await client.listCollections();

  console.log(collections);

//   const collection = client.collection('imdb_reviews');
  let collection = await client.getCollection({
    name: "imdb_reviews2",
    embeddingFunction: emb_fn,
  });
  console.log(collection);
  var items = await collection.peek(); // returns a list of the first 10 items in the collection
  var count = await collection.count(); // returns the number of items in the collection

  console.log(count);

  return items
}

get_connection().then((res) => {
    console.log(res)
    get_collection().then((res) => {
        console.log(res)
    })
})

