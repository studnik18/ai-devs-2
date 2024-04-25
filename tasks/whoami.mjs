import { getRefreshedToken, getTask, sendAnswer } from "../helpers/api.mjs";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();
const documents = [];
const query = "Odpowiedz kim jest tajemnicza osoba.";
const chat = new ChatOpenAI({
  apiKey: process.env.CHAIN_API_KEY,
});

const refreshTokenAndGetTask = async () => {
  const token = await getRefreshedToken("whoami");
  return await getTask(token);
};

export const whoami = async () => {
  const task = await refreshTokenAndGetTask();
  console.log(task);
  documents.push(new Document({ pageContent: task.hint }));
  console.log(documents);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings(),
  );
  const context = await vectorStore.similaritySearchVectorWithScore(query, 1);
  console.log(context);
  const { content } = await chat.invoke([
    new SystemMessage(`
  Korzystając z ogółu informacji odpowiedz krótko kim jest tajemnicza osoba, ale tylko, jeśli jesteś absolutnie pewny odpowiedzi.
  Nie zgaduj! Jeśli nie jesteś pewien, odpowiedz "Nie wiem.".
  Podpowiedzi znajdują się w kontekście. W odpowiedzi podaj tylko imię i nazwisko.
  kontekst###${context?.[0]?.[0].pageContent}###
  `),
    new HumanMessage(query),
  ]);
  console.log(content);

  if (content === "Nie wiem.") {
    whoami();
  } else {
    getRefreshedToken("whoami").then((token) => {
      sendAnswer(token, content).then((res) => {
        console.log(res);
      });
    });
  }
};

// whoami();
