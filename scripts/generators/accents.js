// Accent exercise generators.
import { WORDS, DIACRITIC, INTERRO } from '../data/accent-words.js';
import { syllabify, stripTilde, placeTildeOn, classify } from '../engine/accent.js';
import { pick, pickN, shuffle } from '../util/rand.js';
import { isVowel, VOWELS } from '../util/text.js';

const CLASS_LABEL = {
  aguda: 'Aguda',
  llana: 'Llana (grave)',
  esdrujula: 'Esdrújula',
  sobreesdrujula: 'Sobreesdrújula',
};

function poolFor(level) {
  return WORDS.filter(w => w.level <= level);
}

// ---------- CLASSIFY ----------
export function buildClassifyExercise(settings) {
  const pool = poolFor(settings.level);
  const target = pick(pool);
  // Classify pre-tilde-stripping for visibility consistency: we show the
  // correctly accented word but ask for its class.
  const opts = ['aguda','llana','esdrujula'];
  if (settings.level >= 3) opts.push('sobreesdrujula');
  return {
    id: `acc-cl-${rid()}`,
    category: 'accents',
    kind: 'classify',
    rubric: `Clasifica la palabra «${target.word}» según la posición de su sílaba tónica.`,
    payload: { word: target.word, syllables: syllabify(target.word), options: opts.map(o => ({ id: o, label: CLASS_LABEL[o] })) },
    answer: target.cls,
    explain: {
      rule: `«${target.word}» es <strong>${CLASS_LABEL[target.cls]}</strong>. Sílabas: ${syllabify(target.word).join('-')}. Tónica: ${syllabify(target.word)[stressedSyl(target.word)]}.`,
      example: ruleExplanation(target.rule),
    },
    fingerprint: `accents|cl|${target.word}`,
  };
}

// ---------- ADD TILDE (click the vowel) ----------
export function buildTildeExercise(settings) {
  const pool = poolFor(settings.level).filter(w => w.needs);
  const target = pick(pool);
  // Strip tilde from the word and show it; user clicks the vowel that should bear the tilde.
  const noTilde = stripTilde(target.word);
  const correctIdx = vowelIndexFromAccented(target.word);
  return {
    id: `acc-tl-${rid()}`,
    category: 'accents',
    kind: 'tilde',
    rubric: `¿Sobre qué vocal debe ir la tilde? Toca la letra.`,
    payload: { displayWord: noTilde, originalWord: target.word, syllables: syllabify(target.word) },
    answer: correctIdx,
    explain: {
      rule: `La forma correcta es <strong>${target.word}</strong>.`,
      example: ruleExplanation(target.rule),
    },
    fingerprint: `accents|tl|${target.word}`,
  };
}

// ---------- NEEDS TILDE? (Yes / No) ----------
export function buildNeedsTildeExercise(settings) {
  const pool = poolFor(settings.level);
  const target = pick(pool);
  const display = stripTilde(target.word);
  return {
    id: `acc-nt-${rid()}`,
    category: 'accents',
    kind: 'mcq',
    rubric: `¿La palabra «${display}» lleva tilde?`,
    payload: {
      word: display,
      options: ['Sí', 'No'],
      sentence: target.example || null,
    },
    answer: target.needs ? 'Sí' : 'No',
    explain: {
      rule: target.needs
        ? `<strong>${target.word}</strong> lleva tilde. ${ruleExplanation(target.rule)}`
        : `<strong>${display}</strong> no lleva tilde. ${ruleExplanation(target.rule)}`,
      example: '',
    },
    fingerprint: `accents|nt|${target.word}`,
  };
}

