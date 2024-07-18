'use server'
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Document } from "@langchain/core/documents";
import { VectorStore, VectorStoreRetriever } from "@langchain/core/vectorstores";
import { ChromaClient } from "chromadb";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { PromptTemplate } from "@langchain/core/prompts";


const chroma = new ChromaClient({ path: "http://localhost:8000" });

const { OLLAMA_BASE_URL } = process.env;

const vectorStores: { [key: string]: VectorStore } = {}


const buildCollectionName = (currentUserName: string, currentProject: string) => {
  return "docs_" + currentUserName.replace(" ", "") + "_" + currentProject
}

export const removeIndex = async (currentUserName: string, currentProject: string) => {
  'use server'
  const collectionName = buildCollectionName(currentUserName, currentProject)
  await chroma.deleteCollection({ name: collectionName })
  // await vectorStores[collectionName].delete({})
}

export const indexDocuments = async (docs: Document[], currentUserName: string, currentProject: string, model:string) => {
  'use server'

  try {
    const collectionName = buildCollectionName(currentUserName, currentProject)
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 10 })
    const splittedDocs = await splitter.splitDocuments(docs)
    console.log("INDEXED DOCS ....", docs.length, collectionName)
    // const ids = Array.from(Array(docs.length).keys())
    const vectorStore = await Chroma.fromDocuments(splittedDocs, new OllamaEmbeddings({
      baseUrl: OLLAMA_BASE_URL,
      requestOptions: { temperature: 0.2, mirostat: 2.0 },
      maxConcurrency: 2,
      model: model //"mxbai-embed-large"//"nomic-embed-text:latest"

    }),
      {
        collectionName: collectionName,
        url: "http://localhost:8000", // Optional, will default to this value
        // collectionMetadata: {
        //   "hnsw:space": "cosine",
        // }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
      })





    vectorStores[collectionName] = vectorStore
    // const res = await retriever.invoke("what is attention?")
    // console.log(res)
  } catch (error) {
    return "ko " + error
  }
  return "ok"

}


export const retrieveFromDocs = async (currentUserName: string, currentProject: string, input: string) => {
  'use server'
  const v = vectorStores[buildCollectionName(currentUserName, currentProject)]
  const retriever = v.asRetriever()
  retriever.k = 8
  const docs = (await retriever.invoke(input))
  console.log("found ", docs.length, " docs")
  const res = docs.map(d => d.pageContent).join("\n\n\n") //(await retriever.invoke(input)).map(d => d.pageContent).join("\n\n\n")
  return res
}


export const detectLanguage = async (extract:string, model:string) => {
  'use server'
  const llm = new ChatOllama({model: model, temperature: 0.3})
  
  extract = extract.substring(0, Math.max(1000, extract.length-1))
  const language = (await llm.invoke("return the language used in the following extract: " + extract 
    + "\n\n Return only the name of the language")).content
  return language
}

export const summarizeDocs = async (docs: Document[], currentUserName: string, currentProject: string, model:string) => {
  'use server'
  try {
    const collectionName = buildCollectionName(currentUserName, currentProject)
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000, chunkOverlap: 10 })
    const splittedDocs = await splitter.splitDocuments(docs)
    console.log("DOCS TO SUMMARIZE ....", docs.length, collectionName)
    
    let extract = splittedDocs.map(d => d.pageContent).join("\n")
    // extract = extract.substring(0, Math.max(1000, extract.length-1))

    const llmSummary = new ChatOllama({model: model, temperature: 0.3})
    const language = await detectLanguage(extract, model)// (await llmSummary.invoke("return the language used in the following extract: " + extract)).content
    console.log("language: " + language)
    const summaryTemplate = `
    You are an expert in summarizing paragraphs of text coming from pdf files.
    Your goal is to create a precise summary representing the content of the documents given as input.
    When creating the summary, use the language of the text to summarize.
    {language}
    Below you find the first paragraphs to summarize:
    
    ---------
    {text}
    ---------
    
    SUMMARY:
    `
    const summaryPrompt = PromptTemplate.fromTemplate(summaryTemplate)
    const summaryRefineTemplate = `
    You are an expert in summarizing paragraphs of text coming from pdf files.
    Your goal is to create a precise summary representing the content of the documents given as input.
    When generating the summary, use the language of the text to summarize.
    When creating the summary, use the language of the text to summarize.
    {language}
    We have provided an existing summary up to a certain point: {existing_answer}
    
    Below you find a new set of paragraphs:
    ---------
    {text}
    ---------

    Given the new context, refine the summary.
    If the context is not useful, return the original summary.

    Return only the summary, no comments before or after.
    `
    const summaryRefinePrompt = PromptTemplate.fromTemplate(summaryRefineTemplate)
    const summarizeChain = loadSummarizationChain(llmSummary, {
      type: "refine",
      verbose: true,
      questionPrompt: summaryPrompt,
      refinePrompt: summaryRefinePrompt
    })

    const summary = await summarizeChain.invoke({"input_documents": splittedDocs, "language": language})
    return summary["output_text"]
  
  } catch(error) {
    return "error: " + error
  }
}