// Spanish conjugator. Handles regular, stem-changing, spelling-changing
// and irregular verbs. Builds a full conjugation table on demand.
//
// Tense keys (internal):
//   pres_ind, pret_ind, impf_ind, fut_ind, cond,
//   pres_sub, impf_sub_ra, impf_sub_se, imper_afirm,
//   pres_perf, plusc, fut_perf, cond_perf,
//   pres_perf_sub, plusc_sub,
//   gerundio, participio
//
// Person keys: yo, tu, el, nos, vos, ellos (6).
// (Imperative has no "yo" — uses placeholder "—".)

import { VERBS, getVerb } from '../data/verbs.js';

export const PERSONS = ['yo', 'tu', 'el', 'nos', 'vos', 'ellos'];
export const PERSON_LABEL = {
  yo: 'yo',
  tu: 'tú',
  el: 'él / ella / usted',
  nos: 'nosotros / nosotras',
  vos: 'vosotros / vosotras',
  ellos: 'ellos / ellas / ustedes',
};
export const PERSON_PRONOUN = {
  yo: 'yo', tu: 'tú', el: 'él', nos: 'nosotros', vos: 'vosotros', ellos: 'ellos'
};

export const TENSES = {
  pres_ind:    { name: 'Presente de indicativo',           mood: 'indicativo',   composite: false, level: 1 },
  pret_ind:    { name: 'Pretérito perfecto simple',         mood: 'indicativo',   composite: false, level: 2 },
  impf_ind:    { name: 'Pretérito imperfecto',               mood: 'indicativo',   composite: false, level: 2 },
  fut_ind:     { name: 'Futuro simple',                       mood: 'indicativo',   composite: false, level: 2 },
  cond:        { name: 'Condicional simple',                  mood: 'indicativo',   composite: false, level: 2 },
  pres_sub:    { name: 'Presente de subjuntivo',              mood: 'subjuntivo',   composite: false, level: 2 },
  impf_sub_ra: { name: 'Pretérito imperfecto de subjuntivo (‑ra)', mood: 'subjuntivo', composite: false, level: 3 },
  impf_sub_se: { name: 'Pretérito imperfecto de subjuntivo (‑se)', mood: 'subjuntivo', composite: false, level: 3 },
  imper_afirm: { name: 'Imperativo afirmativo',               mood: 'imperativo',   composite: false, level: 2 },
  pres_perf:   { name: 'Pretérito perfecto compuesto',        mood: 'indicativo',   composite: true,  haberTense: 'pres_ind',    level: 3 },
  plusc:       { name: 'Pretérito pluscuamperfecto',          mood: 'indicativo',   composite: true,  haberTense: 'impf_ind',    level: 3 },
  fut_perf:    { name: 'Futuro perfecto',                      mood: 'indicativo',   composite: true,  haberTense: 'fut_ind',     level: 3 },
  cond_perf:   { name: 'Condicional perfecto',                 mood: 'indicativo',   composite: true,  haberTense: 'cond',        level: 3 },
  pres_perf_sub:{ name: 'Pretérito perfecto de subjuntivo',    mood: 'subjuntivo',   composite: true,  haberTense: 'pres_sub',    level: 3 },
  plusc_sub:   { name: 'Pluscuamperfecto de subjuntivo',       mood: 'subjuntivo',   composite: true,  haberTense: 'impf_sub_ra', level: 3 },
};
export const SIMPLE_TENSES = Object.keys(TENSES).filter(t => !TENSES[t].composite);
export const COMPOSITE_TENSES = Object.keys(TENSES).filter(t => TENSES[t].composite);

