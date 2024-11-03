import OpenAI from "openai";
import { geminiAuditContract, geminiFixIssue  } from "./gemini";


export const analyzeContract = async (
  contract: string,
  setResults: any,
  setLoading: any,
  auditSmartContract: any
) => {
  setLoading(true);
  const res :any = await geminiAuditContract(contract)
  const auditResults = JSON.parse(res);
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

  const response =  await geminiFixIssue(contract,suggestions) as any;

  const fixedContract = JSON.parse(response);
  setContract(fixedContract.trim());
  setLoading(false);
};
