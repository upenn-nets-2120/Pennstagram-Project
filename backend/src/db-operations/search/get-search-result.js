import { OpenAI, ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import config from '../../utils/searchConfig.json' assert { type: "json" };

const getVectorStore = async function(req) {
    if (vectorStore == null) {
        vectorStore = await Chroma.fromExistingCollection(new OpenAIEmbeddings(), {
            collectionName: "imdb_reviews2",
            url: "http://localhost:8000", // Optional, will default to this value
            });
    }
    return vectorStore;
}

const getSearchResult = async (username, context, searchQuery) => {
    const vs = await getVectorStore();
    const retriever = vs.asRetriever();

    const prompt = PromptTemplate.fromTemplate(`Use the following pieces of context to answer the Search Query at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use three sentences maximum and keep the answer as concise as possible.
    Always say "thanks for asking!" at the end of the answer.
    
    ${context}
    
    Search Query: ${searchQuery}
    
    Helpful Answer:`);
    const llm = new ChatOpenAI({
        api_key: config.open_ai_key,
        model: "gpt-3.5-turbo",
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

    console.log(searchQuery);

    result = await ragChain.invoke(searchQuery);
    console.log(result);
    return result;
}

export default getSearchResult;