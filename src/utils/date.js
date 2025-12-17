const pad2 = (n) => String(n).padStart(2, "0");
export const pad = (n, len) => String(n).padStart(len, "0");

export function nowTimestampYYYYMMDDHHmmss(d = new Date()) {
  const YYYY = d.getFullYear();
  const MM = pad2(d.getMonth() + 1);
  const DD = pad2(d.getDate());
  const HH = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  const ss = pad2(d.getSeconds());
  return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
}

export function dateYYYYMMDD(d) {
  const YYYY = d.getFullYear();
  const MM = pad2(d.getMonth() + 1);
  const DD = pad2(d.getDate());
  return `${YYYY}${MM}${DD}`;
}