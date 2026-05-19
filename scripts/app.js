// Main entry. Wires UI events to state, generators and renderers.

import { TENSES } from './engine/conjugator.js';
import { generateExercise } from './generators/index.js';
import { check } from './engine/corrector.js';
import { loadSettings, saveSettings, resetSettings, loadStats, appendRun, resetStats, defaultTensesForLevel, DEFAULT_SETTINGS } from './state.js';
import { setBadges, renderExercise, harvestAnswer, renderFeedback, clearFeedback, lockChoices } from './ui/render.js';

// ---------- refs ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const refs = {
  exCategory: $('[data-bind="exCategory"]'),
  exLevel:    $('[data-bind="exLevel"]'),
  exKind:     $('[data-bind="exKind"]'),
  exIndex:    $('[data-bind="exIndex"]'),
  exTotal:    $('[data-bind="exTotal"]'),
  progressBar:$('[data-bind="progressBar"]'),
  exerciseCard: $('[data-bind="exerciseCard"]'),
  exRubric:   $('[data-bind="exRubric"]'),
  exBody:     $('[data-bind="exBody"]'),
  exHint:     $('[data-bind="exHint"]'),
  feedbackCard: $('[data-bind="feedbackCard"]'),
  fbIcon:  $('[data-bind="fbIcon"]'),
  fbTitle: $('[data-bind="fbTitle"]'),
  fbDetail:$('[data-bind="fbDetail"]'),
  fbRule:  $('[data-bind="fbRule"]'),
  fbExample:$('[data-bind="fbExample"]'),
  resScore: $('[data-bind="resScore"]'),
  resTotal: $('[data-bind="resTotal"]'),
  resMsg:   $('[data-bind="resMsg"]'),
  resList:  $('[data-bind="resList"]'),
  statsBlock: $('[data-bind="statsBlock"]'),
  settingsForm: $('[data-bind="settingsForm"]'),
  tensesGrid: $('[data-bind="tensesGrid"]'),
  toast: $('[data-bind="toast"]'),
};

// ---------- state ----------
let settings = loadSettings();
let session = null; // { category, level, size, items: [], index, answers, verdicts }
applyMotionPreference();

// ---------- views ----------
function show(view) {
  document.body.dataset.view = view;
  $$('.view').forEach(v => v.hidden = v.dataset.view !== view);
  $$('.navbtn').forEach(b => {
    b.removeAttribute('aria-current');
    if (b.dataset.nav === view) b.setAttribute('aria-current', 'true');
  });
  if (view === 'stats') renderStats();
  if (view === 'settings') hydrateSettingsForm();
}

// ---------- session ----------
function startSession(category, level, size) {
  settings = { ...settings, level };
  if (settings.tenses.size === 0) settings.tenses = defaultTensesForLevel(level);
  saveSettings(settings);
  size = size || settings.size || 10;
  session = {
    category,
    level,
    size,
    items: [],
    answers: [],
    verdicts: [],
    index: 0,
    startedAt: Date.now(),
  };
  // generate just-in-time per slide for variety
  nextExercise();
  show('exercise');
}

function nextExercise() {
  if (!session) return;
  clearFeedback(refs);
  refs.exerciseCard.hidden = false;
  if (session.index >= session.size) return finishSession();
  const ex = generateExercise(session.category, { ...settings, level: session.level });
  session.items.push(ex);
  setBadges(ex, session.level, session.index, session.size, refs);
  renderExercise(ex, refs);
}

function currentEx() { return session?.items[session.index]; }

function gradeCurrent() {
  const ex = currentEx();
  if (!ex) return;
  const raw = harvestAnswer(ex, refs.exBody);
  const verdict = check(ex, raw);
  session.answers.push(raw);
  session.verdicts.push(verdict);
  renderFeedback(verdict, refs);
  lockChoices(ex, refs.exBody, verdict);
  // disable inputs after grading
  refs.exBody.querySelectorAll('input').forEach(i => i.disabled = true);
}

function advance() {
  session.index++;
  nextExercise();
}

function finishSession() {
  // persist run
  const total = session.verdicts.length;
  const correct = session.verdicts.filter(v => v.ok).length;
  const run = {
    category: session.category,
    level: session.level,
    size: session.size,
    correct, total,
    finishedAt: Date.now(),
    items: session.items.map((ex, i) => ({
      kind: ex.kind,
      category: ex.category,
      verb: ex.payload?.verb,
      tense: ex.payload?.tense,
      rule: ex.payload?.rule,
      ok: !!session.verdicts[i]?.ok,
    })),
  };
  appendRun(run);
  renderResults(run);
  show('results');
}