// ---------- DIACRÍTICA ----------
export function buildDiacriticExercise(settings) {
  const item = pick(DIACRITIC);
  const [tonic, atonic] = item.pair;
  // Decide which sentence to test
  const useTonic = Math.random() < 0.5;
  const target = useTonic ? tonic : atonic;
  const other = useTonic ? atonic : tonic;
  const example = item.examples[useTonic ? tonic : atonic];
  // Hide the form and ask for the right one (tonic vs atonic)
  const masked = example.replace(new RegExp(`\\b${target}\\b`, 'i'), '___');
  return {
    id: `acc-dia-${rid()}`,
    category: 'accents',
    kind: 'mcq',
    rubric: `Elige la forma correcta en la oración.`,
    payload: {
      sentence: masked,
      options: shuffle([tonic, atonic]),
    },
    answer: target,
    explain: {
      rule: `«${target}» = ${item.senses[target]}. «${other}» = ${item.senses[other]}.`,
      example: `Ej.: <em>${item.examples[target]}</em>`,
    },
    fingerprint: `accents|dia|${target}|${masked}`,
  };
}

// ---------- INTERROGATIVO ----------
export function buildInterroExercise(settings) {
  const it = pick(INTERRO);
  const tonic = Math.random() < 0.5;
  const target = tonic ? it.word : it.plain;
  const example = tonic ? it.examples.tonic : it.examples.plain;
  const masked = example.replace(new RegExp(`\\b${target}\\b`, 'i'), '___');
  return {
    id: `acc-int-${rid()}`,
    category: 'accents',
    kind: 'mcq',
    rubric: `Elige la palabra correcta para la oración.`,
    payload: { sentence: masked, options: shuffle([it.word, it.plain]) },
    answer: target,
    explain: {
      rule: tonic
        ? `Lleva tilde porque introduce una pregunta directa o indirecta, o una exclamación.`
        : `No lleva tilde: aquí «${it.plain}» actúa como relativo o conjunción.`,
      example: `Ej. con tilde: <em>${it.examples.tonic}</em><br>Ej. sin tilde: <em>${it.examples.plain}</em>`,
    },
    fingerprint: `accents|int|${target}|${masked}`,
  };
}

// ---------- helpers ----------
let counter = 1;
function rid() { return (counter++).toString(36) + Math.random().toString(36).slice(2, 6); }

function ruleExplanation(rule) {
  const M = {
    'aguda-vns':  'Las palabras agudas llevan tilde cuando terminan en vocal, n o s.',
    'aguda-otros':'Las palabras agudas <strong>no</strong> llevan tilde si terminan en consonante distinta de n o s.',
    'llana-vns':  'Las palabras llanas <strong>no</strong> llevan tilde si terminan en vocal, n o s.',
    'llana-otros':'Las palabras llanas llevan tilde cuando terminan en consonante distinta de n o s.',
    'esdrujula':  'Las palabras esdrújulas siempre llevan tilde.',
    'sobreesdrujula':'Las sobreesdrújulas siempre llevan tilde.',
    'hiato-tilde':'Cuando una vocal débil tónica (i, u) está junto a una fuerte (a, e, o), se rompe el diptongo y la débil lleva tilde para marcar el hiato.',
  };
  return M[rule] || '';
}

function vowelIndexFromAccented(word) {
  // Find the position of the tilde-bearing vowel in the stripped word.
  const lower = word.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    if (/[áéíóú]/.test(lower[i])) return i;
  }
  return -1;
}

function stressedSyl(word) {
  // Returns index of stressed syllable in the syllable list of `word`.
  // We rely on the tilde being present; if no tilde, use prosodic rule.
  const syls = syllabify(word);
  for (let i = 0; i < syls.length; i++) if (/[áéíóú]/i.test(syls[i])) return i;
  // prosodic: ends in vowel/n/s -> penultimate
  const last = word.slice(-1).toLowerCase();
  if (/[aeiouns]/.test(last)) return Math.max(0, syls.length - 2);
  return syls.length - 1;
}

export const ACCENT_GENERATORS = {
  classify:     buildClassifyExercise,
  tilde:        buildTildeExercise,
  needsTilde:   buildNeedsTildeExercise,
  diacritic:    buildDiacriticExercise,
  interro:      buildInterroExercise,
};
