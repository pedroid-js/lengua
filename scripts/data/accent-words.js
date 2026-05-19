// Word bank for accent exercises. Each entry has:
//  word     - the CORRECTLY-spelled Spanish word (with tilde if needed)
//  cls      - 'aguda' | 'llana' | 'esdrujula' | 'sobreesdrujula'
//  needs    - whether the word ends up bearing a tilde
//  level    - 1..3
//  rule     - short rule key for feedback: 'aguda-vns', 'aguda-otros', 'llana-vns', 'llana-otros', 'esdrujula', 'sobreesdrujula', 'hiato-tilde'
//  example  - optional usage example
//
// We curate the list so that every entry can be classified with our engine.

export const WORDS = [
  // ---- AGUDAS con tilde (terminan en vocal, n, s) ----
  { word: 'canción',  cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns', example: 'Cantamos una canción.' },
  { word: 'camión',   cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'jamás',    cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'café',     cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'sofá',     cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'comerás',  cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'cantaré',  cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'corazón',  cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'francés',  cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'también',  cls: 'aguda', needs: true, level: 2, rule: 'aguda-vns' },
  { word: 'razón',    cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'mamá',     cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'papá',     cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },
  { word: 'compás',   cls: 'aguda', needs: true, level: 2, rule: 'aguda-vns' },
  { word: 'avión',    cls: 'aguda', needs: true, level: 1, rule: 'aguda-vns' },

  // ---- AGUDAS sin tilde (terminan en consonante distinta de n, s) ----
  { word: 'reloj',    cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'ciudad',   cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'feliz',    cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'cantar',   cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'amor',     cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'pared',    cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'verdad',   cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'señor',    cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },
  { word: 'capaz',    cls: 'aguda', needs: false, level: 1, rule: 'aguda-otros' },

  // ---- LLANAS sin tilde (terminan en vocal, n, s) ----
  { word: 'mesa',     cls: 'llana', needs: false, level: 1, rule: 'llana-vns' },
  { word: 'libro',    cls: 'llana', needs: false, level: 1, rule: 'llana-vns' },
  { word: 'casa',     cls: 'llana', needs: false, level: 1, rule: 'llana-vns' },
  { word: 'piratas',  cls: 'llana', needs: false, level: 1, rule: 'llana-vns' },
  { word: 'examen',   cls: 'llana', needs: false, level: 2, rule: 'llana-vns' },
  { word: 'origen',   cls: 'llana', needs: false, level: 2, rule: 'llana-vns' },
  { word: 'joven',    cls: 'llana', needs: false, level: 1, rule: 'llana-vns' },
  { word: 'lunes',    cls: 'llana', needs: false, level: 1, rule: 'llana-vns' },
  { word: 'crisis',   cls: 'llana', needs: false, level: 2, rule: 'llana-vns' },
  { word: 'cantas',   cls: 'llana', needs: false, level: 1, rule: 'llana-vns' },
  { word: 'comían',   cls: 'llana', needs: true, level: 2, rule: 'hiato-tilde', example: 'Ellos comían pan.' },

  // ---- LLANAS con tilde (terminan en consonante distinta de n, s) ----
  { word: 'árbol',    cls: 'llana', needs: true, level: 1, rule: 'llana-otros' },
  { word: 'ángel',    cls: 'llana', needs: true, level: 1, rule: 'llana-otros' },
  { word: 'fácil',    cls: 'llana', needs: true, level: 1, rule: 'llana-otros' },
  { word: 'lápiz',    cls: 'llana', needs: true, level: 1, rule: 'llana-otros' },
  { word: 'cárcel',   cls: 'llana', needs: true, level: 1, rule: 'llana-otros' },
  { word: 'césped',   cls: 'llana', needs: true, level: 2, rule: 'llana-otros' },
  { word: 'huésped',  cls: 'llana', needs: true, level: 2, rule: 'llana-otros' },
  { word: 'álbum',    cls: 'llana', needs: true, level: 2, rule: 'llana-otros' },
  { word: 'mártir',   cls: 'llana', needs: true, level: 2, rule: 'llana-otros' },
  { word: 'azúcar',   cls: 'llana', needs: true, level: 2, rule: 'llana-otros' },

  // ---- ESDRÚJULAS ----
  { word: 'sábado',   cls: 'esdrujula', needs: true, level: 1, rule: 'esdrujula' },
  { word: 'música',   cls: 'esdrujula', needs: true, level: 1, rule: 'esdrujula' },
  { word: 'pájaro',   cls: 'esdrujula', needs: true, level: 1, rule: 'esdrujula' },
  { word: 'plátano',  cls: 'esdrujula', needs: true, level: 1, rule: 'esdrujula' },
  { word: 'América',  cls: 'esdrujula', needs: true, level: 1, rule: 'esdrujula' },
  { word: 'rápido',   cls: 'esdrujula', needs: true, level: 1, rule: 'esdrujula' },
  { word: 'helicóptero',cls: 'esdrujula', needs: true, level: 2, rule: 'esdrujula' },
  { word: 'matemáticas',cls: 'esdrujula', needs: true, level: 2, rule: 'esdrujula' },
  { word: 'gramática', cls: 'esdrujula', needs: true, level: 2, rule: 'esdrujula' },
  { word: 'lágrima',   cls: 'esdrujula', needs: true, level: 1, rule: 'esdrujula' },

  // ---- SOBREESDRÚJULAS ----
  { word: 'dígamelo',  cls: 'sobreesdrujula', needs: true, level: 3, rule: 'sobreesdrujula' },
  { word: 'cómpramelo',cls: 'sobreesdrujula', needs: true, level: 3, rule: 'sobreesdrujula' },
  { word: 'tráigamelas',cls:'sobreesdrujula', needs: true, level: 3, rule: 'sobreesdrujula' },

  // ---- HIATO con tilde sobre vocal débil ----
  { word: 'país',     cls: 'aguda',  needs: true, level: 2, rule: 'hiato-tilde', example: 'Mi país es bonito.' },
  { word: 'raíz',     cls: 'aguda',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'baúl',     cls: 'aguda',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'maíz',     cls: 'aguda',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'sonríe',   cls: 'llana',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'oído',     cls: 'llana',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'tío',      cls: 'llana',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'día',      cls: 'llana',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'frío',     cls: 'llana',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'María',    cls: 'llana',  needs: true, level: 2, rule: 'hiato-tilde' },
  { word: 'sabíamos', cls: 'esdrujula', needs: true, level: 3, rule: 'hiato-tilde' },
];

// Diacritic (tilde diacrítica) pairs.
// Each entry is a pair of words: tonic (with tilde) and atonic (without).
export const DIACRITIC = [
  {
    pair: ['sí','si'],
    senses: {
      sí: 'afirmación o pronombre reflexivo tónico',
      si: 'conjunción condicional o nota musical'
    },
    examples: {
      sí: 'Sí, claro que iré.',
      si: 'Si llueve, nos quedamos.'
    }
  },
  {
    pair: ['tú','tu'],
    senses: { tú: 'pronombre personal', tu: 'adjetivo posesivo' },
    examples: { tú: 'Tú lo sabes mejor.', tu: 'Tu barco es rápido.' }
  },
  {
    pair: ['él','el'],
    senses: { él: 'pronombre personal', el: 'artículo determinado' },
    examples: { él: 'Él es el capitán.', el: 'El sombrero es nuevo.' }
  },
  {
    pair: ['mí','mi'],
    senses: { mí: 'pronombre personal', mi: 'adjetivo posesivo o nota musical' },
    examples: { mí: 'Es para mí.', mi: 'Mi mapa está aquí.' }
  },
  {
    pair: ['sé','se'],
    senses: { sé: 'verbo saber/ser (imperativo)', se: 'pronombre' },
    examples: { sé: 'Sé que es verdad.', se: 'Se lo dije ayer.' }
  },
  {
    pair: ['dé','de'],
    senses: { dé: 'verbo dar (subjuntivo o imperativo)', de: 'preposición' },
    examples: { dé: 'Quiero que me dé un consejo.', de: 'La proa de la nave.' }
  },
  {
    pair: ['té','te'],
    senses: { té: 'sustantivo: bebida', te: 'pronombre' },
    examples: { té: 'Bebimos té con limón.', te: 'Te lo prometo.' }
  },
  {
    pair: ['más','mas'],
    senses: { más: 'adverbio de cantidad', mas: 'conjunción equivalente a "pero" (literario)' },
    examples: { más: 'Quiero más oro.', mas: 'Lo intentó, mas no pudo.' }
  },
  {
    pair: ['aún','aun'],
    senses: { aún: 'todavía', aun: 'incluso, ni siquiera' },
    examples: { aún: 'Aún no ha llegado.', aun: 'Ni aun así me convences.' }
  },
];

// Interrogatives / exclamatives: words bear tilde in direct or indirect questions.
export const INTERRO = [
  { word: 'qué', plain: 'que',
    examples: { tonic: '¿Qué hora es? · No sé qué decir.', plain: 'El barco que vimos.' }},
  { word: 'cómo', plain: 'como',
    examples: { tonic: '¿Cómo te llamas?', plain: 'Come como un Yonkō.' }},
  { word: 'cuándo', plain: 'cuando',
    examples: { tonic: '¿Cuándo zarpamos?', plain: 'Vendrá cuando pueda.' }},
  { word: 'dónde', plain: 'donde',
    examples: { tonic: '¿Dónde está el mapa?', plain: 'La isla donde vivimos.' }},
  { word: 'quién', plain: 'quien',
    examples: { tonic: '¿Quién llamó?', plain: 'Quien calla, otorga.' }},
  { word: 'cuánto', plain: 'cuanto',
    examples: { tonic: '¿Cuánto cuesta?', plain: 'Cuanto antes, mejor.' }},
  { word: 'cuál', plain: 'cual',
    examples: { tonic: '¿Cuál prefieres?', plain: 'El barco, el cual zarpó ayer.' }},
];
