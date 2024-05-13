import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import config from './config.json' assert { type: "json" };

let vectorStore = null;

const getVectorStore = async function() {
    if (vectorStore == null) {
        vectorStore = await Chroma.fromExistingCollection(new OpenAIEmbeddings({
            apiKey: config.open_ai_key
        }), {
            collectionName: "all_appdata_embeddings",
            url: "http://localhost:8000",
        });
    }
    return vectorStore;
}

const getSearchResult = async (username, context, searchQuery) => {
    const vs = await getVectorStore();
    const retriever = vs.asRetriever();

    // Ensure prompt is formatted as a runnable or function
    const prompt = PromptTemplate.fromTemplate(`Use the following pieces of context to answer the Search Query at the end. Feel free to make up information about users or actors you know about 
    Personalize the reply to the username and who their friends are, and state the name of the user when replying. Answer questions with ANY and ALL knowledge of actors, users, posts, hashtags, etc. that you might have. Always say "thanks for asking!" at the end of the answer.
    
    ${context}

    For user with username: ${username}
    
    Search Query: ${searchQuery}
        
    Helpful Answer:`);
    const llm = new ChatOpenAI({
        apiKey: config.open_ai_key,
        model: "gpt-3.5-turbo-16k-0613",
        temperature: 0
    });

    const ragChain = RunnableSequence.from([
        {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
          },
      prompt,
      llm,
      new StringOutputParser(),
    ]);

    let result = await ragChain.invoke(searchQuery);

    return result;
}

export default getSearchResult;
