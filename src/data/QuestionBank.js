const QuestionBank = [
  {
    id: 1,
    subject: 'math',
    question: {
      en: 'Solve: $$\\frac{3}{4} + \\frac{1}{2}$$',
      mr: 'सोडवा: $$\\frac{3}{4} + \\frac{1}{2}$$',
    },
    options: [
      { id: 'a', en: '$$\\frac{5}{4}$$', mr: '$$\\frac{5}{4}$$', isCorrect: true },
      { id: 'b', en: '$$\\frac{4}{6}$$', mr: '$$\\frac{4}{6}$$', isCorrect: false },
      { id: 'c', en: '$$\\frac{7}{8}$$', mr: '$$\\frac{7}{8}$$', isCorrect: false },
      { id: 'd', en: '$$\\frac{3}{2}$$', mr: '$$\\frac{3}{2}$$', isCorrect: false },
    ],
  },
  {
    id: 2,
    subject: 'math',
    question: {
      en: 'Solve: $$2x + 5 = 15$$',
      mr: 'सोडवा: $$2x + 5 = 15$$',
    },
    options: [
      { id: 'a', en: '$$x = 10$$', mr: '$$x = 10$$', isCorrect: false },
      { id: 'b', en: '$$x = 5$$', mr: '$$x = 5$$', isCorrect: true },
      { id: 'c', en: '$$x = 15$$', mr: '$$x = 15$$', isCorrect: false },
      { id: 'd', en: '$$x = 20$$', mr: '$$x = 20$$', isCorrect: false },
    ],
  },
  {
    id: 3,
    subject: 'iq',
    question: {
      en: 'Find the next term: $$3, 6, 12, 24, \\_\\_$$',
      mr: 'पुढील पद शोधा: $$3, 6, 12, 24, \\_\\_$$',
    },
    options: [
      { id: 'a', en: '$$30$$', mr: '$$30$$', isCorrect: false },
      { id: 'b', en: '$$36$$', mr: '$$36$$', isCorrect: false },
      { id: 'c', en: '$$48$$', mr: '$$48$$', isCorrect: true },
      { id: 'd', en: '$$54$$', mr: '$$54$$', isCorrect: false },
    ],
  },
];

export default QuestionBank;
