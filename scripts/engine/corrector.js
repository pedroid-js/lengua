// Validates a user answer for an exercise and returns a verdict with a
// detailed, actionable explanation.
//
// Verdict shape:
//  {
//    ok: boolean,
//    yourAnswer: string | string[] | null,
//    correct: string | string[] | null,
//    title: 'Correcto' | 'Casi' | 'Incorrecto',
//    detail: 'html string',
//    rule: 'html string',
//    example: 'html string',
//    diff: { yours: [chars], correct: [chars] } | null   // char-by-char marks
//  }

import { equalsStrict, equalsLoose, strip, norm } from '../util/text.js';
import { conjugate, TENSES, PERSON_LABEL } from './conjugator.js';
import { getVerb } from '../data/verbs.js';

export function check(exercise, raw) {
  const yours = (raw == null) ? '' : (typeof raw === 'string' ? raw.trim() : raw);
  if (exercise.kind === 'fill' || exercise.kind === 'transform') return checkFreeText(exercise, yours);
  if (exercise.kind === 'mcq' || exercise.kind === 'identify' || exercise.kind === 'classify') return checkChoice(exercise, yours);
  if (exercise.kind === 'tilde') return checkTilde(exercise, yours);
  return notImplemented(exercise);
}

function checkFreeText(ex, yours) {
  const correct = ex.answer;
  if (equalsStrict(yours, correct)) {
    return verdict({
      ok: true, yours, correct,
      title: '¡Correcto!',
      detail: '',
      rule: ex.explain?.rule || '',
      example: ex.explain?.example || '',
    });
  }
  // Distinguish "missing or wrong tilde" from a different word.
  const yoursStripped = strip(norm(yours));
  const correctStripped = strip(norm(correct));
  if (yoursStripped === correctStripped && yours !== '') {
    // Same letters, tilde issue.
    return verdict({
      ok: false, yours, correct,
      title: 'Casi…',
      detail: `Has escrito <span class="tag-yours">${escape(yours)}</span> pero lo correcto es <span class="tag-correct">${escape(correct)}</span>. Atención a la tilde.`,
      rule: ex.explain?.rule || '',
      example: ex.explain?.example || '',
      diff: diffChars(yours, correct),
    });
  }
  // Otherwise, try to figure out a contextual hint for verbs.
  let detail = `Has escrito <span class="tag-wrong">${escape(yours || '∅')}</span> pero lo correcto es <span class="tag-correct">${escape(correct)}</span>.`;
  if (ex.category === 'verbs') detail += verbDiagnosis(ex, yours, correct);
  return verdict({
    ok: false, yours, correct,
    title: 'Incorrecto',
    detail,
    rule: ex.explain?.rule || '',
    example: ex.explain?.example || '',
    diff: diffChars(yours, correct),
  });
}

function checkChoice(ex, yours) {
  const ok = equalsStrict(yours, ex.answer);
  return verdict({
    ok,
    yours, correct: ex.answer,
    title: ok ? '¡Correcto!' : 'Incorrecto',
    detail: ok
      ? ''
      : `Tu elección fue <span class="tag-wrong">${escape(yours || '∅')}</span>; la correcta es <span class="tag-correct">${escape(ex.answer)}</span>.`,
    rule: ex.explain?.rule || '',
    example: ex.explain?.example || '',
  });
}

function checkTilde(ex, yoursIdx) {
  const ok = Number(yoursIdx) === Number(ex.answer);
  const original = ex.payload.originalWord;
  const display = ex.payload.displayWord;
  let detail;
  if (ok) {
    detail = `Has colocado la tilde correctamente.`;
  } else if (yoursIdx == null || yoursIdx === -1) {
    detail = `No has marcado la vocal. La correcta es la que aparece tildada en <span class="tag-correct">${escape(original)}</span>.`;
  } else {
    const yoursLetter = display[yoursIdx];
    detail = `Marcaste la <em>${yoursLetter || '?'}</em>. La correcta es la vocal de <span class="tag-correct">${escape(original)}</span>.`;
  }
  return verdict({
    ok,
    yours: yoursIdx,
    correct: ex.answer,
    title: ok ? '¡Correcto!' : 'Incorrecto',
    detail,
    rule: ex.explain?.rule || '',
    example: ex.explain?.example || '',
  });
}

function verbDiagnosis(ex, yours, correct) {
  if (!yours) return '';
  const verb = getVerb(ex.payload.verb);
  if (!verb) return '';
  // `fill`/`mcq` use `payload.tense`; `transform` uses `payload.to` for the target tense.
  const tense = ex.payload.tense ?? ex.payload.to;
  const person = ex.payload.person;
  if (!tense || !TENSES[tense]) return '';
  const table = conjugate(verb);
  // Did the user conjugate in another person of the same tense?
  for (const [p, form] of Object.entries(table[tense] || {})) {
    if (form === yours && p !== person) {
      return ` Esa forma corresponde a <strong>${PERSON_LABEL[p]}</strong>. Aquí necesitamos <strong>${PERSON_LABEL[person]}</strong>.`;
    }
  }
  // Did the user use the right person but a different tense?
  for (const tKey of Object.keys(TENSES)) {
    if (tKey === tense || TENSES[tKey].composite) continue;
    const form = table[tKey]?.[person];
    if (form === yours) {
      return ` Esa forma es de <strong>${TENSES[tKey].name}</strong>. Aquí necesitamos <strong>${TENSES[tense].name}</strong>.`;
    }
  }
  return '';
}

function diffChars(a, b) {
  const A = (a || '').split('');
  const B = (b || '').split('');
  const max = Math.max(A.length, B.length);
  const yours = [], correct = [];
  for (let i = 0; i < max; i++) {
    yours.push({ ch: A[i] || '', ok: A[i] === B[i] });
    correct.push({ ch: B[i] || '', ok: A[i] === B[i] });
  }
  return { yours, correct };
}

function verdict(v) {
  return {
    ok: !!v.ok,
    yours: v.yours == null ? null : v.yours,
    correct: v.correct == null ? null : v.correct,
    title: v.title,
    detail: v.detail || '',
    rule: v.rule || '',
    example: v.example || '',
    diff: v.diff || null,
  };
}

function notImplemented(ex) {
  return verdict({
    ok: false, title: 'Sin corrector', detail: `No hay corrector para «${ex.kind}»`, yours: null, correct: null,
  });
}

function escape(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
