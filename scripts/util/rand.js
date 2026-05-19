// Random helpers + anti-repetition queue.
// We keep a memory of recently used "fingerprints" to avoid repeating the same
// exercise twice in a row, even across sessions (persisted in localStorage).

const KEY = 'gl.recent';
const MAX_RECENT = 80;

let recent = load();

function load() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); }
  catch { return new Set(); }
}
function save() {
  const arr = [...recent].slice(-MAX_RECENT);
  recent = new Set(arr);
  try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch {}
}

export function pickInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickN(arr, n) {
  const copy = arr.slice();
  const out = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick from `arr` avoiding values whose fingerprint is in recent.
// Falls back to any if all are recent.
export function pickFresh(arr, fingerprintFn) {
  const fresh = arr.filter(x => !recent.has(fingerprintFn(x)));
  return pick(fresh.length ? fresh : arr);
}

export function rememberFingerprint(fp) {
  if (!fp) return;
  recent.add(fp);
  if (recent.size > MAX_RECENT) {
    // remove oldest by reconstructing
    const arr = [...recent].slice(-MAX_RECENT);
    recent = new Set(arr);
  }
  save();
}

export function clearRecent() {
  recent = new Set();
  save();
}
