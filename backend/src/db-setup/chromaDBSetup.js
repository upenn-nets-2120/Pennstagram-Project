import { ChromaClient } from 'chromadb';
import { OpenAI } from 'openai';
import db from './db_access.js'; // Assuming db_access.js handles SQL connections
import config from './config.json' assert { type: "json" };

class CustomOpenAIEmbeddings {
    constructor(apiKey) {
        this.openai = new OpenAI( { apiKey: apiKey});
    }

    async generate(documents) {
        const embeddings = [];
        for (const document of documents) {
            const response = await this.openai.createEmbedding({
                model: "text-embedding-ada-002", // Specify the appropriate model
                input: document,
            });
            embeddings.push(response.data.embeddings[0].embedding);
        }
        return embeddings;
    }
}

async function indexTableData(client, collection, tableName, textField, idField) {
    const data = await db.send_sql(`SELECT ${idField}, ${textField} FROM ${tableName}`);
    const ids = data.map(item => `${tableName}-${item[idField]}`);
    const documents = data.map(item => item[textField]);

    // Attempt to add documents directly without pre-generating embeddings
    try {
        await collection.add({
            ids: ids,
            documents: documents // Assuming ChromaDB will handle embedding internally
        });
    } catch (error) {
        console.error(`Error adding documents to collection from ${tableName}:`, error);
    }
    console.log(`Indexed ${data.length} records from ${tableName}`);
}

async function indexAllData() {
    const client = new ChromaClient({
        endpoint: 'http://localhost:8000' // Replace with actual ChromaDB endpoint
    });

    const collection = await client.getOrCreateCollection({
        name: 'all_appdata_embeddings',
        embeddingFunction: new CustomOpenAIEmbeddings(config.open_ai_key)
    });

    await indexTableData(client, collection, 'users', 'username', 'userID');
    await indexTableData(client, collection, 'posts', 'caption', 'postID');
    await indexTableData(client, collection, 'hashtags', 'phrase', 'hashtagID');
    await indexTableData(client, collection, 'comments', 'content', 'commentID');
    await indexTableData(client, collection, 'actors', 'primaryName', 'actor_nconst_short');

    console.log('All data indexed into all_appdata_embeddings collection');
}

// Run the indexing function
indexAllData().catch(err => console.error('Error indexing data:', err));
