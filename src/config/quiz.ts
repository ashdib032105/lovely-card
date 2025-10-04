// ❓ QUIZ CONFIGURATION

export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string; // Supports **bold** and *italic*
  answers: QuizAnswer[];
}

export interface QuizConfig {
  title: string;
  questions: QuizQuestion[];
}

export const quizConfig: QuizConfig = {
  title: 'How Well Do You Know Me? 💕',
  questions: [
    {
      id: '1',
      question: 'What is my **favorite color**?',
      answers: [
        { id: 'a1', text: 'Blue 💙', isCorrect: false },
        { id: 'a2', text: 'Pink 💗', isCorrect: true },
        { id: 'a3', text: 'Green 💚', isCorrect: false },
        { id: 'a4', text: 'Purple 💜', isCorrect: false }
      ]
    },
    {
      id: '2',
      question: 'Where did we have our *first date*?',
      answers: [
        { id: 'a1', text: 'Coffee Shop ☕', isCorrect: true },
        { id: 'a2', text: 'Restaurant 🍽️', isCorrect: false },
        { id: 'a3', text: 'Park 🌳', isCorrect: false },
        { id: 'a4', text: 'Cinema 🎬', isCorrect: false }
      ]
    },
    {
      id: '3',
      question: 'What is my **dream destination**?',
      answers: [
        { id: 'a1', text: 'Paris 🗼', isCorrect: false },
        { id: 'a2', text: 'Tokyo 🗾', isCorrect: true },
        { id: 'a3', text: 'New York 🗽', isCorrect: false },
        { id: 'a4', text: 'London 🎡', isCorrect: false }
      ]
    }
  ]
};

// 📝 HOW TO EDIT:
// 1. Change the title above
// 2. Edit existing questions and answers
// 3. Mark the correct answer with isCorrect: true
// 4. To add more questions, copy a question object and paste below
// 5. Use **text** for bold, *text* for italic in questions
