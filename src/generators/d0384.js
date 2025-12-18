
import { nowTimestampYYYYMMDDHHmmss } from "../utils/date";
import { nextFileId } from "../utils/random";
import { buildCsvText, buildPipeLine } from "../utils/fileprep";

export function generateD0384File({mpan, gspGroup, senderMpid, recipientMpid, versionNumber }) {
  const fileRef = 'D0384';
  const version = String(versionNumber).padStart(3, "0");
  //Dummy content - TODO: replace with actual logic
  const fileId = nextFileId();
  const nowTs = nowTimestampYYYYMMDDHHmmss();
  const flowWithVersion = `${fileRef}${version}`;
  const header = buildPipeLine(["ZHV", fileId, flowWithVersion, "X", senderMpid, "M", recipientMpid, nowTs, "", "", "", "", "OPER"]);
  const footer = buildPipeLine(["ZPT", fileId, mpan, gspGroup, "0", "", "1", nowTs]);

  const lines = [header, footer];
  const csvText = buildCsvText(lines);

  const filename = `${fileRef}-${nowTs}.csv`;
  return { filename, csvText };
}
