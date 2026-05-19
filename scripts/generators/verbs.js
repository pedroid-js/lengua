// Verb exercise generators.
// Each generator returns an Exercise object:
//  {
//    id: 'verb-fill-0001',
//    category: 'verbs',
//    kind: 'fill' | 'mcq' | 'transform' | 'identify',
//    rubric: 'Conjuga el verbo entre paréntesis…',
//    payload: { ... view-specific data ... },
//    answer: 'string'  OR  answer: { ... }     (target solution)
//    explain: { rule, example },                (used by corrector)
//    fingerprint: 'verbs|fill|hablar|pres_ind|yo'
//  }

import { conjugate, TENSES, PERSONS, PERSON_LABEL, PERSON_PRONOUN } from '../engine/conjugator.js';
import { listVerbs, getVerb } from '../data/verbs.js';
import { pick, pickN, pickFresh, shuffle } from '../util/rand.js';

// Tense allowed by level.
function tensesForLevel(level, enabled) {
  const all = Object.keys(TENSES);
  return all.filter(t => TENSES[t].level <= level && enabled.has(t));
}

function groupsForSettings(settings) {
  const g = new Set();
  if (settings.vRegular) g.add('regular');
  if (settings.vStem) g.add('stem');
  if (settings.vIrregular) g.add('irregular');
  if (settings.vSpelling) g.add('spelling');
  return g;
}

function pickVerb(settings) {
  const groups = groupsForSettings(settings);
  const pool = listVerbs({ level: settings.level, groups });
  if (!pool.length) return pick(listVerbs({ level: 3 }));
  return pick(pool);
}

function pickTense(settings) {
  const enabled = settings.tenses;
  const tlist = tensesForLevel(settings.level, enabled);
  if (!tlist.length) return 'pres_ind';
  return pick(tlist);
}

function pickPerson(tense) {
  // Imperativo no tiene "yo"
  const persons = tense === 'imper_afirm' ? PERSONS.filter(p => p !== 'yo') : PERSONS;
  return pick(persons);
}

// ---------- FILL THE BLANK ----------
export function buildFillExercise(settings) {
  const verb = pickVerb(settings);
  const tense = pickTense(settings);
  const person = pickPerson(tense);
  const table = conjugate(verb);
  const answer = table[tense][person];
  const subject = PERSON_PRONOUN[person];
  const rubric = `Escribe la forma de «${verb.inf}» en ${TENSES[tense].name} para ${PERSON_LABEL[person]}.`;
  const context = sentenceFor(verb, tense, person);
  return {
    id: `verb-fill-${rid()}`,
    category: 'verbs',
    kind: 'fill',
    rubric,
    payload: { verb: verb.inf, tense, person, subject, sentence: context, hint: hintFor(verb, tense) },
    answer,
    explain: explainFor(verb, tense, person, answer),
    fingerprint: `verbs|fill|${verb.inf}|${tense}|${person}`,
  };
}

// ---------- MULTIPLE CHOICE ----------
export function buildMcqExercise(settings) {
  const verb = pickVerb(settings);
  const tense = pickTense(settings);
  const person = pickPerson(tense);
  const table = conjugate(verb);
  const correct = table[tense][person];
  // Generate plausible distractors: other persons of same tense, and regularized form.
  const distractors = new Set();
  for (const p of PERSONS) {
    if (p === person) continue;
    distractors.add(table[tense][p]);
  }
  // Add regularized form (apply regular template ignoring overrides) as wrong if differs.
  const regWrong = regularizedForm(verb, tense, person);
  if (regWrong && regWrong !== correct) distractors.add(regWrong);
  const opts = shuffle([correct, ...pickN([...distractors], 3)]).slice(0, 4);
  // make sure correct is in opts
  if (!opts.includes(correct)) opts[0] = correct;
  return {
    id: `verb-mcq-${rid()}`,
    category: 'verbs',
    kind: 'mcq',
    rubric: `¿Cuál es la forma correcta de «${verb.inf}» en ${TENSES[tense].name} para ${PERSON_LABEL[person]}?`,
    payload: { verb: verb.inf, tense, person, options: opts, sentence: sentenceFor(verb, tense, person) },
    answer: correct,
    explain: explainFor(verb, tense, person, correct),
    fingerprint: `verbs|mcq|${verb.inf}|${tense}|${person}`,
  };
}

