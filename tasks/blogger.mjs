import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prepareChapter = async (title) => {
  return openai.chat.completions.create({
    messages: [{ role: "user", content: title }],
    model: "gpt-3.5-turbo",
  });
};
export const blogger = async (task) => {
  const results = await Promise.all(
    task.blog.map((title) => prepareChapter(title)),
  );

  return results.map((result) => result.choices[0].message.content);
};
