// Example distributor codes -> GSP group mapping (placeholder).

import { randomInt } from "./random";

// See this info: https://en.wikipedia.org/wiki/Meter_Point_Administration_Number#Distributor_ID
const GSP_MAP = {
  "10": "_A",
  "11": "_B",
  "12": "_C",
  "13": "_D",
  "14": "_E",
  "15": "_F",
  "16": "_G",
  "17": "_P",
  "18": "_N",
  "19": "_J",
  "20": "_H",
  "21": "_K",
  "22": "_L",
  "23": "_M",
};

// Generate a plausible 13-digit MPAN core starting with a valid distributor ID.
// For production, replace with your industry-validated algorithm (e.g., checksum).
export function generateMpan() {
  const distIds = Object.keys(GSP_MAP);
  const dist = distIds[randomInt(0, distIds.length - 1)];
  const body = Array.from({ length: 11 }, () => randomInt(0, 9)).join("");
  // naive checksum: Luhn-like mod 10 (placeholder)
  const digits = (dist + body).split("").map(Number);
  const sum = digits
    .reverse()
    .map((d, i) => {
      const v = i % 2 === 0 ? d * 2 : d;
      return v > 9 ? v - 9 : v;
    })
    .reduce((a, b) => a + b, 0);
  const check = (10 - (sum % 10)) % 10;
  return dist + body + String(check);
}

export function gspFromMpan(mpan) {
  const key = mpan.slice(0, 2);
  return GSP_MAP[key] || "_A";
}