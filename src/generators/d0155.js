
import { nowTimestampYYYYMMDDHHmmss, pad } from "../utils/date";
import { nextFileId, randomInt, randomPastDateYYYYMMDD, randomRef, address, postcode } from "../utils/random";
import { buildCsvText, buildPipeLine } from "../utils/fileprep";

export function generateD0155File({mpan, gspGroup, senderMpid, recipientMpid, contractRef, retrievalMethod, versionNumber }) {
  const fileRef = 'D0155';
  const version = String(versionNumber).padStart(3, "0");
  const regEffective = randomPastDateYYYYMMDD(180, 1500);
  const mopStart = randomPastDateYYYYMMDD(60, 900);
  const serviceRef = randomRef(4);
  const serviceLevelRef = pad(randomInt(1, 9999), 4);

  const fileId = nextFileId();
  const nowTs = nowTimestampYYYYMMDDHHmmss();
  const flowWithVersion = `${fileRef}${version}`;

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

  const filename = `${fileRef}-${mpan}-${nowTs}.csv`;
  return { filename, csvText };
}