// ---------- TRANSFORM (rewrite sentence in another tense) ----------
export function buildTransformExercise(settings) {
  const verb = pickVerb(settings);
  // Pick two different tenses available
  const enabled = tensesForLevel(settings.level, settings.tenses).filter(t =>
    t !== 'imper_afirm' && t !== 'pres_perf_sub' && t !== 'plusc_sub'
  );
  if (enabled.length < 2) return buildFillExercise(settings);
  const [from, to] = pickN(enabled, 2);
  const person = pickPerson(from);
  const table = conjugate(verb);
  const givenForm = table[from][person];
  const answer = table[to][person];
  const sourceSentence = sentenceWithForm(verb, person, givenForm);
  return {
    id: `verb-tr-${rid()}`,
    category: 'verbs',
    kind: 'transform',
    rubric: `Reescribe la oración cambiando «${givenForm}» (${TENSES[from].name}) a ${TENSES[to].name}.`,
    payload: { verb: verb.inf, person, from, to, source: sourceSentence, given: givenForm, sentenceTpl: sentenceTplFor(verb, person) },
    answer,
    explain: explainFor(verb, to, person, answer),
    fingerprint: `verbs|tr|${verb.inf}|${from}->${to}|${person}`,
  };
}

// ---------- IDENTIFY (given a conjugated form, identify tense + person) ----------
export function buildIdentifyExercise(settings) {
  const verb = pickVerb(settings);
  const tense = pickTense(settings);
  const person = pickPerson(tense);
  const table = conjugate(verb);
  const form = table[tense][person];
  // Options: combine 4 tense+person labels
  const targetLabel = `${TENSES[tense].name} · ${PERSON_LABEL[person]}`;
  const tlist = Object.keys(TENSES).filter(t => TENSES[t].level <= settings.level && t !== tense && t !== 'imper_afirm');
  const distractors = new Set();
  while (distractors.size < 3 && tlist.length) {
    const t = pick(tlist);
    const p = pick(PERSONS);
    const label = `${TENSES[t].name} · ${PERSON_LABEL[p]}`;
    if (label !== targetLabel) distractors.add(label);
  }
  const options = shuffle([targetLabel, ...distractors]);
  return {
    id: `verb-id-${rid()}`,
    category: 'verbs',
    kind: 'identify',
    rubric: `¿En qué tiempo y persona está la forma «${form}» del verbo «${verb.inf}»?`,
    payload: { verb: verb.inf, form, options },
    answer: targetLabel,
    explain: explainFor(verb, tense, person, form),
    fingerprint: `verbs|id|${verb.inf}|${tense}|${person}`,
  };
}

// ---------- helpers --------------------------------------------------
let counter = 1;
function rid() { return (counter++).toString(36) + Math.random().toString(36).slice(2, 6); }

function sentenceFor(verb, tense, person) {
  const subj = PERSON_PRONOUN[person];
  const cap = subj[0].toUpperCase() + subj.slice(1);
  const topic = topicFor(verb);
  const time  = timeMarkerFor(tense);
  // Imperative
  if (tense === 'imper_afirm') {
    return `[${PERSON_LABEL[person]}] ___ ${topic}.`;
  }
  // Composite with haber: we leave a single blank for the whole compound.
  return `${cap} ___ ${topic} ${time}.`;
}

function sentenceWithForm(verb, person, form) {
  const subj = PERSON_PRONOUN[person];
  const cap = subj[0].toUpperCase() + subj.slice(1);
  const topic = topicFor(verb);
  return `${cap} ${form} ${topic}.`;
}

function sentenceTplFor(verb, person) {
  const subj = PERSON_PRONOUN[person];
  const cap = subj[0].toUpperCase() + subj.slice(1);
  const topic = topicFor(verb);
  return `${cap} ___ ${topic}.`;
}

