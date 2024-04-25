import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getCompletion = async (content) => {
  const res = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return res.choices[0].message.content;
};
