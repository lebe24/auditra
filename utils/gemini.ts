import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBnPaVUw2dzpfMgxRyJbX5hDS7fs1aOEpc";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const geminiAuditContract = async (
    contract : string
) => {
  try {
    const response = await model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts : [ { text: `Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract: ${contract}.
      
          Please provide the results in the following array format for easy front-end display:
  
          [
            {
              "section": "Audit Report",
              "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
            },
            {
              "section": "Metric Scores",
              "details": [
                {
                  "metric": "Security",
                  "score": 0-10
                },
                {
                  "metric": "Performance",
                  "score": 0-10
                },
                {
                  "metric": "Other Key Areas",
                  "score": 0-10
                },
                {
                  "metric": "Gas Efficiency",
                  "score": 0-10
                },
                {
                  "metric": "Code Quality",
                  "score": 0-10
                },
                {
                  "metric": "Documentation",
                  "score": 0-10
                }
              ]
            },
            {
              "section": "Suggestions for Improvement",
              "details": "Suggestions for improving the smart contract in terms of security, performance, and any other identified weaknesses."
            }
          ]
          
          P.S : Remove the code block markers  around the result.
          Thank you.`,
        },]}
      ],
    });

    const result = await response.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text())
    return result.response.text(); // Return the AI's response for further processing

  } catch (error) {
    console.error("Error generating audit:", error);
    throw new Error("Audit generation failed.");
  }
};


export const geminiFixIssue = async (
  contract: string,
  suggestions: string,
) =>{
  try{
    const response = (await model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{text:`Here is the smart contract with the following issues: ${suggestions}. Please provide a fixed version of the contract:\n\n${contract}`}],
        },
      ]
    }))

    const result = await response.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text())
    return result.response.text();

  }catch(error){
    console.error("Error generating audit:", error);
    throw new Error("Audit generation failed.");
  }
}
