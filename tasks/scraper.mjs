import { openai } from "../helpers/openai.mjs";

const getContext = async (url) => {
  const maxRetries = 100;
  let retries = 0;
  let res = await fetch(url);
  console.log(res);
  if (!res.ok && retries <= maxRetries) {
    retries++;
    res = await getContext(url);
  }
  console.log(res.json());
};

export const scraper = async (task) => {
  const foo = await openai.files.create({
    file: await fetch(task.input),
    purpose: "fine-tune",
  });
  console.log(foo);
};
