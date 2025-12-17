
/* =========================
   Utility: Pipe-separated "CSV"
   We keep a trailing empty field to match examples (ending with |).
   ========================= */

export function sanitizePipe(val) {
  if (val === null || val === undefined) return "";
  // prevent accidental delimiter injection
  return String(val).replace(/\|/g, "-");
}

export function buildPipeLine(fields) {
  // Add an extra empty field to end lines with a trailing '|', matching examples
  const all = [...fields.map(sanitizePipe), ""];
  return all.join("|");
}

export function buildCsvText(lines) {
  const CRLF = "\r\n";
  const BOM = "\uFEFF"; // helps Excel detect UTF-8
  return BOM + lines.join(CRLF) + CRLF;
}

/* =========================
   Utility: Download
   ========================= */

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

