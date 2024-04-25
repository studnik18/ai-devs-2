import { openai } from "../helpers/openai.mjs";

const getEmbedding = async (text) => {
  return openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
  });
};

export const embedding = async (task) => {
  const response = await getEmbedding("Hawaiian pizza");
  console.log(response.data[0].embedding);
  return response.data[0].embedding;
};
