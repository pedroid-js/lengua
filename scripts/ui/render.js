// Render exercise body/feedback into DOM elements.

import { TENSES, PERSON_LABEL, PERSON_PRONOUN } from '../engine/conjugator.js';

const CAT_LABEL = { verbs: 'Tiempos verbales', accents: 'Acentuación', mixed: 'Combate mixto' };
const KIND_LABEL = {
  fill: 'Rellenar', mcq: 'Opción múltiple', transform: 'Transformar',
  identify: 'Identificar', classify: 'Clasificar', tilde: 'Colocar tilde',
};
const LEVEL_LABEL = { 1: 'Aprendiz', 2: 'Pirata', 3: 'Yonkō' };

export function setBadges(ex, level, idx, total, refs) {
  refs.exCategory.textContent = CAT_LABEL[ex.category] || ex.category;
  refs.exLevel.textContent    = `Nivel · ${LEVEL_LABEL[level] || level}`;
  refs.exKind.textContent     = KIND_LABEL[ex.kind] || ex.kind;
  refs.exIndex.textContent    = idx + 1;
  refs.exTotal.textContent    = total;
  refs.progressBar.style.width = `${((idx) / total) * 100}%`;
}

export function renderExercise(ex, refs) {
  refs.exRubric.textContent = ex.rubric;
  const body = refs.exBody;
  body.innerHTML = '';
  refs.exHint.hidden = true;
  refs.exHint.textContent = '';

  switch (ex.kind) {
    case 'fill':       renderFill(ex, body); break;
    case 'transform':  renderTransform(ex, body); break;
    case 'mcq':        renderMcq(ex, body); break;
    case 'identify':   renderMcq(ex, body); break;
    case 'classify':   renderClassify(ex, body); break;
    case 'tilde':      renderTilde(ex, body); break;
    default: body.textContent = `(no renderer for ${ex.kind})`;
  }
}

function renderFill(ex, body) {
  const sentence = ex.payload.sentence || '___';
  const parts = sentence.split('___');
  const wrap = document.createElement('p');
  wrap.className = 'sentence';
  wrap.append(document.createTextNode(parts[0] || ''));
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'input--blank';
  input.autocomplete = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;
  input.size = Math.max(8, (ex.answer || '').length + 2);
  input.dataset.role = 'answer';
  input.setAttribute('aria-label', 'Tu respuesta');
  wrap.appendChild(input);
  wrap.append(document.createTextNode(parts[1] || ''));
  body.appendChild(wrap);
  queueMicrotask(() => input.focus());
}

function renderTransform(ex, body) {
  const p1 = document.createElement('p');
  p1.className = 'sentence';
  p1.innerHTML = `Original (${TENSES[ex.payload.from].name}): <em>${escape(ex.payload.source)}</em>`;
  body.appendChild(p1);

  const tplParts = (ex.payload.sentenceTpl || '').split('___');
  const wrap = document.createElement('p');
  wrap.className = 'sentence';
  wrap.append(document.createTextNode(`Reescribe en ${TENSES[ex.payload.to].name}: `));
  wrap.append(document.createTextNode(tplParts[0] || ''));
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'input--blank';
  input.autocomplete = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;
  input.size = Math.max(8, (ex.answer || '').length + 2);
  input.dataset.role = 'answer';
  wrap.appendChild(input);
  wrap.append(document.createTextNode(tplParts[1] || ''));
  body.appendChild(wrap);
  queueMicrotask(() => input.focus());
}

