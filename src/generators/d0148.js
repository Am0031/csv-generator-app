
import { nowTimestampYYYYMMDDHHmmss } from "../utils/date";
import { nextFileId } from "../utils/random";
import { buildCsvText, buildPipeLine } from "../utils/fileprep";

export function generateD0148File({mpan, gspGroup, senderMpid, recipientMpid }) {
  const fileId = nextFileId();
  const nowTs = nowTimestampYYYYMMDDHHmmss();
  const flowWithVersion = `D0148001`;

  const header = buildPipeLine(["ZHV", fileId, flowWithVersion, "X", senderMpid, "M", recipientMpid, nowTs, "", "", "", "", "OPER"]);
  const footer = buildPipeLine(["ZPT", fileId, mpan, gspGroup, "0", "", "1", nowTs]);

  const lines = [header, footer];
  const csvText = buildCsvText(lines);

  const filename = `D0148-${nowTs}.csv`;
  return { filename, csvText };
}
