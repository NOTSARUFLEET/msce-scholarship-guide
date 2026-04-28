/*
  GlobalQuestionBank generator for Scholarship Titan 2026.
  The subject map follows the official MSCE scholarship exam structure published by
  Maharashtra State Council of Examination, Pune: scholarship language, mathematics,
  English and intelligence-test sections. The exact 2017-2026 yearly papers are not
  reproduced verbatim here; instead this script generates original bilingual items
  aligned to those syllabus domains and weightage buckets.
*/

const CHAPTERS = {
  paper1Language: [
    'Grammar',
    'Vocabulary',
    'Synonyms',
    'Antonyms',
    'Idioms',
    'Reading Comprehension',
    'Sentence Structure',
  ],
  mathematics: [
    'Number System',
    'Fractions',
    'Decimals',
    'Percentage',
    'Profit and Loss',
    'Ratio and Proportion',
    'Simple Interest',
    'Algebra',
    'Geometry',
    'Mensuration',
    'Data Handling',
  ],
  paper2Language: [
    'Grammar',
    'Vocabulary',
    'Articles',
    'Tenses',
    'Comprehension',
    'Sentence Completion',
    'Prepositions',
  ],
  intelligence: [
    'Number Series',
    'Analogy',
    'Classification',
    'Coding-Decoding',
    'Direction Sense',
    'Blood Relations',
    'Pattern Logic',
    'Calendar',
    'Clock',
    'Venn Logic',
  ],
};

const MARATHI_NUMBERS = ['एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ', 'दहा'];

function option(id, en, mr) {
  return { id, en: String(en), mr: String(mr) };
}

function bilingual(en, mr) {
  return { en, mr };
}

function difficultyFromIndex(index) {
  if (index % 5 === 0) return 'hard';
  if (index % 2 === 0) return 'medium';
  return 'easy';
}

function createMathQuestion(testNo, index) {
  const a = 6 + ((testNo + index) % 17);
  const b = 3 + ((testNo * 2 + index) % 9);
  const c = a * b;
  const templates = [
    () => ({
      chapter: CHAPTERS.mathematics[index % CHAPTERS.mathematics.length],
      question: bilingual(
        `Find the value of ${a} x ${b}.`,
        `${a} x ${b} याची किंमत शोधा.`
      ),
      formula: `${a}\\times ${b}`,
      options: [
        option('a', c - b, c - b),
        option('b', c, c),
        option('c', c + a, c + a),
        option('d', c + b, c + b),
      ],
      correctOptionId: 'b',
      hiddenExplanation: bilingual(
        `Multiply ${a} by ${b}. The answer is ${c}.`,
        `${a} ला ${b} ने गुणा केल्यावर उत्तर ${c} येते.`
      ),
    }),
    () => {
      const total = a + b;
      return {
        chapter: 'Algebra',
        question: bilingual(
          `If x + ${b} = ${total}, what is x?`,
          `जर x + ${b} = ${total} असेल, तर x किती?`
        ),
        formula: `x+${b}=${total}`,
        options: [
          option('a', a - 1, a - 1),
          option('b', a, a),
          option('c', a + 1, a + 1),
          option('d', b, b),
        ],
        correctOptionId: 'b',
        hiddenExplanation: bilingual(
          `Subtract ${b} from ${total}. So x = ${a}.`,
          `${total} मधून ${b} वजा करा. म्हणून x = ${a}.`
        ),
      };
    },
    () => {
      const percent = 10 + ((testNo + index) % 6) * 5;
      const base = 100 + a * 10;
      const answer = (percent * base) / 100;
      return {
        chapter: 'Percentage',
        question: bilingual(
          `What is ${percent}% of ${base}?`,
          `${base} चे ${percent}% किती?`
        ),
        formula: `\\frac{${percent}}{100}\\times ${base}`,
        options: [
          option('a', answer - 5, answer - 5),
          option('b', answer, answer),
          option('c', answer + 5, answer + 5),
          option('d', answer + 10, answer + 10),
        ],
        correctOptionId: 'b',
        hiddenExplanation: bilingual(
          `${percent}% of ${base} is (${percent}/100) x ${base} = ${answer}.`,
          `${base} चे ${percent}% = (${percent}/100) x ${base} = ${answer}.`
        ),
      };
    },
    () => {
      const perimeter = 2 * (a + b);
      return {
        chapter: 'Geometry',
        question: bilingual(
          `A rectangle has length ${a} cm and breadth ${b} cm. Find its perimeter.`,
          `एका आयताची लांबी ${a} सेमी व रुंदी ${b} सेमी आहे. त्याचा परिमिती शोधा.`
        ),
        formula: `2(${a}+${b})`,
        options: [
          option('a', perimeter - 2, perimeter - 2),
          option('b', perimeter, perimeter),
          option('c', perimeter + 2, perimeter + 2),
          option('d', a * b, a * b),
        ],
        correctOptionId: 'b',
        hiddenExplanation: bilingual(
          `Perimeter of a rectangle = 2 x (length + breadth) = ${perimeter}.`,
          `आयताचा परिमिती = 2 x (लांबी + रुंदी) = ${perimeter}.`
        ),
      };
    },
  ];

  const selected = templates[index % templates.length]();
  return {
    id: `paper1-math-${testNo}-${index + 1}`,
    grade: testNo % 2 === 0 ? 7 : 4,
    paper: 'paper1',
    subject: 'mathematics',
    marks: 2,
    difficulty: difficultyFromIndex(index),
    ...selected,
  };
}

