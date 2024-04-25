import { JSONLoader } from "langchain/document_loaders/fs/json";
import { OpenAIEmbeddings } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";
import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();
const MEMORY_PATH = "archiwum_aidevs.json";
const COLLECTION_NAME = "unknow-news";

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });
const query =
  "Co różni pseudonimizację od anonimizowania danych? Podaj adres URL pod którym znajduje się odpowiedź.";
const queryEmbedding = await embeddings.embedQuery(query);
const result = await qdrant.getCollections();
const indexed = result.collections.find(
  (collection) => collection.name === COLLECTION_NAME,
);

console.log(result);
// Create collection if not exists
if (!indexed) {
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: 1536, distance: "Cosine", on_disk: true },
  });
}

const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);

// Index documents if not indexed
if (!collectionInfo.points_count) {
  // Read File
  const loader = new JSONLoader(MEMORY_PATH);
  let memory = await loader.load();

  // Add metadata
  const documents = memory.map((document) => {
    document.metadata.source = COLLECTION_NAME;
    document.metadata.content = document.pageContent;
    document.metadata.uuid = uuidv4();
    return document;
  });

  console.log(documents);

  // Generate embeddings
  const points = [];
  for (const [index, document] of documents.entries()) {
    console.log(`processing document ${index} of ${documents.length}`);
    const [embedding] = await embeddings.embedDocuments([document.pageContent]);
    points.push({
      id: document.metadata.uuid,
      payload: document.metadata,
      vector: embedding,
    });
  }

  // Index
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    batch: {
      ids: points.map((point) => point.id),
      vectors: points.map((point) => point.vector),
      payloads: points.map((point) => point.payload),
    },
  });

  console.log("indexed");
}

export const search = async () => {
  const searchResult = await qdrant.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: 1,
    filter: {
      must: [
        {
          key: "source",
          match: {
            value: COLLECTION_NAME,
          },
        },
      ],
    },
  });

  console.log(searchResult);

  return searchResult[0].payload.content;
};
