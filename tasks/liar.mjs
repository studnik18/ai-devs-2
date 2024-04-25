import { openai } from "../helpers/openai.mjs";

const checkAnswer = async (question, answer) => {
  return openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Does "${answer}" make sense as an answer to question:${question}? Respond with YES if yes and NO if no`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
};

export const liar = async (task, token) => {
  const question = "Why is Earth round";
  const formData = new FormData();
  formData.append("question", question);

  const res = await fetch(`https://tasks.aidevs.pl/task/${token}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const result = await checkAnswer(question, data.answer);

  return result.choices[0].message.content;
};