function renderMcq(ex, body) {
  if (ex.payload.sentence) {
    const p = document.createElement('p');
    p.className = 'sentence';
    p.innerHTML = `<em>${escape(ex.payload.sentence)}</em>`;
    body.appendChild(p);
  }
  const choices = document.createElement('div');
  choices.className = 'choices';
  for (const opt of ex.payload.options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.dataset.role = 'choice';
    btn.dataset.value = (typeof opt === 'string') ? opt : opt.id;
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = (typeof opt === 'string') ? opt : opt.label;
    btn.addEventListener('click', () => {
      const all = choices.querySelectorAll('[data-role="choice"]');
      all.forEach(c => c.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
    });
    choices.appendChild(btn);
  }
  body.appendChild(choices);
}

function renderClassify(ex, body) {
  const p = document.createElement('p');
  p.className = 'sentence';
  p.innerHTML = `Sílabas: <strong>${ex.payload.syllables.join(' · ')}</strong>`;
  body.appendChild(p);
  // reuse mcq layout
  renderMcq(ex, body);
}

function renderTilde(ex, body) {
  const wrap = document.createElement('div');
  wrap.className = 'tilde-word';
  const w = ex.payload.displayWord;
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    const span = document.createElement('button');
    span.type = 'button';
    span.className = 'tilde-letter';
    span.textContent = ch;
    span.dataset.index = i;
    span.dataset.role = 'tilde';
    span.dataset.vowel = /[aeiouáéíóú]/i.test(ch) ? 'true' : 'false';
    span.setAttribute('aria-pressed', 'false');
    if (!/[aeiouáéíóú]/i.test(ch)) span.disabled = true;
    span.addEventListener('click', () => {
      wrap.querySelectorAll('[data-role="tilde"]').forEach(s => s.setAttribute('aria-pressed', 'false'));
      span.setAttribute('aria-pressed', 'true');
    });
    wrap.appendChild(span);
  }
  body.appendChild(wrap);

  const p = document.createElement('p');
  p.className = 'sentence';
  p.innerHTML = `Sílabas: <strong>${ex.payload.syllables.join(' · ')}</strong>`;
  body.appendChild(p);
}

// ---------- harvest answer from body --------------------------------
export function harvestAnswer(ex, body) {
  switch (ex.kind) {
    case 'fill':
    case 'transform': {
      const inp = body.querySelector('input[data-role="answer"]');
      return inp ? inp.value.trim() : '';
    }
    case 'mcq':
    case 'identify':
    case 'classify': {
      const sel = body.querySelector('[data-role="choice"][aria-pressed="true"]');
      return sel ? sel.dataset.value : '';
    }
    case 'tilde': {
      const sel = body.querySelector('[data-role="tilde"][aria-pressed="true"]');
      return sel ? Number(sel.dataset.index) : -1;
    }
  }
  return '';
}

// ---------- feedback ------------------------------------------------
export function renderFeedback(verdict, refs) {
  refs.feedbackCard.hidden = false;
  refs.feedbackCard.classList.toggle('is-ok', verdict.ok);
  refs.feedbackCard.classList.toggle('is-wrong', !verdict.ok);
  refs.fbIcon.textContent = verdict.ok ? '✓' : '✗';
  refs.fbTitle.textContent = verdict.title;
  refs.fbDetail.innerHTML = verdict.detail || '';
  refs.fbRule.hidden = !verdict.rule;
  refs.fbRule.innerHTML = verdict.rule || '';
  refs.fbExample.hidden = !verdict.example;
  refs.fbExample.innerHTML = verdict.example || '';
}

export function clearFeedback(refs) {
  refs.feedbackCard.hidden = true;
  refs.feedbackCard.classList.remove('is-ok', 'is-wrong');
  refs.fbDetail.innerHTML = '';
  refs.fbRule.innerHTML = '';
  refs.fbExample.innerHTML = '';
}

// ---------- visual: lock choices after grading ----------------------
export function lockChoices(ex, body, verdict) {
  if (ex.kind !== 'mcq' && ex.kind !== 'identify' && ex.kind !== 'classify') return;
  const buttons = body.querySelectorAll('[data-role="choice"]');
  buttons.forEach(b => {
    b.disabled = true;
    if (b.dataset.value === ex.answer) b.classList.add('choice--correct');
    else if (b.getAttribute('aria-pressed') === 'true') b.classList.add('choice--wrong');
  });
}

function escape(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
