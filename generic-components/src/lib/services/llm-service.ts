'use server'

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { Ollama, Message, ChatResponse  } from "ollama"
import { ollama as o } from "ollama-ai-provider";


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

// function iteratorToStream(iterator: any) {
//   return new ReadableStream({
//     async pull(controller) {
//       const { value, done } = await iterator.next()

//       if (done) {
//         controller.close()
//       } else {
//         controller.enqueue(value)
//       }
//     },
//   })
// }

export interface OMessage {
    role: "user" | "assistant";
    content: string;
}
export async function chatStreaming(modelName:string, messages:Message[]):Promise<any> {
  const stream = createStreamableValue();
  const model = o(modelName);
  const history = messages.map(m => ({role: m.role, content: m.content} as OMessage));

  (async () => {
    console.log("begin of stream")
    console.log(history)
    console.log(model)
    const { textStream } = await streamText({
      model: model,
      messages: history,
    });

    for await (const text of textStream) {
      console.log("res text part ", text)
      stream.update(text);
    }

    stream.done();
  })().then(() => {});
  return {
    messages: history,
    newMessage: stream.value,
  };

  // const res = await ollama.chat({model, messages, stream:true})
  // const stream = iteratorToStream(res)

  // return stream

}

