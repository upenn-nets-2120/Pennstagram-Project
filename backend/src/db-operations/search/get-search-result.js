import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import config from './config.json' assert { type: "json" };

let vectorStore = null;

const getVectorStore = async function() {
    if (vectorStore == null) {
        vectorStore = await Chroma.fromExistingCollection(new OpenAIEmbeddings({
            apiKey: config.open_ai_key // Pass the API key here
        }), {
            collectionName: "all_appdata_embeddings", // Use the combined collection
            url: "http://localhost:8000",
        });
    }
    return vectorStore;
}

const getSearchResult = async (username, context, searchQuery) => {
    const vs = await getVectorStore();
    const retriever = vs.asRetriever();

    const prompt = `Use the following pieces of context to answer the Search Query at the end:
    ${context}
    Search Query: ${searchQuery}
    Helpful Answer:`;

    const llm = new ChatOpenAI({
        apiKey: config.open_ai_key, // Ensure API key is correctly referenced here too
        model: "gpt-3.5-turbo",
        temperature: 0
    });

    const ragChain = RunnableSequence.from([
        retriever.pipe(formatDocumentsAsString),
        prompt,
        llm,
    ]);

    const result = await ragChain.run(searchQuery);
    return result;
}

export default getSearchResult;
