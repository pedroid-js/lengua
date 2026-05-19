// Text helpers: normalization, accent stripping, case folding.

export function strip(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Trim, lowercase, normalize unicode for comparison (but keep tildes).
export function norm(str) {
  return String(str || '').trim().toLowerCase().normalize('NFC');
}

// Compare ignoring case & whitespace but RESPECTING accents.
export function equalsStrict(a, b) {
  return norm(a) === norm(b);
}

// Compare ignoring case, whitespace AND accents (loose).
export function equalsLoose(a, b) {
  return strip(norm(a)) === strip(norm(b));
}

// Capitalize first letter.
export function cap(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const VOWELS = new Set(['a','e','i','o','u','á','é','í','ó','ú','ü']);
export const STRONG = new Set(['a','e','o','á','é','ó']);
export const WEAK   = new Set(['i','u','ü']);
export const WEAK_NOACC = new Set(['i','u']);

export function isVowel(ch)  { return ch && VOWELS.has(ch.toLowerCase()); }
export function isStrong(ch) { return ch && STRONG.has(ch.toLowerCase()); }
export function isWeak(ch)   { return ch && WEAK.has(ch.toLowerCase()); }
export function hasTilde(ch) {
  if (!ch) return false;
  const dec = ch.normalize('NFD');
  return dec.length > 1 && /[́]/.test(dec);
}