function topicFor(verb) {
  // Pick a thematically One Piece flavor object/complement per verb.
  const TOPICS = {
    hablar: 'con la tripulación',
    cantar: 'una canción pirata',
    bailar: 'en la cubierta',
    caminar: 'por la cubierta',
    comprar: 'provisiones en Loguetown',
    trabajar: 'en el Going Merry',
    estudiar: 'mapas del Grand Line',
    mirar: 'el horizonte',
    escuchar: 'los rumores del mar',
    navegar: 'hacia Raftel',
    buscar: 'el One Piece',
    pescar: 'un Rey del Mar',
    almorzar: 'en la cocina del Sunny',
    empezar: 'el viaje al amanecer',
    comer: 'carne en el Baratie',
    beber: 'sake con Shanks',
    aprender: 'a usar el Haki',
    leer: 'un poneglyph',
    creer: 'en sus sueños',
    correr: 'tras la Akuma no Mi',
    vender: 'tesoros en Mock Town',
    vivir: 'la vida de pirata',
    escribir: 'una carta a Vivi',
    abrir: 'el cofre del tesoro',
    partir: 'rumbo a Wano',
    subir: 'al cabo del Sunny',
    recibir: 'una recompensa enorme',
    pensar: 'en su próxima aventura',
    cerrar: 'la puerta de la cocina',
    entender: 'el plan de Robin',
    querer: 'ser el Rey de los Piratas',
    volver: 'a casa, a Foosha',
    poder: 'derrotar a Kaido',
    dormir: 'sobre el césped del Sunny',
    morir: 'antes que rendirse',
    sentir: 'la presencia del enemigo',
    preferir: 'la carne a las verduras',
    pedir: 'ayuda a Jinbe',
    servir: 'la cena en cubierta',
    repetir: 'el ataque Gomu Gomu',
    jugar: 'a las cartas con Usopp',
    ser: 'un pirata libre',
    estar: 'en alta mar',
    ir: 'al Nuevo Mundo',
    tener: 'una Akuma no Mi',
    hacer: 'guardia de noche',
    decir: 'la verdad a Nami',
    venir: 'al rescate',
    poner: 'rumbo al norte',
    salir: 'antes de la tormenta',
    saber: 'la ruta al Logue Pose',
    ver: 'una isla en el horizonte',
    dar: 'el toque final al menú',
    conocer: 'a los Yonkō',
    traer: 'el mapa de la Marina',
    oír: 'el grito de la sirena',
    haber: 'completado el viaje',
  };
  return TOPICS[verb.inf] || `(${verb.inf})`;
}

function timeMarkerFor(tense) {
  const M = {
    pres_ind: 'ahora',
    pret_ind: 'ayer',
    impf_ind: 'todos los días',
    fut_ind: 'mañana',
    cond: 'si pudiera',
    pres_sub: 'cuando salga el sol',
    impf_sub_ra: 'si las olas lo permitieran',
    impf_sub_se: 'si las olas lo permitiesen',
    pres_perf: 'esta semana',
    plusc: 'antes de zarpar',
    fut_perf: 'para cuando lleguemos',
    cond_perf: 'si lo hubiera sabido',
    pres_perf_sub: 'aunque ya haya pasado',
    plusc_sub: 'si lo hubiera previsto',
    imper_afirm: '',
  };
  return M[tense] || '';
}

function hintFor(verb, tense) {
  const t = TENSES[tense];
  const grp = verb.group;
  const noun = {
    regular: `Es un verbo regular en -${verb.type}.`,
    stem:    `Cuidado: «${verb.inf}» tiene cambio vocálico.`,
    spelling:`Cuidado: «${verb.inf}» puede sufrir cambio ortográfico ante 'e' o 'a/o'.`,
    irregular:`«${verb.inf}» es irregular en varios tiempos.`,
  }[grp] || '';
  return `${noun} ${t.composite ? 'Es un tiempo compuesto: usa el auxiliar «haber» + participio.' : ''}`.trim();
}

function explainFor(verb, tense, person, correct) {
  const tName = TENSES[tense].name;
  const pName = PERSON_LABEL[person];
  return {
    rule: `«${verb.inf}» en ${tName} (${pName}) es <strong>${correct}</strong>.`,
    example: `Pista: ${hintFor(verb, tense)}`,
  };
}

// Builds a strictly-regular form for distractors (ignoring overrides).
function regularizedForm(verb, tense, person) {
  try {
    const fake = { inf: verb.inf, type: verb.type, group: 'regular' };
    const table = conjugate(fake);
    if (tense === 'gerundio' || tense === 'participio') return table[tense];
    return table[tense]?.[person];
  } catch { return null; }
}

export const VERB_GENERATORS = {
  fill:      buildFillExercise,
  mcq:       buildMcqExercise,
  transform: buildTransformExercise,
  identify:  buildIdentifyExercise,
};
