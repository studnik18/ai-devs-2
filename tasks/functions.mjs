const description = {
  name: "addUser",
  type: "object",
  description: "Adds user with basic info",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "First name",
      },
      surname: {
        type: "string",
        description: "Last name",
      },
      year: {
        type: "integer",
        description: "Year when user was born",
      },
    },
  },
};

export const functions = () => description;