function createMarathiQuestion(testNo, index) {
  const word = MARATHI_NUMBERS[index % MARATHI_NUMBERS.length];
  const englishWord = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][index % 10];
  const isSynonym = index % 2 === 0;

  return {
    id: `paper1-marathi-${testNo}-${index + 1}`,
    grade: testNo % 2 === 0 ? 7 : 4,
    paper: 'paper1',
    subject: 'marathi',
    chapter: CHAPTERS.paper1Language[index % CHAPTERS.paper1Language.length],
    marks: 2,
    difficulty: difficultyFromIndex(index),
    question: isSynonym
      ? bilingual(
          `Choose the correct Marathi meaning of "${englishWord}".`,
          `"${englishWord}" या शब्दाचा योग्य मराठी अर्थ निवडा.`
        )
      : bilingual(
          `Choose the correct antonym of "${word}".`,
          `"${word}" या शब्दाचा विरुद्धार्थी शब्द निवडा.`
        ),
    options: isSynonym
      ? [
          option('a', 'flower', 'फूल'),
          option('b', word, word),
          option('c', 'river', 'नदी'),
          option('d', 'school', 'शाळा'),
        ]
      : [
          option('a', 'मोठा', 'मोठा'),
          option('b', 'लहान', 'लहान'),
          option('c', 'जलद', 'जलद'),
          option('d', 'उजेड', 'उजेड'),
        ],
    correctOptionId: isSynonym ? 'b' : 'b',
    hiddenExplanation: isSynonym
      ? bilingual(
          `The correct Marathi meaning of "${englishWord}" in this item is "${word}".`,
          `या प्रश्नात "${englishWord}" या शब्दाचा योग्य मराठी अर्थ "${word}" आहे.`
        )
      : bilingual(
          `"${word}" साठी दिलेल्या पर्यायांमध्ये विरुद्धार्थी रूप "लहान" घेतले आहे.`,
          `"${word}" साठी दिलेल्या पर्यायांमध्ये विरुद्धार्थी रूप "लहान" घेतले आहे.`
        ),
  };
}

function createEnglishQuestion(testNo, index) {
  const subject = ['cat', 'boy', 'girl', 'teacher', 'farmer'][index % 5];
  const verb = ['runs', 'writes', 'reads', 'jumps', 'plays'][index % 5];

  return {
    id: `paper2-english-${testNo}-${index + 1}`,
    grade: testNo % 2 === 0 ? 7 : 4,
    paper: 'paper2',
    subject: 'english',
    chapter: CHAPTERS.paper2Language[index % CHAPTERS.paper2Language.length],
    marks: 2,
    difficulty: difficultyFromIndex(index),
    question: bilingual(
      `Choose the correct sentence.`,
      `योग्य इंग्रजी वाक्य निवडा.`
    ),
    options: [
      option('a', `The ${subject} ${verb}.`, `The ${subject} ${verb}.`),
      option('b', `The ${subject} ${verb} fastly.`, `The ${subject} ${verb} fastly.`),
      option('c', `The ${subject} are ${verb}.`, `The ${subject} are ${verb}.`),
      option('d', `The ${subject} do ${verb}.`, `The ${subject} do ${verb}.`),
    ],
    correctOptionId: 'a',
    hiddenExplanation: bilingual(
      `Option A is the grammatically correct simple-present sentence.`,
      `A पर्याय साध्या वर्तमानकाळातील व्याकरणदृष्ट्या योग्य वाक्य आहे.`
    ),
  };
}

