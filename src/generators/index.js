
import { generateD0155File } from "./d0155";
import { generateD0148File } from "./d0148";
import { downloadTextFile } from "../utils/fileprep";
import { isValidSenderMpid } from "../utils/validate";
import { generateMpan, gspFromMpan } from "../utils/industry";

export const FLOW_PLANS = {
  "D0155": ["D0155"],
  "D0155+D0148": ["D0155", "D0148"],
  "D0148": ["D0148"]
};

export const GENERATORS = {
  D0155: generateD0155File,
  D0148: generateD0148File,
}

  

export function handleGenerateFlow({ senderMpid, recipientMpid, contractRef, retrievalMethod, flowName }) {
  if (!isValidSenderMpid(senderMpid)) {
    return { error: "Sender MPID must be exactly 4 letters (A–Z)." };
  }

  const flowsToGenerate = FLOW_PLANS[flowName] || [];
  const mpan =  generateMpan();
  const gspGroup = gspFromMpan(mpan);
  console.log('flows to generate for mpan:',mpan, '-->', flowsToGenerate)
  flowsToGenerate.forEach(flow => {
    const generator = GENERATORS[flow];   
    if (!generator) return;
    const { filename, csvText } = generator({mpan, gspGroup, senderMpid, recipientMpid, contractRef, retrievalMethod });
    console.log('downloading ', filename)
    downloadTextFile(filename, csvText);
  });

  return { success: true };
}
