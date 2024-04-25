import dotenv from "dotenv";
dotenv.config();

export const getRefreshedToken = async (taskName) => {
  return fetch(`https://tasks.aidevs.pl/token/${taskName}`, {
    method: "POST",
    body: JSON.stringify({ apikey: process.env.API_KEY }),
  })
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      return response.token;
    });
};

export const getTask = (token) => {
  return fetch(`https://tasks.aidevs.pl/task/${token}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      return response;
    });
};

export const sendAnswer = (token, answer) => {
  return fetch(`https://tasks.aidevs.pl/answer/${token}`, {
    method: "POST",
    body: JSON.stringify({ answer: answer }),
  })
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      return response;
    });
};
