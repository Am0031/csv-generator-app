
import { generateD0155File } from "./d0155";
import { generateD0148File } from "./d0148";
import { downloadTextFile } from "../utils/fileprep";
import { isValidSenderMpid } from "../utils/validate";
import { generateMpan, gspFromMpan } from "../utils/industry";
import { generateD0149File } from "./d0149";
import { generateD0150File } from "./d0150";
import { generateD0268File } from "./d0268";
import { generateD0383File } from "./d0383";
import { generateD0384File } from "./d0384";
import { generateD0302File } from "./d0302";
import { FLOW_PLANS } from "../constants/constants";

// export const FLOW_PLANS = {
//   "D0155": {title: "D0155 only", files: ["D0155"]},
//   "D0148": {title: "D0148 only", files: ["D0148"]},
//   "ALL": {title: "All 8 files", files: ["D0155", "D0148", "D0150", "D0149", "D0268", "D0383", "D0384", "D0302"]},
//   "SC-1": {title: "Scenario 1 - NHH/AMR", files: ["D0155", "D0148", "D0150", "D0149", "D0302"]},
//   "SC-2": {title: "Scenario 2 - NHH/Traditional", files: ["D0155", "D0148", "D0150", "D0149", "D0302"]},
//   "SC-3": {title: "Scenario 3 - HH/HH", files: ["D0155", "D0268", "D0383", "D0384", "D0302"]},
//   "SC-4": {title: "Scenario 4 - NHH/Smart", files: ["D0155", "D0148", "D0150", "D0149", "D0302"]},
//   "SC-5": {title: "Scenario 5 - NHH/None", files: ["D0155", "D0148", "D0302"]},
//   "SC-6": {title: "Scenario 6 - HH/None", files: ["D0155", "D0148", "D0302"]},
//   "D0155+D0148": {title: "D0155+D0148 only", files: ["D0155", "D0148"]}
// };

export const GENERATORS = {
  D0155: generateD0155File,
  D0148: generateD0148File,
  D0149: generateD0149File,
  D0150: generateD0150File,
  D0268: generateD0268File,
  D0383: generateD0383File,
  D0384: generateD0384File,
  D0302: generateD0302File
}

  

export function handleGenerateFlow({ senderMpid, recipientMpid, contractRef, retrievalMethod, flowName }) {
  if (!isValidSenderMpid(senderMpid)) {
    return { error: "Sender MPID must be exactly 4 letters (A–Z)." };
  }

  const flowsToGenerate = FLOW_PLANS[flowName]?.files || [];
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
