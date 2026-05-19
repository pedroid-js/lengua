// Top-level exercise generator. Picks an exercise type compatible with the
// chosen category, level, and user settings, then delegates to the actual
// generator. Honors the anti-repetition queue.

import { VERB_GENERATORS } from './verbs.js';
import { ACCENT_GENERATORS } from './accents.js';
import { pick, pickFresh, rememberFingerprint } from '../util/rand.js';

const VERB_KINDS_BY_LEVEL = {
  1: ['fill', 'mcq', 'identify'],
  2: ['fill', 'mcq', 'identify', 'transform'],
  3: ['fill', 'mcq', 'identify', 'transform'],
};
const ACCENT_KINDS_BY_LEVEL = {
  1: ['classify', 'needsTilde'],
  2: ['classify', 'needsTilde', 'tilde', 'diacritic', 'interro'],
  3: ['classify', 'needsTilde', 'tilde', 'diacritic', 'interro'],
};

function filterAccentKinds(kinds, settings) {
  return kinds.filter(k => {
    if (k === 'classify' && !settings.aClassify) return false;
    if (k === 'tilde' && !settings.aTilde) return false;
    if (k === 'needsTilde' && !settings.aTilde) return false;
    if (k === 'diacritic' && !settings.aDiacritic) return false;
    if (k === 'interro' && !settings.aInterro) return false;
    return true;
  });
}

export function generateExercise(category, settings) {
  let cat = category;
  if (cat === 'mixed') cat = Math.random() < 0.5 ? 'verbs' : 'accents';

  // Try a few times to find a fresh exercise.
  let last = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const ex = buildOne(cat, settings);
    last = ex;
    // pickFresh-style: if the fingerprint is already in recent we try again
    if (!isRecent(ex.fingerprint)) break;
  }
  rememberFingerprint(last.fingerprint);
  return last;
}

function buildOne(category, settings) {
  if (category === 'verbs') {
    const kinds = VERB_KINDS_BY_LEVEL[settings.level] || VERB_KINDS_BY_LEVEL[3];
    const k = pick(kinds);
    return VERB_GENERATORS[k](settings);
  }
  if (category === 'accents') {
    let kinds = ACCENT_KINDS_BY_LEVEL[settings.level] || ACCENT_KINDS_BY_LEVEL[3];
    kinds = filterAccentKinds(kinds, settings);
    if (!kinds.length) kinds = ['classify'];
    const k = pick(kinds);
    return ACCENT_GENERATORS[k](settings);
  }
  // fallback
  return VERB_GENERATORS.fill(settings);
}

// Tiny check against localStorage recent set without exposing rand internals.
function isRecent(fp) {
  try {
    const arr = JSON.parse(localStorage.getItem('gl.recent') || '[]');
    return arr.includes(fp);
  } catch { return false; }
}
