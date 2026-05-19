// Global app state, settings, run history. Persisted in localStorage.

import { TENSES } from './engine/conjugator.js';

const KEY_SET = 'gl.settings.v1';
const KEY_STATS = 'gl.stats.v1';

export const DEFAULT_SETTINGS = {
  level: 2,
  size: 10,
  vRegular: true, vStem: true, vIrregular: true, vSpelling: true,
  aClassify: true, aTilde: true, aHiatus: true, aDiacritic: true, aInterro: true,
  reduceMotion: false,
  tenses: defaultTensesForLevel(2),
};

export function defaultTensesForLevel(level) {
  const set = new Set();
  for (const [t, info] of Object.entries(TENSES)) {
    if (info.level <= level) set.add(t);
  }
  return set;
}

export function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY_SET) || 'null');
    if (!raw) return clone(DEFAULT_SETTINGS);
    raw.tenses = new Set(Array.isArray(raw.tenses) ? raw.tenses : Object.keys(TENSES).filter(t => TENSES[t].level <= (raw.level || 2)));
    return { ...clone(DEFAULT_SETTINGS), ...raw };
  } catch { return clone(DEFAULT_SETTINGS); }
}

export function saveSettings(s) {
  const flat = { ...s, tenses: [...s.tenses] };
  try { localStorage.setItem(KEY_SET, JSON.stringify(flat)); } catch {}
}

export function resetSettings() {
  try { localStorage.removeItem(KEY_SET); } catch {}
  return clone(DEFAULT_SETTINGS);
}

function clone(s) {
  return { ...s, tenses: new Set(s.tenses) };
}

// ---------- stats ----------
export function loadStats() {
  try { return JSON.parse(localStorage.getItem(KEY_STATS) || '{}'); }
  catch { return {}; }
}
export function saveStats(s) {
  try { localStorage.setItem(KEY_STATS, JSON.stringify(s)); } catch {}
}
export function resetStats() {
  try { localStorage.removeItem(KEY_STATS); } catch {}
}
export function appendRun(run) {
  const s = loadStats();
  s.runs = s.runs || [];
  s.runs.push(run);
  if (s.runs.length > 50) s.runs.splice(0, s.runs.length - 50);
  s.totals = aggregate(s.runs);
  saveStats(s);
  return s;
}
function aggregate(runs) {
  const t = { played: 0, correct: 0, byCategory: {}, byTense: {}, byRule: {} };
  for (const r of runs) {
    for (const it of r.items || []) {
      t.played++;
      if (it.ok) t.correct++;
      t.byCategory[r.category] = t.byCategory[r.category] || { played: 0, correct: 0 };
      t.byCategory[r.category].played++;
      if (it.ok) t.byCategory[r.category].correct++;
      const key = it.tense || it.rule || it.kind;
      if (key) {
        t.byTense[key] = t.byTense[key] || { played: 0, correct: 0 };
        t.byTense[key].played++;
        if (it.ok) t.byTense[key].correct++;
      }
    }
  }
  return t;
}
