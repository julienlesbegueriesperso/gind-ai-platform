'use server'
import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Document } from "@langchain/core/documents";
// import { ChromaClient } from "chromadb";
// const chroma = new ChromaClient({ path: "http://localhost:8000" });

const { OLLAMA_BASE_URL } = process.env;

export const  indexDocuments = async (docs:Document[]) => {
  'use server'

  console.log("INDEXED DOCS ....",docs.length)
  const vectorStore = await Chroma.fromDocuments(docs, new OllamaEmbeddings({
    baseUrl: OLLAMA_BASE_URL,
    model:"llama3:8b"
  }),
  {
    collectionName: "a-test-collection",
    url: "http://localhost:8000", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
  } )

  const retriever = vectorStore.asRetriever()
  const res = await retriever.invoke("what is attention?")
  console.log(res)
  return res


}