// ---------- regular endings -----------------------------------------
// Each tense maps to 6 endings (yo, tú, él, nos, vos, ellos).
// For futuro/condicional the stem is the FULL infinitive, not the trimmed one.
const REG_ENDINGS = {
  ar: {
    pres_ind:    ['o','as','a','amos','áis','an'],
    pret_ind:    ['é','aste','ó','amos','asteis','aron'],
    impf_ind:    ['aba','abas','aba','ábamos','abais','aban'],
    pres_sub:    ['e','es','e','emos','éis','en'],
    impf_sub_ra: ['ara','aras','ara','áramos','arais','aran'],
    impf_sub_se: ['ase','ases','ase','ásemos','aseis','asen'],
    imper_afirm: ['—','a','e','emos','ad','en'],
    gerundio:    'ando',
    participio:  'ado',
  },
  er: {
    pres_ind:    ['o','es','e','emos','éis','en'],
    pret_ind:    ['í','iste','ió','imos','isteis','ieron'],
    impf_ind:    ['ía','ías','ía','íamos','íais','ían'],
    pres_sub:    ['a','as','a','amos','áis','an'],
    impf_sub_ra: ['iera','ieras','iera','iéramos','ierais','ieran'],
    impf_sub_se: ['iese','ieses','iese','iésemos','ieseis','iesen'],
    imper_afirm: ['—','e','a','amos','ed','an'],
    gerundio:    'iendo',
    participio:  'ido',
  },
  ir: {
    pres_ind:    ['o','es','e','imos','ís','en'],
    pret_ind:    ['í','iste','ió','imos','isteis','ieron'],
    impf_ind:    ['ía','ías','ía','íamos','íais','ían'],
    pres_sub:    ['a','as','a','amos','áis','an'],
    impf_sub_ra: ['iera','ieras','iera','iéramos','ierais','ieran'],
    impf_sub_se: ['iese','ieses','iese','iésemos','ieseis','iesen'],
    imper_afirm: ['—','e','a','amos','id','an'],
    gerundio:    'iendo',
    participio:  'ido',
  },
};
// Futuro and Condicional share endings across all conjugations; stem = infinitive.
const FUT_ENDINGS = ['é','ás','á','emos','éis','án'];
const COND_ENDINGS = ['ía','ías','ía','íamos','íais','ían'];

// ---------- regular base -------------------------------------------
function getType(inf) {
  if (inf.endsWith('ar')) return 'ar';
  if (inf.endsWith('er')) return 'er';
  if (inf.endsWith('ir') || inf.endsWith('ír')) return 'ir';
  return null;
}
function stemOf(inf) {
  return inf.slice(0, -2);
}

// Spelling guard for some endings (regulars):
//  -car  -> c becomes 'qu' before 'e' (pres_sub all, pret_ind yo)
//  -gar  -> g becomes 'gu' before 'e'
//  -zar  -> z becomes 'c' before 'e'
//  -ger/-gir -> g becomes 'j' before 'a','o'
//  -guir -> gu becomes 'g' before 'a','o'
//  -cer/-cir (after consonant) -> c becomes 'z' before 'a','o' (vencer, esparcir)
//  -cer/-cir (after vowel) -> insert 'z' (conocer -> conozco) [handled in irregulars]
function applySpelling(stem, suffix, type) {
  const first = suffix[0];
  const endsWith = ch => stem.endsWith(ch);

  // -car / -gar / -zar : only before 'e'
  if (first === 'e') {
    if (endsWith('c') && type === 'ar') return stem.slice(0, -1) + 'qu' + suffix;
    if (endsWith('g') && type === 'ar') return stem.slice(0, -1) + 'gu' + suffix;
    if (endsWith('z') && type === 'ar') return stem.slice(0, -1) + 'c' + suffix;
  }
  // -ger / -gir : g -> j before 'a','o'
  if ((first === 'a' || first === 'o') && (type === 'er' || type === 'ir') && endsWith('g')) {
    return stem.slice(0, -1) + 'j' + suffix;
  }
  // -guir : gu -> g before 'a','o'
  if ((first === 'a' || first === 'o') && type === 'ir' && stem.endsWith('gu')) {
    return stem.slice(0, -2) + 'g' + suffix;
  }
  return stem + suffix;
}

function applySpellingFinal(form, type) {
  // 'i' in some endings turns to 'y' between vowels (caer -> cayó),
  // and ió/ieron unstressed 'i' drops in -ir verbs like reír.
  // Handled by irregular overrides where applicable.
  return form;
}

// ---------- stem-changers --------------------------------------------
// Stem-changing patterns affect pres_ind (yo/tú/él/ellos) and pres_sub,
// and in -ir verbs also nos/vos of pres_sub, pret_ind (3rd persons), and
// the gerundio.
//
// We model the change as a single substitution applied to the trimmed stem
// (the last occurrence of the vowel in the stem).
function changeStem(stem, fromVowel, toString) {
  // Replace last occurrence of fromVowel in stem
  const idx = stem.lastIndexOf(fromVowel);
  if (idx === -1) return stem;
  return stem.slice(0, idx) + toString + stem.slice(idx + 1);
}

