import { openai } from "../helpers/openai.mjs";
import fs from "fs";

export const whisper = async () => {
  const file = await fs.createReadStream(
    "/Users/maciejstudniarz/Downloads/mateusz.mp3",
  );

  return openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    response_format: "text",
  });
};
