// Validation: 4 letters only (A–Z)
export function isValidSenderMpid(value) {
  return /^[A-Z]{4}$/.test(value);
}

// Normalize: force uppercase and strip non-letters
export function normalizeInput(raw) {
  return raw.toUpperCase().replace(/[^A-Z]/g, "");
}