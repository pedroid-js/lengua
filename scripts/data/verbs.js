// Verb catalogue. Each entry:
//  inf      - infinitive
//  type     - 'ar' | 'er' | 'ir'
//  group    - 'regular' | 'stem' | 'spelling' | 'irregular'
//  level    - 1..3 (difficulty)
//  meaning  - quick gloss for hints
//  stemChange (optional) - { from, to } or { dual: [base, strong, weak] }
//  overrides (optional)  - { tense: { person: form } | string }
//                          string for gerundio/participio
//
// Tense person keys: yo, tu, el, nos, vos, ellos.

export const VERBS = [
  // --- REGULAR -ar (level 1) -------------------------------------------------
  { inf: 'hablar',   type: 'ar', group: 'regular', level: 1, meaning: 'hablar / decir cosas' },
  { inf: 'cantar',   type: 'ar', group: 'regular', level: 1, meaning: 'producir música con la voz' },
  { inf: 'bailar',   type: 'ar', group: 'regular', level: 1, meaning: 'mover el cuerpo al ritmo' },
  { inf: 'caminar',  type: 'ar', group: 'regular', level: 1, meaning: 'andar' },
  { inf: 'comprar',  type: 'ar', group: 'regular', level: 1, meaning: 'adquirir por dinero' },
  { inf: 'trabajar', type: 'ar', group: 'regular', level: 1, meaning: 'realizar una labor' },
  { inf: 'estudiar', type: 'ar', group: 'regular', level: 1, meaning: 'aprender una materia' },
  { inf: 'mirar',    type: 'ar', group: 'regular', level: 1, meaning: 'dirigir la vista' },
  { inf: 'escuchar', type: 'ar', group: 'regular', level: 1, meaning: 'prestar atención al oído' },
  { inf: 'navegar',  type: 'ar', group: 'spelling', level: 2, meaning: 'viajar por el mar' }, // -gar
  { inf: 'buscar',   type: 'ar', group: 'spelling', level: 2, meaning: 'tratar de encontrar' },  // -car
  { inf: 'pescar',   type: 'ar', group: 'spelling', level: 2, meaning: 'capturar peces' },        // -car
  { inf: 'almorzar', type: 'ar', group: 'spelling', level: 2, meaning: 'comer al mediodía', stemChange: { from: 'o', to: 'ue' } }, // -zar + stem
  { inf: 'empezar',  type: 'ar', group: 'spelling', level: 2, meaning: 'comenzar', stemChange: { from: 'e', to: 'ie' } },

  // --- REGULAR -er (level 1) -------------------------------------------------
  { inf: 'comer',    type: 'er', group: 'regular', level: 1, meaning: 'ingerir alimentos' },
  { inf: 'beber',    type: 'er', group: 'regular', level: 1, meaning: 'ingerir líquidos' },
  { inf: 'aprender', type: 'er', group: 'regular', level: 1, meaning: 'adquirir conocimiento' },
  { inf: 'leer',     type: 'er', group: 'regular', level: 2, meaning: 'interpretar palabras escritas', overrides: {
      pret_ind: { el: 'leyó', ellos: 'leyeron' },
      impf_sub_ra: { yo: 'leyera', tu: 'leyeras', el: 'leyera', nos: 'leyéramos', vos: 'leyerais', ellos: 'leyeran' },
      impf_sub_se: { yo: 'leyese', tu: 'leyeses', el: 'leyese', nos: 'leyésemos', vos: 'leyeseis', ellos: 'leyesen' },
      gerundio: 'leyendo',
      participio: 'leído',
    }
  },
  { inf: 'creer',    type: 'er', group: 'regular', level: 2, meaning: 'tener por cierto', overrides: {
      pret_ind: { el: 'creyó', ellos: 'creyeron' },
      impf_sub_ra: { yo: 'creyera', tu: 'creyeras', el: 'creyera', nos: 'creyéramos', vos: 'creyerais', ellos: 'creyeran' },
      impf_sub_se: { yo: 'creyese', tu: 'creyeses', el: 'creyese', nos: 'creyésemos', vos: 'creyeseis', ellos: 'creyesen' },
      gerundio: 'creyendo',
      participio: 'creído',
    }
  },
  { inf: 'correr',   type: 'er', group: 'regular', level: 1, meaning: 'moverse rápido a pie' },
  { inf: 'vender',   type: 'er', group: 'regular', level: 1, meaning: 'entregar a cambio de dinero' },

  // --- REGULAR -ir (level 1) -------------------------------------------------
  { inf: 'vivir',    type: 'ir', group: 'regular', level: 1, meaning: 'tener vida' },
  { inf: 'escribir', type: 'ir', group: 'regular', level: 2, meaning: 'plasmar con letras', overrides: { participio: 'escrito' } },
  { inf: 'abrir',    type: 'ir', group: 'regular', level: 2, meaning: 'descubrir lo cerrado', overrides: { participio: 'abierto' } },
  { inf: 'partir',   type: 'ir', group: 'regular', level: 1, meaning: 'dividir; marcharse' },
  { inf: 'subir',    type: 'ir', group: 'regular', level: 1, meaning: 'ir hacia arriba' },
  { inf: 'recibir',  type: 'ir', group: 'regular', level: 1, meaning: 'aceptar lo que llega' },

  // --- STEM-CHANGERS ---------------------------------------------------------
  { inf: 'pensar',  type: 'ar', group: 'stem', level: 2, meaning: 'razonar', stemChange: { from: 'e', to: 'ie' } },
  { inf: 'cerrar',  type: 'ar', group: 'stem', level: 2, meaning: 'tapar; obstruir', stemChange: { from: 'e', to: 'ie' } },
  { inf: 'entender',type: 'er', group: 'stem', level: 2, meaning: 'comprender', stemChange: { from: 'e', to: 'ie' } },
  { inf: 'querer',  type: 'er', group: 'irregular', level: 2, meaning: 'desear; amar', stemChange: { from: 'e', to: 'ie' },
    overrides: {
      pret_ind: { yo: 'quise', tu: 'quisiste', el: 'quiso', nos: 'quisimos', vos: 'quisisteis', ellos: 'quisieron' },
      fut_ind:  { yo: 'querré', tu: 'querrás', el: 'querrá', nos: 'querremos', vos: 'querréis', ellos: 'querrán' },
      cond:     { yo: 'querría', tu: 'querrías', el: 'querría', nos: 'querríamos', vos: 'querríais', ellos: 'querrían' },
      impf_sub_ra: { yo: 'quisiera', tu: 'quisieras', el: 'quisiera', nos: 'quisiéramos', vos: 'quisierais', ellos: 'quisieran' },
      impf_sub_se: { yo: 'quisiese', tu: 'quisieses', el: 'quisiese', nos: 'quisiésemos', vos: 'quisieseis', ellos: 'quisiesen' },
    }
  },
  { inf: 'volver',  type: 'er', group: 'stem', level: 2, meaning: 'regresar', stemChange: { from: 'o', to: 'ue' }, overrides: { participio: 'vuelto' } },
  { inf: 'poder',   type: 'er', group: 'irregular', level: 2, meaning: 'tener capacidad', stemChange: { from: 'o', to: 'ue' },
    overrides: {
      pret_ind: { yo: 'pude', tu: 'pudiste', el: 'pudo', nos: 'pudimos', vos: 'pudisteis', ellos: 'pudieron' },
      fut_ind:  { yo: 'podré', tu: 'podrás', el: 'podrá', nos: 'podremos', vos: 'podréis', ellos: 'podrán' },
      cond:     { yo: 'podría', tu: 'podrías', el: 'podría', nos: 'podríamos', vos: 'podríais', ellos: 'podrían' },
      impf_sub_ra: { yo: 'pudiera', tu: 'pudieras', el: 'pudiera', nos: 'pudiéramos', vos: 'pudierais', ellos: 'pudieran' },
      impf_sub_se: { yo: 'pudiese', tu: 'pudieses', el: 'pudiese', nos: 'pudiésemos', vos: 'pudieseis', ellos: 'pudiesen' },
      gerundio: 'pudiendo',
    }
  },
  { inf: 'dormir',  type: 'ir', group: 'stem', level: 2, meaning: 'descansar inconsciente', stemChange: { dual: ['o','ue','u'] } },
  { inf: 'morir',   type: 'ir', group: 'stem', level: 3, meaning: 'dejar de vivir', stemChange: { dual: ['o','ue','u'] }, overrides: { participio: 'muerto' } },
  { inf: 'sentir',  type: 'ir', group: 'stem', level: 2, meaning: 'percibir; experimentar emoción', stemChange: { dual: ['e','ie','i'] } },
  { inf: 'preferir',type: 'ir', group: 'stem', level: 2, meaning: 'escoger por gusto', stemChange: { dual: ['e','ie','i'] } },
  { inf: 'pedir',   type: 'ir', group: 'stem', level: 2, meaning: 'solicitar', stemChange: { dual: ['e','i','i'] } },
  { inf: 'servir',  type: 'ir', group: 'stem', level: 2, meaning: 'prestar utilidad', stemChange: { dual: ['e','i','i'] } },
  { inf: 'repetir', type: 'ir', group: 'stem', level: 2, meaning: 'hacer otra vez', stemChange: { dual: ['e','i','i'] } },
  { inf: 'jugar',   type: 'ar', group: 'stem', level: 2, meaning: 'entretenerse', stemChange: { from: 'u', to: 'ue' },
    overrides: {
      // -gar spelling change in tenses with 'e' ending
      pret_ind: { yo: 'jugué' },
      pres_sub: { yo: 'juegue', tu: 'juegues', el: 'juegue', nos: 'juguemos', vos: 'juguéis', ellos: 'jueguen' },
    }
  },

  // --- IRREGULAR FUERTE -----------------------------------------------------
  { inf: 'ser', type: 'er', group: 'irregular', level: 1, meaning: 'tener cualidad de existir', overrides: {
      pres_ind:    { yo: 'soy', tu: 'eres', el: 'es', nos: 'somos', vos: 'sois', ellos: 'son' },
      pret_ind:    { yo: 'fui', tu: 'fuiste', el: 'fue', nos: 'fuimos', vos: 'fuisteis', ellos: 'fueron' },
      impf_ind:    { yo: 'era', tu: 'eras', el: 'era', nos: 'éramos', vos: 'erais', ellos: 'eran' },
      pres_sub:    { yo: 'sea', tu: 'seas', el: 'sea', nos: 'seamos', vos: 'seáis', ellos: 'sean' },
      impf_sub_ra: { yo: 'fuera', tu: 'fueras', el: 'fuera', nos: 'fuéramos', vos: 'fuerais', ellos: 'fueran' },
      impf_sub_se: { yo: 'fuese', tu: 'fueses', el: 'fuese', nos: 'fuésemos', vos: 'fueseis', ellos: 'fuesen' },
      imper_afirm: { tu: 'sé', el: 'sea', nos: 'seamos', vos: 'sed', ellos: 'sean' },
      gerundio: 'siendo',
      participio: 'sido',
    }
  },
  { inf: 'estar', type: 'ar', group: 'irregular', level: 1, meaning: 'hallarse en un lugar o estado', overrides: {
      pres_ind:    { yo: 'estoy', tu: 'estás', el: 'está', nos: 'estamos', vos: 'estáis', ellos: 'están' },
      pret_ind:    { yo: 'estuve', tu: 'estuviste', el: 'estuvo', nos: 'estuvimos', vos: 'estuvisteis', ellos: 'estuvieron' },
      pres_sub:    { yo: 'esté', tu: 'estés', el: 'esté', nos: 'estemos', vos: 'estéis', ellos: 'estén' },
      impf_sub_ra: { yo: 'estuviera', tu: 'estuvieras', el: 'estuviera', nos: 'estuviéramos', vos: 'estuvierais', ellos: 'estuvieran' },
      impf_sub_se: { yo: 'estuviese', tu: 'estuvieses', el: 'estuviese', nos: 'estuviésemos', vos: 'estuvieseis', ellos: 'estuviesen' },
      imper_afirm: { tu: 'está', el: 'esté', nos: 'estemos', vos: 'estad', ellos: 'estén' },
    }
  },
  { inf: 'ir', type: 'ir', group: 'irregular', level: 1, meaning: 'moverse hacia un lugar', overrides: {
      pres_ind:    { yo: 'voy', tu: 'vas', el: 'va', nos: 'vamos', vos: 'vais', ellos: 'van' },
      pret_ind:    { yo: 'fui', tu: 'fuiste', el: 'fue', nos: 'fuimos', vos: 'fuisteis', ellos: 'fueron' },
      impf_ind:    { yo: 'iba', tu: 'ibas', el: 'iba', nos: 'íbamos', vos: 'ibais', ellos: 'iban' },
      pres_sub:    { yo: 'vaya', tu: 'vayas', el: 'vaya', nos: 'vayamos', vos: 'vayáis', ellos: 'vayan' },
      impf_sub_ra: { yo: 'fuera', tu: 'fueras', el: 'fuera', nos: 'fuéramos', vos: 'fuerais', ellos: 'fueran' },
      impf_sub_se: { yo: 'fuese', tu: 'fueses', el: 'fuese', nos: 'fuésemos', vos: 'fueseis', ellos: 'fuesen' },
      imper_afirm: { tu: 've', el: 'vaya', nos: 'vamos', vos: 'id', ellos: 'vayan' },
      gerundio: 'yendo',
      participio: 'ido',
    }
  },
  { inf: 'tener', type: 'er', group: 'irregular', level: 1, meaning: 'poseer', stemChange: { from: 'e', to: 'ie' }, overrides: {
      pres_ind: { yo: 'tengo' },
      pret_ind: { yo: 'tuve', tu: 'tuviste', el: 'tuvo', nos: 'tuvimos', vos: 'tuvisteis', ellos: 'tuvieron' },
      fut_ind:  { yo: 'tendré', tu: 'tendrás', el: 'tendrá', nos: 'tendremos', vos: 'tendréis', ellos: 'tendrán' },
      cond:     { yo: 'tendría', tu: 'tendrías', el: 'tendría', nos: 'tendríamos', vos: 'tendríais', ellos: 'tendrían' },
      pres_sub: { yo: 'tenga', tu: 'tengas', el: 'tenga', nos: 'tengamos', vos: 'tengáis', ellos: 'tengan' },
      impf_sub_ra: { yo: 'tuviera', tu: 'tuvieras', el: 'tuviera', nos: 'tuviéramos', vos: 'tuvierais', ellos: 'tuvieran' },
      impf_sub_se: { yo: 'tuviese', tu: 'tuvieses', el: 'tuviese', nos: 'tuviésemos', vos: 'tuvieseis', ellos: 'tuviesen' },
      imper_afirm: { tu: 'ten' },
    }
  },
  { inf: 'hacer', type: 'er', group: 'irregular', level: 1, meaning: 'realizar', overrides: {
      pres_ind: { yo: 'hago' },
      pret_ind: { yo: 'hice', tu: 'hiciste', el: 'hizo', nos: 'hicimos', vos: 'hicisteis', ellos: 'hicieron' },
      fut_ind:  { yo: 'haré', tu: 'harás', el: 'hará', nos: 'haremos', vos: 'haréis', ellos: 'harán' },
      cond:     { yo: 'haría', tu: 'harías', el: 'haría', nos: 'haríamos', vos: 'haríais', ellos: 'harían' },
      pres_sub: { yo: 'haga', tu: 'hagas', el: 'haga', nos: 'hagamos', vos: 'hagáis', ellos: 'hagan' },
      impf_sub_ra: { yo: 'hiciera', tu: 'hicieras', el: 'hiciera', nos: 'hiciéramos', vos: 'hicierais', ellos: 'hicieran' },
      impf_sub_se: { yo: 'hiciese', tu: 'hicieses', el: 'hiciese', nos: 'hiciésemos', vos: 'hicieseis', ellos: 'hiciesen' },
      imper_afirm: { tu: 'haz' },
      participio: 'hecho',
    }
  },
  { inf: 'decir', type: 'ir', group: 'irregular', level: 2, meaning: 'expresar con palabras', stemChange: { dual: ['e','i','i'] }, overrides: {
      pres_ind: { yo: 'digo' },
      pret_ind: { yo: 'dije', tu: 'dijiste', el: 'dijo', nos: 'dijimos', vos: 'dijisteis', ellos: 'dijeron' },
      fut_ind:  { yo: 'diré', tu: 'dirás', el: 'dirá', nos: 'diremos', vos: 'diréis', ellos: 'dirán' },
      cond:     { yo: 'diría', tu: 'dirías', el: 'diría', nos: 'diríamos', vos: 'diríais', ellos: 'dirían' },
      pres_sub: { yo: 'diga', tu: 'digas', el: 'diga', nos: 'digamos', vos: 'digáis', ellos: 'digan' },
      impf_sub_ra: { yo: 'dijera', tu: 'dijeras', el: 'dijera', nos: 'dijéramos', vos: 'dijerais', ellos: 'dijeran' },
      impf_sub_se: { yo: 'dijese', tu: 'dijeses', el: 'dijese', nos: 'dijésemos', vos: 'dijeseis', ellos: 'dijesen' },
      imper_afirm: { tu: 'di' },
      participio: 'dicho',
    }
  },
  { inf: 'venir', type: 'ir', group: 'irregular', level: 2, meaning: 'llegar; aproximarse', stemChange: { from: 'e', to: 'ie' }, overrides: {
      pres_ind: { yo: 'vengo' },
      pret_ind: { yo: 'vine', tu: 'viniste', el: 'vino', nos: 'vinimos', vos: 'vinisteis', ellos: 'vinieron' },
      fut_ind:  { yo: 'vendré', tu: 'vendrás', el: 'vendrá', nos: 'vendremos', vos: 'vendréis', ellos: 'vendrán' },
      cond:     { yo: 'vendría', tu: 'vendrías', el: 'vendría', nos: 'vendríamos', vos: 'vendríais', ellos: 'vendrían' },
      pres_sub: { yo: 'venga', tu: 'vengas', el: 'venga', nos: 'vengamos', vos: 'vengáis', ellos: 'vengan' },
      impf_sub_ra: { yo: 'viniera', tu: 'vinieras', el: 'viniera', nos: 'viniéramos', vos: 'vinierais', ellos: 'vinieran' },
      impf_sub_se: { yo: 'viniese', tu: 'vinieses', el: 'viniese', nos: 'viniésemos', vos: 'vinieseis', ellos: 'viniesen' },
      imper_afirm: { tu: 'ven' },
      gerundio: 'viniendo',
    }
  },
  { inf: 'poner', type: 'er', group: 'irregular', level: 2, meaning: 'colocar', overrides: {
      pres_ind: { yo: 'pongo' },
      pret_ind: { yo: 'puse', tu: 'pusiste', el: 'puso', nos: 'pusimos', vos: 'pusisteis', ellos: 'pusieron' },
      fut_ind:  { yo: 'pondré', tu: 'pondrás', el: 'pondrá', nos: 'pondremos', vos: 'pondréis', ellos: 'pondrán' },
      cond:     { yo: 'pondría', tu: 'pondrías', el: 'pondría', nos: 'pondríamos', vos: 'pondríais', ellos: 'pondrían' },
      pres_sub: { yo: 'ponga', tu: 'pongas', el: 'ponga', nos: 'pongamos', vos: 'pongáis', ellos: 'pongan' },
      impf_sub_ra: { yo: 'pusiera', tu: 'pusieras', el: 'pusiera', nos: 'pusiéramos', vos: 'pusierais', ellos: 'pusieran' },
      impf_sub_se: { yo: 'pusiese', tu: 'pusieses', el: 'pusiese', nos: 'pusiésemos', vos: 'pusieseis', ellos: 'pusiesen' },
      imper_afirm: { tu: 'pon' },
      participio: 'puesto',
    }
  },
  { inf: 'salir', type: 'ir', group: 'irregular', level: 2, meaning: 'partir; ir afuera', overrides: {
      pres_ind: { yo: 'salgo' },
      fut_ind:  { yo: 'saldré', tu: 'saldrás', el: 'saldrá', nos: 'saldremos', vos: 'saldréis', ellos: 'saldrán' },
      cond:     { yo: 'saldría', tu: 'saldrías', el: 'saldría', nos: 'saldríamos', vos: 'saldríais', ellos: 'saldrían' },
      pres_sub: { yo: 'salga', tu: 'salgas', el: 'salga', nos: 'salgamos', vos: 'salgáis', ellos: 'salgan' },
      imper_afirm: { tu: 'sal' },
    }
  },
  { inf: 'saber', type: 'er', group: 'irregular', level: 2, meaning: 'conocer una información', overrides: {
      pres_ind: { yo: 'sé' },
      pret_ind: { yo: 'supe', tu: 'supiste', el: 'supo', nos: 'supimos', vos: 'supisteis', ellos: 'supieron' },
      fut_ind:  { yo: 'sabré', tu: 'sabrás', el: 'sabrá', nos: 'sabremos', vos: 'sabréis', ellos: 'sabrán' },
      cond:     { yo: 'sabría', tu: 'sabrías', el: 'sabría', nos: 'sabríamos', vos: 'sabríais', ellos: 'sabrían' },
      pres_sub: { yo: 'sepa', tu: 'sepas', el: 'sepa', nos: 'sepamos', vos: 'sepáis', ellos: 'sepan' },
      impf_sub_ra: { yo: 'supiera', tu: 'supieras', el: 'supiera', nos: 'supiéramos', vos: 'supierais', ellos: 'supieran' },
      impf_sub_se: { yo: 'supiese', tu: 'supieses', el: 'supiese', nos: 'supiésemos', vos: 'supieseis', ellos: 'supiesen' },
    }
  },
  { inf: 'ver', type: 'er', group: 'irregular', level: 1, meaning: 'percibir con los ojos', overrides: {
      pres_ind: { yo: 'veo' },
      impf_ind: { yo: 'veía', tu: 'veías', el: 'veía', nos: 'veíamos', vos: 'veíais', ellos: 'veían' },
      pres_sub: { yo: 'vea', tu: 'veas', el: 'vea', nos: 'veamos', vos: 'veáis', ellos: 'vean' },
      participio: 'visto',
    }
  },
  { inf: 'dar', type: 'ar', group: 'irregular', level: 1, meaning: 'entregar', overrides: {
      pres_ind: { yo: 'doy' },
      pret_ind: { yo: 'di', tu: 'diste', el: 'dio', nos: 'dimos', vos: 'disteis', ellos: 'dieron' },
      pres_sub: { yo: 'dé', tu: 'des', el: 'dé', nos: 'demos', vos: 'deis', ellos: 'den' },
      impf_sub_ra: { yo: 'diera', tu: 'dieras', el: 'diera', nos: 'diéramos', vos: 'dierais', ellos: 'dieran' },
      impf_sub_se: { yo: 'diese', tu: 'dieses', el: 'diese', nos: 'diésemos', vos: 'dieseis', ellos: 'diesen' },
    }
  },
  { inf: 'conocer', type: 'er', group: 'irregular', level: 2, meaning: 'tener noción de algo', overrides: {
      pres_ind: { yo: 'conozco' },
      pres_sub: { yo: 'conozca', tu: 'conozcas', el: 'conozca', nos: 'conozcamos', vos: 'conozcáis', ellos: 'conozcan' },
    }
  },
  { inf: 'traer', type: 'er', group: 'irregular', level: 2, meaning: 'llevar hacia el hablante', overrides: {
      pres_ind: { yo: 'traigo' },
      pret_ind: { yo: 'traje', tu: 'trajiste', el: 'trajo', nos: 'trajimos', vos: 'trajisteis', ellos: 'trajeron' },
      pres_sub: { yo: 'traiga', tu: 'traigas', el: 'traiga', nos: 'traigamos', vos: 'traigáis', ellos: 'traigan' },
      impf_sub_ra: { yo: 'trajera', tu: 'trajeras', el: 'trajera', nos: 'trajéramos', vos: 'trajerais', ellos: 'trajeran' },
      impf_sub_se: { yo: 'trajese', tu: 'trajeses', el: 'trajese', nos: 'trajésemos', vos: 'trajeseis', ellos: 'trajesen' },
      gerundio: 'trayendo',
      participio: 'traído',
    }
  },
  { inf: 'oír', type: 'ir', group: 'irregular', level: 2, meaning: 'percibir sonidos', overrides: {
      pres_ind: { yo: 'oigo', tu: 'oyes', el: 'oye', nos: 'oímos', vos: 'oís', ellos: 'oyen' },
      pret_ind: { yo: 'oí', tu: 'oíste', el: 'oyó', nos: 'oímos', vos: 'oísteis', ellos: 'oyeron' },
      pres_sub: { yo: 'oiga', tu: 'oigas', el: 'oiga', nos: 'oigamos', vos: 'oigáis', ellos: 'oigan' },
      impf_sub_ra: { yo: 'oyera', tu: 'oyeras', el: 'oyera', nos: 'oyéramos', vos: 'oyerais', ellos: 'oyeran' },
      impf_sub_se: { yo: 'oyese', tu: 'oyeses', el: 'oyese', nos: 'oyésemos', vos: 'oyeseis', ellos: 'oyesen' },
      imper_afirm: { tu: 'oye' },
      gerundio: 'oyendo',
      participio: 'oído',
    }
  },
  { inf: 'haber', type: 'er', group: 'irregular', level: 3, meaning: 'auxiliar para tiempos compuestos', overrides: {
      pres_ind: { yo: 'he', tu: 'has', el: 'ha', nos: 'hemos', vos: 'habéis', ellos: 'han' },
      pret_ind: { yo: 'hube', tu: 'hubiste', el: 'hubo', nos: 'hubimos', vos: 'hubisteis', ellos: 'hubieron' },
      fut_ind:  { yo: 'habré', tu: 'habrás', el: 'habrá', nos: 'habremos', vos: 'habréis', ellos: 'habrán' },
      cond:     { yo: 'habría', tu: 'habrías', el: 'habría', nos: 'habríamos', vos: 'habríais', ellos: 'habrían' },
      pres_sub: { yo: 'haya', tu: 'hayas', el: 'haya', nos: 'hayamos', vos: 'hayáis', ellos: 'hayan' },
      impf_sub_ra: { yo: 'hubiera', tu: 'hubieras', el: 'hubiera', nos: 'hubiéramos', vos: 'hubierais', ellos: 'hubieran' },
      impf_sub_se: { yo: 'hubiese', tu: 'hubieses', el: 'hubiese', nos: 'hubiésemos', vos: 'hubieseis', ellos: 'hubiesen' },
    }
  },
];

const BY_INF = new Map(VERBS.map(v => [v.inf, v]));
export function getVerb(inf) { return BY_INF.get(inf); }
export function listVerbs(filter = {}) {
  return VERBS.filter(v => {
    if (filter.level && v.level > filter.level) return false;
    if (filter.groups && !filter.groups.has(v.group)) return false;
    return true;
  });
}
