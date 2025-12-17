import { dateYYYYMMDD, pad } from "./date";

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random date in the past (between minDays and maxDays ago)
export function randomPastDateYYYYMMDD(minDaysAgo = 90, maxDaysAgo = 900) {
  const daysAgo = randomInt(minDaysAgo, maxDaysAgo);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return dateYYYYMMDD(d);
}

// Simple random uppercase ref string
export function randomRef(len = 4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}



export function nextFileId(counterKey) {
  let n = Number(localStorage.getItem(counterKey)) || 1;
  localStorage.setItem(counterKey, String(n + 1));
  // Example scheme: "F" + 9-digit counter = 10 chars total
  return "F" + pad(n, 9);
}

//Dummy data options

//Dummy address
export const address = [
      "Line 1 Sample",
      "Line 2 Sample",
      "Line 3 Sample",
      "BUXTON", // line 4
      "", // line 5
      "", // line 6
      "", // line 7
      "", // line 8
      "", // line 9
    ]

// Example postcode (Nottingham format)
export const postcode = "NG1 6FX";