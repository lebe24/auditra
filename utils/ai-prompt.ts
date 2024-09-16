import OpenAI from "openai";
import { chatAudit } from "@/utils/openai"

const apiKey = process.env.NEXT_PUBLIC_API_KEY || "string"; 

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export const analyzeContract = async (
  contract: string,
  setResults: any,
  setLoading: any,
  auditSmartContract: any
) => {
  setLoading(true);
  const res :any = chatAudit(contract)
  const auditResults = JSON.parse(res.choices[0].message.content);
  setResults(auditResults);
  setLoading(false);
};

export const fixIssues = async (
  contract: string,
  suggestions: string,
  setContract: (contract: string) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);

  const response = (await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Here is the smart contract with the following issues: ${suggestions}. Please provide a fixed version of the contract:\n\n${contract}`,
      },
    ],
    model: "gpt-3.5-turbo",
  })) as any;

  const fixedContract = response.choices[0].message.content;
  setContract(fixedContract.trim());
  setLoading(false);
};
