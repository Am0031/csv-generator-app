
import { nowTimestampYYYYMMDDHHmmss } from "../utils/date";
import { nextFileId } from "../utils/random";
import { buildCsvText, buildPipeLine, downloadTextFile } from "../utils/fileprep";

export function generateD0148File({ senderMpid, recipientMpid }) {
  const fileId = nextFileId();
  const nowTs = nowTimestampYYYYMMDDHHmmss();
  const flowWithVersion = `D0148001`;

  const header = buildPipeLine(["ZHV", fileId, flowWithVersion, "X", senderMpid, "M", recipientMpid, nowTs, "", "", "", "", "OPER"]);
  const footer = buildPipeLine(["ZPT", fileId, "0", "", "1", nowTs]);

  const lines = [header, footer];
  const csvText = buildCsvText(lines);

  const filename = `D0148-${nowTs}.csv`;
  downloadTextFile(filename, csvText);
  return { filename, csvText };
}
