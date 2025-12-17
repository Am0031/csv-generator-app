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


/**
 * Compute MPAN check digit using modulus-11 per the algorithm you shared:
 * weights = [3,5,7,13,17,19,23,29,31,37,41,43]
 * check = (sum % 11) % 10
 * @param {string} core12 - the first 12 digits (no check digit)
 * @returns {number} check digit (0-9)
 */
export function computeMpanCheckDigit(core12) {
  const s = String(core12);
  if (!/^\d{12}$/.test(s)) {
    throw new Error("MPAN core must be exactly 12 digits before the check digit.");
  }
  const weights = [3, 5, 7, 13, 17, 19, 23, 29, 31, 37, 41, 43];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(s[i]) * weights[i];
  }
  return (sum % 11) % 10;
}


/**
 * Generate a valid 13-digit MPAN core:
 * - First 2 digits: distributor (picked from GSP_MAP keys)
 * - Next 10 digits: random
 * - Final digit: check digit via modulus-11 rule above
 * @param {string} [forcedDistributor2] optional "10","11",... to force distributor
 * @returns {string} 13-digit MPAN core
 */
export function generateMpan(forcedDistributor2) {
  // Choose a valid distributor id (2-digit string)
  const distIds = Object.keys(GSP_MAP); // e.g., ["10","11",...]
  const dist = forcedDistributor2 && /^\d{2}$/.test(forcedDistributor2)
    ? forcedDistributor2
    : distIds[randomInt(0, distIds.length - 1)];

  // Generate 10 random digits to make 12-digit core before check
  const body10 = Array.from({ length: 10 }, () => randomInt(0, 9)).join("");

  const core12 = dist + body10;
  const check = computeMpanCheckDigit(core12);

  return core12 + String(check); // 13-digit MPAN core
}

/**
 * Validate a 13-digit MPAN core.
 * @param {string} mpan13
 * @returns {boolean}
 */
export function isValidMpan(mpan13) {
  if (!/^\d{13}$/.test(mpan13)) return false;
  const core12 = mpan13.slice(0, 12);
  const expected = computeMpanCheckDigit(core12);
  return expected === Number(mpan13[12]);
}



// Generate a plausible 13-digit MPAN core starting with a valid distributor ID.
// For production, replace with your industry-validated algorithm (e.g., checksum).
// export function generateMpan() {
//   const distIds = Object.keys(GSP_MAP);
//   const dist = distIds[randomInt(0, distIds.length - 1)];
//   const body = Array.from({ length: 11 }, () => randomInt(0, 9)).join("");
//   // naive checksum: Luhn-like mod 10 (placeholder)
//   const digits = (dist + body).split("").map(Number);
//   const sum = digits
//     .reverse()
//     .map((d, i) => {
//       const v = i % 2 === 0 ? d * 2 : d;
//       return v > 9 ? v - 9 : v;
//     })
//     .reduce((a, b) => a + b, 0);
//   const check = (10 - (sum % 10)) % 10;
//   return dist + body + String(check);
// }

export function gspFromMpan(mpan) {
  const key = mpan.slice(0, 2);
  return GSP_MAP[key] || "_A";
}