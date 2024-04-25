import * as Tasks from "./tasks/index.mjs";
import { getRefreshedToken, getTask, sendAnswer } from "./helpers/api.mjs";

const completeTask = async (taskName, performTask) => {
  getRefreshedToken(taskName).then((token) => {
    getTask(token).then(async (task) => {
      console.log(task);
      const answer = await performTask(task, token);
      sendAnswer(token, answer).then((res) => {
        console.log(res);
      });
    });
  });
};

const TASK_NAME = process.argv[2];
completeTask(TASK_NAME, Tasks[TASK_NAME]);
