'use server'

import { Ollama, Message } from "ollama"

const { OLLAMA_BASE_URL } = process.env;

const ollama = new Ollama({host: OLLAMA_BASE_URL})


export async function getListOfLLMModels():Promise<string[]> {
  const res = (await ollama.list()).models.map(m => m.name)
  return res
}

export async function chat(model:string, messages:Message[]):Promise<string> {
  const res = await ollama.chat({model, messages})
  return res.message.content
}