function renderResults(run) {
  refs.resScore.textContent = run.correct;
  refs.resTotal.textContent = run.total;
  const pct = run.total ? Math.round((run.correct / run.total) * 100) : 0;
  refs.resMsg.textContent = msgForScore(pct);
  refs.resList.innerHTML = '';
  session.items.forEach((ex, i) => {
    const v = session.verdicts[i];
    const li = document.createElement('li');
    li.className = v.ok ? 'is-ok' : 'is-wrong';
    const mark = document.createElement('span');
    mark.className = 'reslist__mark';
    mark.textContent = v.ok ? '✓' : '✗';
    li.appendChild(mark);
    const q = document.createElement('div');
    q.className = 'reslist__q';
    q.innerHTML = `<strong>${escape(stripTags(ex.rubric))}</strong>`;
    if (v.detail) {
      const d = document.createElement('div');
      d.innerHTML = v.detail;
      d.style.opacity = '.9';
      d.style.fontSize = '.9em';
      d.style.marginTop = '.25rem';
      q.appendChild(d);
    }
    li.appendChild(q);
    const a = document.createElement('div');
    a.className = 'reslist__a';
    a.textContent = (typeof ex.answer === 'string') ? ex.answer : '';
    li.appendChild(a);
    refs.resList.appendChild(li);
  });
}

function msgForScore(p) {
  if (p === 100) return '¡Tripulación legendaria! Mereces ser Rey de los Piratas de la lengua.';
  if (p >= 85)   return '¡Excelente! El Grand Line está a tu alcance.';
  if (p >= 70)   return 'Buena travesía, capitán. Sigue afinando el rumbo.';
  if (p >= 50)   return 'Hay tesoro a la vista, pero falta navegar más.';
  return 'Las aguas están bravas. Repite la travesía y revisa la bitácora.';
}

// ---------- stats ----------
function renderStats() {
  const stats = loadStats();
  const block = refs.statsBlock;
  block.innerHTML = '';
  const totals = stats.totals;
  if (!totals || !totals.played) {
    block.innerHTML = '<p class="muted">Aún no has zarpado. Empieza una travesía para registrar tu progreso.</p>';
    return;
  }
  block.appendChild(stat('Ejercicios totales', totals.played));
  block.appendChild(stat('Aciertos', totals.correct, `${pct(totals.correct, totals.played)}%`));
  if (totals.byCategory.verbs) block.appendChild(stat('Verbos', `${totals.byCategory.verbs.correct}/${totals.byCategory.verbs.played}`, `${pct(totals.byCategory.verbs.correct, totals.byCategory.verbs.played)}%`));
  if (totals.byCategory.accents) block.appendChild(stat('Acentos', `${totals.byCategory.accents.correct}/${totals.byCategory.accents.played}`, `${pct(totals.byCategory.accents.correct, totals.byCategory.accents.played)}%`));
  // Punto débil: tiempo verbal o regla con peor ratio (>=3 intentos)
  let weakest = null;
  for (const [k, v] of Object.entries(totals.byTense || {})) {
    if (v.played < 3) continue;
    const ratio = v.correct / v.played;
    if (!weakest || ratio < weakest.ratio) weakest = { key: k, ratio, ...v };
  }
  if (weakest) {
    const label = TENSES[weakest.key]?.name || weakest.key;
    block.appendChild(stat('Punto flaco', label, `${weakest.correct}/${weakest.played}`));
  }
}
function stat(label, val, sub) {
  const d = document.createElement('div');
  d.className = 'stat';
  d.innerHTML = `<div class="stat__label">${label}</div><div class="stat__val">${val}</div>${sub ? `<div class="stat__sub">${sub}</div>` : ''}`;
  return d;
}
function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

