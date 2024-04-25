import { getCompletion } from "../helpers/openai.mjs";

export const inprompt = async (task) => {
  const getNameQuestion = `What is the name of the person that this ${task.question} is about? Respond with 1 word.`;
  const name = await getCompletion(getNameQuestion);
  console.log(name);

  const context = task.input.find((ctx) => ctx.startsWith(name));
  console.log(context);

  const getAnswerQuestion = `What is the answer to question:${task.question}, given the context: ${context} Answer in Polish.`;

  return await getCompletion(getAnswerQuestion);
};
