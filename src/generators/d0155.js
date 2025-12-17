
import { nowTimestampYYYYMMDDHHmmss, pad } from "../utils/date";
import { generateMpan, gspFromMpan } from "../utils/industry";
import { nextFileId, randomInt, randomPastDateYYYYMMDD, randomRef, address, postcode } from "../utils/random";
import { buildCsvText, buildPipeLine, downloadTextFile } from "../utils/fileprep";

export function generateD0155File({ senderMpid, recipientMpid, contractRef, retrievalMethod }) {
  const mpan = generateMpan();
  const regEffective = randomPastDateYYYYMMDD(180, 1500);
  const mopStart = randomPastDateYYYYMMDD(60, 900);
  const serviceRef = randomRef(4);
  const serviceLevelRef = pad(randomInt(1, 9999), 4);
  const gspGroup = gspFromMpan(mpan);

  const fileId = nextFileId();
  const nowTs = nowTimestampYYYYMMDDHHmmss();
  const flowWithVersion = `D0155001`;

  const header = buildPipeLine([
    "ZHV", fileId, flowWithVersion, "X", senderMpid, "M", recipientMpid, nowTs, "", "", "", "", "OPER"
  ]);

  const row315 = buildPipeLine([
    "315", mpan, regEffective, ...address, postcode, contractRef, retrievalMethod, gspGroup
  ]);

  const row317 = buildPipeLine(["317", mopStart]);
  const row318 = buildPipeLine(["318", serviceRef, serviceLevelRef]);

  const linesBetween = [row315, row317, row318];
  const lineCount = linesBetween.length; // not including header and footer
  const footer = buildPipeLine(["ZPT", fileId, String(lineCount), "", "1", nowTs]);

  const lines = [header, ...linesBetween, footer];
  const csvText = buildCsvText(lines);

  const filename = `D0155-${mpan}-${nowTs}.csv`;
  downloadTextFile(filename, csvText);
  return { filename, csvText };
}
