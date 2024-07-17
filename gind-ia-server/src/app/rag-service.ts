'use server'
import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Document } from "@langchain/core/documents";
import { UserDocument } from "@gind-ia-platform/generic-components";
import { VectorStore, VectorStoreRetriever } from "@langchain/core/vectorstores";
import { ChromaClient } from "chromadb";
const chroma = new ChromaClient({ path: "http://localhost:8000" });

const { OLLAMA_BASE_URL } = process.env;

const vectorStores:{[key:string]: VectorStore} = {}


const buildCollectionName = (currentUserName: string, currentProject: string) => {
  return "docs_" + currentUserName.replace(" ", "") + "_" + currentProject
}

export const removeIndex = async (currentUserName: string, currentProject: string) => {
  const collectionName = buildCollectionName(currentUserName, currentProject)
  await chroma.deleteCollection({name:collectionName})
  // await vectorStores[collectionName].delete({})
}

export const  indexDocuments = async (docs: Document[], currentUserName: string, currentProject: string) => {
  'use server'
  const collectionName = buildCollectionName(currentUserName, currentProject)
  console.log("INDEXED DOCS ....",docs.length, collectionName)
  // const ids = Array.from(Array(docs.length).keys())
  const vectorStore = await Chroma.fromDocuments(docs, new OllamaEmbeddings({
    baseUrl: OLLAMA_BASE_URL,
    model:"nomic-embed-text:latest"
  }),
  {
    collectionName: collectionName,
    url: "http://localhost:8000", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
  } )

  
  

  
  vectorStores[collectionName] = vectorStore
  // const res = await retriever.invoke("what is attention?")
  // console.log(res)
  return "ok"

}


export const retrieveFromDocs = async (currentUserName: string, currentProject: string, input:string) => {
  const v = vectorStores[buildCollectionName(currentUserName, currentProject)]
  const retriever = v.asRetriever()
  const docs = (await retriever.invoke(input)).map(d => d.pageContent).join("\n\n\n") //(await retriever.invoke(input)).map(d => d.pageContent).join("\n\n\n")
  return docs
}