function createIqQuestion(testNo, index) {
  const start = 2 + ((testNo + index) % 6);
  const step = 2 + (index % 4);
  const next = start + step * 4;
  const codeBase = ['CAT', 'SUN', 'MAP', 'DOG'][index % 4];
  const codeAnswer = codeBase
    .split('')
    .map((letter) => String.fromCharCode(letter.charCodeAt(0) + 1))
    .join('');

  const templates = [
    () => ({
      chapter: 'Number Series',
      question: bilingual(
        `Find the next number: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, __`,
        `पुढील संख्या शोधा: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, __`
      ),
      options: [
        option('a', next - 1, next - 1),
        option('b', next, next),
        option('c', next + 1, next + 1),
        option('d', next + 2, next + 2),
      ],
      correctOptionId: 'b',
      hiddenExplanation: bilingual(
        `The pattern increases by ${step} each time, so the next number is ${next}.`,
        `प्रत्येक वेळी ${step} ने वाढ होत आहे, म्हणून पुढील संख्या ${next} आहे.`
      ),
    }),
    () => ({
      chapter: 'Coding-Decoding',
      question: bilingual(
        `If ${codeBase} is coded by moving every letter one step forward, what is the code?`,
        `जर ${codeBase} या शब्दातील प्रत्येक अक्षर एक पाऊल पुढे नेले, तर सांकेतिक रूप काय होईल?`
      ),
      options: [
        option('a', codeAnswer, codeAnswer),
        option('b', `${codeAnswer}A`, `${codeAnswer}A`),
        option('c', codeBase, codeBase),
        option('d', codeBase.split('').reverse().join(''), codeBase.split('').reverse().join('')),
      ],
      correctOptionId: 'a',
      hiddenExplanation: bilingual(
        `Each letter shifts by one alphabet position, giving ${codeAnswer}.`,
        `प्रत्येक अक्षर वर्णमालेत एक स्थान पुढे सरकते, त्यामुळे ${codeAnswer} मिळते.`
      ),
    }),
    () => ({
      chapter: 'Analogy',
      question: bilingual(
        `Book : Read :: Food : ?`,
        `पुस्तक : वाचणे :: अन्न : ?`
      ),
      options: [
        option('a', 'Cook', 'शिजवणे'),
        option('b', 'Eat', 'खाणे'),
        option('c', 'Jump', 'उडी मारणे'),
        option('d', 'Sleep', 'झोपणे'),
      ],
      correctOptionId: 'b',
      hiddenExplanation: bilingual(
        `A book is read, and food is eaten.`,
        `पुस्तक वाचले जाते आणि अन्न खाल्ले जाते.`
      ),
    }),
    () => ({
      chapter: 'Blood Relations',
      question: bilingual(
        `Asha says, "He is my mother's brother." Who is he to Asha?`,
        `आशा म्हणते, "तो माझ्या आईचा भाऊ आहे." तो आशाचा कोण लागतो?`
      ),
      options: [
        option('a', 'Brother', 'भाऊ'),
        option('b', 'Uncle', 'मामा'),
        option('c', 'Cousin', 'चुलत भाऊ'),
        option('d', 'Grandfather', 'आजोबा'),
      ],
      correctOptionId: 'b',
      hiddenExplanation: bilingual(
        `Mother's brother is the maternal uncle.`,
        `आईचा भाऊ म्हणजे मामा.`
      ),
    }),
  ];

  return {
    id: `paper2-iq-${testNo}-${index + 1}`,
    grade: testNo % 2 === 0 ? 7 : 4,
    paper: 'paper2',
    subject: 'intelligence',
    marks: 2,
    difficulty: difficultyFromIndex(index),
    ...templates[index % templates.length](),
  };
}

function createPaperTest(testNo, paper) {
  const title =
    paper === 'paper1'
      ? bilingual(`Paper 1 Mock Test ${testNo}`, `पेपर १ मॉक टेस्ट ${testNo}`)
      : bilingual(`Paper 2 Mock Test ${testNo}`, `पेपर २ मॉक टेस्ट ${testNo}`);

  const questions =
    paper === 'paper1'
      ? [
          ...Array.from({ length: 25 }, (_, index) => createMarathiQuestion(testNo, index)),
          ...Array.from({ length: 50 }, (_, index) => createMathQuestion(testNo, index)),
        ]
      : [
          ...Array.from({ length: 25 }, (_, index) => createEnglishQuestion(testNo, index)),
          ...Array.from({ length: 50 }, (_, index) => createIqQuestion(testNo, index)),
        ];

  return {
    id: `${paper}-mock-${testNo}`,
    title,
    grade: testNo % 2 === 0 ? 7 : 4,
    paper,
    durationMinutes: 90,
    totalQuestions: 75,
    totalMarks: 100,
    questionDistribution:
      paper === 'paper1'
        ? { marathi: 25, mathematics: 50 }
        : { english: 25, intelligence: 50 },
    questions,
  };
}

export function generateGlobalQuestionBank() {
  return {
    generatedAt: new Date().toISOString(),
    version: '2026.1',
    sourceNote:
      'Original bilingual items generated from syllabus-aligned templates for MSCE scholarship preparation.',
    papers: {
      paper1: Array.from({ length: 20 }, (_, index) => createPaperTest(index + 1, 'paper1')),
      paper2: Array.from({ length: 20 }, (_, index) => createPaperTest(index + 1, 'paper2')),
    },
  };
}

export const GLOBAL_QUESTION_BANK = generateGlobalQuestionBank();