// ---------- settings ----------
function hydrateSettingsForm() {
  const f = refs.settingsForm;
  f.querySelectorAll('input[name="level"]').forEach(r => r.checked = (Number(r.value) === settings.level));
  f.querySelector('input[name="size"]').value = settings.size;
  for (const k of ['vRegular','vStem','vIrregular','vSpelling','aClassify','aTilde','aHiatus','aDiacritic','aInterro','reduceMotion']) {
    const el = f.querySelector(`input[name="${k}"]`);
    if (el) el.checked = !!settings[k];
  }
  // tenses grid
  refs.tensesGrid.innerHTML = '';
  for (const [key, info] of Object.entries(TENSES)) {
    const id = `t-${key}`;
    const wrap = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.name = 't';
    cb.value = key;
    cb.id = id;
    cb.checked = settings.tenses.has(key);
    wrap.appendChild(cb);
    wrap.append(' ' + info.name);
    refs.tensesGrid.appendChild(wrap);
  }
}
function collectSettings() {
  const f = refs.settingsForm;
  const level = Number(f.querySelector('input[name="level"]:checked')?.value || 2);
  const size = Math.max(5, Math.min(40, Number(f.querySelector('input[name="size"]').value) || 10));
  const flags = ['vRegular','vStem','vIrregular','vSpelling','aClassify','aTilde','aHiatus','aDiacritic','aInterro','reduceMotion'];
  const out = { level, size, tenses: new Set() };
  for (const k of flags) out[k] = !!f.querySelector(`input[name="${k}"]`).checked;
  f.querySelectorAll('input[name="t"]:checked').forEach(cb => out.tenses.add(cb.value));
  if (out.tenses.size === 0) out.tenses = defaultTensesForLevel(level);
  return out;
}
function applyMotionPreference() {
  document.body.classList.toggle('reduce-motion', !!settings.reduceMotion);
}

// ---------- toast ----------
let toastT = null;
function toast(msg, ms = 1800) {
  refs.toast.textContent = msg;
  refs.toast.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => { refs.toast.hidden = true; }, ms);
}

// ---------- event wiring ----------
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-nav]');
  if (t) { show(t.dataset.nav); return; }
  const a = e.target.closest('[data-action]');
  if (a) {
    const act = a.dataset.action;
    if (act === 'start-quick') return startSession('mixed', settings.level || 2, settings.size);
    if (act === 'check') return onCheck();
    if (act === 'next') return advance();
    if (act === 'skip') {
      // Insert a wrong "skip" verdict so it counts
      const ex = currentEx();
      const verdict = check(ex, '');
      session.answers.push('');
      session.verdicts.push(verdict);
      renderFeedback(verdict, refs);
      lockChoices(ex, refs.exBody, verdict);
      refs.exBody.querySelectorAll('input').forEach(i => i.disabled = true);
      return;
    }
    if (act === 'hint') {
      const ex = currentEx();
      const hint = ex?.payload?.hint || ex?.explain?.example || 'Sin pista para este ejercicio.';
      refs.exHint.hidden = false;
      refs.exHint.textContent = hint;
      return;
    }
    if (act === 'abandon') {
      if (confirm('¿Abandonar la travesía? Se perderá el progreso de esta ronda.')) {
        session = null;
        show('home');
      }
      return;
    }
    if (act === 'retry') {
      if (!session) return show('home');
      startSession(session.category, session.level, session.size);
      return;
    }
    if (act === 'save-settings') {
      settings = collectSettings();
      saveSettings(settings);
      applyMotionPreference();
      toast('Ajustes guardados');
      return;
    }
    if (act === 'reset-settings') {
      settings = resetSettings();
      hydrateSettingsForm();
      applyMotionPreference();
      toast('Ajustes por defecto restaurados');
      return;
    }
    if (act === 'reset-stats') {
      if (confirm('¿Borrar toda la bitácora?')) { resetStats(); renderStats(); toast('Bitácora borrada'); }
      return;
    }
  }
  const s = e.target.closest('[data-start]');
  if (s) {
    const cat = s.dataset.start;
    const lvl = Number(s.dataset.level) || settings.level || 2;
    return startSession(cat, lvl, settings.size);
  }
});

document.addEventListener('keydown', (e) => {
  if (document.body.dataset.view !== 'exercise') return;
  if (e.key === 'Enter') {
    const fbVisible = !refs.feedbackCard.hidden;
    if (fbVisible) advance();
    else onCheck();
  }
});

// Update level radio side-effect: change available tenses default
document.addEventListener('change', (e) => {
  const r = e.target.closest('input[name="level"]');
  if (!r) return;
  const level = Number(r.value);
  // Re-tick tenses available at this level if user hasn't touched them yet.
  const cbs = refs.tensesGrid.querySelectorAll('input[name="t"]');
  cbs.forEach(cb => {
    const lvl = TENSES[cb.value]?.level || 3;
    cb.checked = lvl <= level;
  });
});

function onCheck() {
  if (!session) return;
  const fbVisible = !refs.feedbackCard.hidden;
  if (fbVisible) return advance();
  gradeCurrent();
}

// utils
function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ''); }
function escape(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// init
show('home');
