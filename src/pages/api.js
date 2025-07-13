import axios from "axios";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",  // You can specify the desired version here
  javascript: "18.15.0",
};


export const executeCode = async (language, sourceCode, input) => {
  
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
    // Include the input here
    stdin: input,  // This is where we add the user input to the request payload
  });
  // console.log( typeof(response.data.run.output) );
  console.log( response.data );
  return response.data;
};