// ---------- main builder --------------------------------------------
export function conjugate(verb) {
  if (typeof verb === 'string') verb = getVerb(verb);
  if (!verb) throw new Error('Verb not found');

  const inf = verb.inf;
  const type = verb.type || getType(inf);
  if (!type) throw new Error(`Unknown type for ${inf}`);

  // For irregulars given explicitly, we trust their `forms` and fill in the rest.
  // Result: { tense: { person: form, ... } }
  const out = {};

  // Initialize with REGULAR forms.
  const stem = stemOf(inf);
  for (const t of ['pres_ind','pret_ind','impf_ind','pres_sub','impf_sub_ra','impf_sub_se','imper_afirm']) {
    out[t] = {};
    const endings = REG_ENDINGS[type][t];
    for (let i = 0; i < 6; i++) {
      const p = PERSONS[i];
      out[t][p] = applySpelling(stem, endings[i], type);
    }
  }
  // Futuro / condicional use the full infinitive.
  out.fut_ind = {};
  out.cond = {};
  for (let i = 0; i < 6; i++) {
    out.fut_ind[PERSONS[i]] = inf + FUT_ENDINGS[i];
    out.cond[PERSONS[i]] = inf + COND_ENDINGS[i];
  }
  out.gerundio = REG_ENDINGS[type].gerundio === 'ando' ? stem + 'ando' : stem + 'iendo';
  out.participio = REG_ENDINGS[type].participio === 'ado' ? stem + 'ado' : stem + 'ido';

  // Apply stem-change patterns.
  if (verb.stemChange) applyStemChange(out, verb, stem, type);

  // Apply explicit per-form overrides (irregulars).
  if (verb.overrides) applyOverrides(out, verb.overrides);

  // Imperative tú: usually = 3rd person sing pres_ind (regulars).
  // For irregulars: di, haz, ten, pon, ven, sal, sé, ve. We rely on overrides for those.
  // We've already set imper_afirm.tu via the regular pattern (e.g. habla, come, vive).

  // Imperative usted/ustedes/nosotros = pres_sub el/ellos/nos
  // The endings tables for imper_afirm already match. But for verbs with stem-changes
  // we re-sync after stem-change application so they stay consistent.
  out.imper_afirm.el    = out.pres_sub.el;
  out.imper_afirm.nos   = out.pres_sub.nos;
  out.imper_afirm.ellos = out.pres_sub.ellos;
  // tú imperative for regulars = 3rd pers sing pres_ind, unless overridden
  if (!verb.overrides?.imper_afirm?.tu) out.imper_afirm.tu = out.pres_ind.el;
  // vosotros = infinitive ending changed: -r -> -d
  if (!verb.overrides?.imper_afirm?.vos) out.imper_afirm.vos = inf.slice(0, -1) + 'd';

  // Composite tenses: haber + participio.
  const haber = HABER_TABLE;
  for (const ct of COMPOSITE_TENSES) {
    out[ct] = {};
    const ht = TENSES[ct].haberTense;
    for (const p of PERSONS) {
      out[ct][p] = `${haber[ht][p]} ${out.participio}`;
    }
  }

  return out;
}

function applyStemChange(out, verb, stem, type) {
  const sc = verb.stemChange; // { from: 'e', to: 'ie' } or { from: 'o', to: 'ue' } or { from: 'e', to: 'i' } or { from: 'u', to: 'ue' } or { dual: ['o','ue','u'] }
  const dual = sc.dual; // [base,'ue','u'] for dormir; ['e','ie','i'] for sentir; ['e','i','i'] for pedir-like (also used for -ir e>i)
  // Determine substitutions per slot.
  // For -ar / -er verbs (no -ir): change applies to stressed forms only:
  //   pres_ind: yo, tu, el, ellos; pres_sub: yo, tu, el, ellos.
  // For -ir verbs: same as above + extras (pres_sub nos/vos with weak change for dual;
  //   pret_ind el/ellos; impf_sub all; gerundio).
  const stressed = ['yo','tu','el','ellos'];
  const subStressed = ['yo','tu','el','ellos'];

  const changed = (s, from, to) => changeStem(s, from, to);
  if (dual) {
    const [from, strong, weak] = dual;
    // present indicative: stressed get "strong" change
    for (const p of stressed) {
      const e = REG_ENDINGS[type].pres_ind[PERSONS.indexOf(p)];
      out.pres_ind[p] = applySpelling(changed(stem, from, strong), e, type);
    }
    // present subjuntivo
    for (let i = 0; i < 6; i++) {
      const p = PERSONS[i];
      const e = REG_ENDINGS[type].pres_sub[i];
      let st = stem;
      if (subStressed.includes(p)) st = changed(stem, from, strong);
      else if (type === 'ir') st = changed(stem, from, weak); // dormir nos/vos: durm-amos
      out.pres_sub[p] = applySpelling(st, e, type);
    }
    if (type === 'ir') {
      // pretérito 3ª persona
      out.pret_ind.el    = applySpelling(changed(stem, from, weak), REG_ENDINGS[type].pret_ind[2], type);
      out.pret_ind.ellos = applySpelling(changed(stem, from, weak), REG_ENDINGS[type].pret_ind[5], type);
      // imperfecto subjuntivo (todas las personas)
      for (let i = 0; i < 6; i++) {
        const p = PERSONS[i];
        out.impf_sub_ra[p] = applySpelling(changed(stem, from, weak), REG_ENDINGS[type].impf_sub_ra[i], type);
        out.impf_sub_se[p] = applySpelling(changed(stem, from, weak), REG_ENDINGS[type].impf_sub_se[i], type);
      }
      // gerundio
      out.gerundio = changed(stem, from, weak) + 'iendo';
    }
    // imperativo tú from el of pres_ind
    out.imper_afirm.tu = out.pres_ind.el;
  } else {
    const { from, to } = sc; // simple change
    for (const p of stressed) {
      const e = REG_ENDINGS[type].pres_ind[PERSONS.indexOf(p)];
      out.pres_ind[p] = applySpelling(changed(stem, from, to), e, type);
    }
    for (const p of subStressed) {
      const e = REG_ENDINGS[type].pres_sub[PERSONS.indexOf(p)];
      out.pres_sub[p] = applySpelling(changed(stem, from, to), e, type);
    }
    // -ir e -> i specifics already covered via dual variant; for e->i we expect dual to be used.
    out.imper_afirm.tu = out.pres_ind.el;
  }
}

function applyOverrides(out, overrides) {
  for (const tense of Object.keys(overrides)) {
    const v = overrides[tense];
    if (typeof v === 'string') {
      // gerundio / participio
      out[tense] = v;
    } else {
      out[tense] = out[tense] || {};
      for (const p of Object.keys(v)) {
        out[tense][p] = v[p];
      }
    }
  }
}

// ---------- HABER table for composite tenses ------------------------
// Built once and cached. Defined as a module-level constant.
const HABER_TABLE = (function () {
  return {
    pres_ind: { yo: 'he', tu: 'has', el: 'ha', nos: 'hemos', vos: 'habéis', ellos: 'han' },
    impf_ind: { yo: 'había', tu: 'habías', el: 'había', nos: 'habíamos', vos: 'habíais', ellos: 'habían' },
    fut_ind:  { yo: 'habré', tu: 'habrás', el: 'habrá', nos: 'habremos', vos: 'habréis', ellos: 'habrán' },
    cond:     { yo: 'habría', tu: 'habrías', el: 'habría', nos: 'habríamos', vos: 'habríais', ellos: 'habrían' },
    pres_sub: { yo: 'haya', tu: 'hayas', el: 'haya', nos: 'hayamos', vos: 'hayáis', ellos: 'hayan' },
    impf_sub_ra: { yo: 'hubiera', tu: 'hubieras', el: 'hubiera', nos: 'hubiéramos', vos: 'hubierais', ellos: 'hubieran' },
  };
})();

// ---------- public helpers -------------------------------------------
export function formOf(verbOrInf, tense, person) {
  const v = typeof verbOrInf === 'string' ? getVerb(verbOrInf) : verbOrInf;
  const table = conjugate(v);
  if (tense === 'gerundio' || tense === 'participio') return table[tense];
  return table[tense]?.[person];
}

export function buildTableFor(inf) {
  return conjugate(getVerb(inf));
}
