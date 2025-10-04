import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveCardData, getCardData, type CardData } from '@/lib/firestore';

// Get card ID from environment variable or use default
const CARD_ID = process.env.NEXT_PUBLIC_CARD_ID || 'my-lovely-card';

interface CardStore {
  // Card ID
  cardId: string;
  
  // Card content
  greeting: {
    title: string;
    message: string;
    buttonText: string;
  };
  letter: {
    title: string;
    content: string;
  };
  slides: Array<{
    id: string;
    imageUrl: string;
    caption: string;
  }>;
  quiz: {
    title: string;
    passingScore: number;
    enableScoring: boolean;
    questions: Array<{
      id: string;
      question: string;
      hasCorrectAnswer: boolean;
      answers: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>;
    }>;
  };
  gifts: {
    pageTitle: string;
    prizes: Array<{
      id: string;
      title: string;
      message: string;
      imageUrl?: string;
    }>;
  };
  
  // Loading state
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  updateGreeting: (greeting: Partial<CardStore['greeting']>) => void;
  updateLetter: (letter: Partial<CardStore['letter']>) => void;
  updateSlides: (slides: CardStore['slides']) => void;
  updateQuiz: (quiz: Partial<CardStore['quiz']>) => void;
  updateGifts: (gifts: Partial<CardStore['gifts']>) => void;
  
  // Firebase sync
  saveToFirebase: () => Promise<void>;
  loadFromFirebase: () => Promise<void>;
}

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      cardId: CARD_ID,
      
      greeting: {
        title: 'Happy Birthday, Sayang Ebby! 🎉',
        message: 'Ebby create this website special for sayang.\nEbby have something beautiful to share with Sayang today...',
        buttonText: 'Open My Letter',
      },
      
      letter: {
        title: 'My Love Letter to You',
        content: `My Dearest Love,

This is a placeholder for your beautiful love letter. Here you can write all the romantic words, memories, and feelings you want to share with your special someone.

You can make text **bold** by selecting it and clicking the bold button, or *italic* by clicking the italic button.

The letter supports simple formatting to make your message even more special.

Forever yours,
**Your Name**`,
      },
      
      slides: [
        {
          id: '1',
          imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop',
          caption: 'Our first memory together ❤️'
        },
        {
          id: '2',
          imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop',
          caption: 'Every moment with you is **magical**'
        },
        {
          id: '3',
          imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&h=600&fit=crop',
          caption: 'You make my heart *flutter* 💕'
        }
      ],
      
      quiz: {
        title: 'How Well Do You Know Me? 💕',
        passingScore: 70,
        enableScoring: true,
        questions: [
          {
            id: '1',
            question: 'What is my **favorite color**?',
            hasCorrectAnswer: true,
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
            hasCorrectAnswer: true,
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
            hasCorrectAnswer: true,
            answers: [
              { id: 'a1', text: 'Paris 🗼', isCorrect: false },
              { id: 'a2', text: 'Tokyo 🗾', isCorrect: true },
              { id: 'a3', text: 'New York 🗽', isCorrect: false },
              { id: 'a4', text: 'London 🎡', isCorrect: false }
            ]
          }
        ],
      },
      
      gifts: {
        pageTitle: 'Choose Your Mystery Gift 🎁',
        prizes: [
          {
            id: '1',
            title: 'A Romantic Dinner',
            message: 'I\'m taking you to your **favorite restaurant** for a special dinner date! 🍽️✨\n\nGet ready for an *unforgettable evening* together.',
            imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
          },
          {
            id: '2',
            title: 'Weekend Getaway',
            message: 'Pack your bags! We\'re going on a **surprise weekend trip** to the beach! 🏖️🌊\n\n*Sun, sand, and us* - what could be better?',
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
          },
          {
            id: '3',
            title: 'Special Gift',
            message: 'I got you something **special** that I know you\'ve been wanting! 🎁💕\n\nIt\'s waiting for you at home with *all my love*.',
            imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=600&fit=crop'
          }
        ],
      },
      
      isLoading: false,
      isSaving: false,
      
      updateGreeting: (greeting) => {
        set((state) => ({
          greeting: { ...state.greeting, ...greeting },
        }));
      },
      
      updateLetter: (letter) => {
        set((state) => ({
          letter: { ...state.letter, ...letter },
        }));
      },
      
      updateSlides: (slides) => {
        set({ slides });
      },
      
      updateQuiz: (quiz) => {
        set((state) => ({
          quiz: { ...state.quiz, ...quiz },
        }));
      },
      
      updateGifts: (gifts) => {
        set((state) => ({
          gifts: { ...state.gifts, ...gifts },
        }));
      },
      
      saveToFirebase: async () => {
        const state = get();
        set({ isSaving: true });
        
        try {
          await saveCardData(state.cardId, {
            greeting: state.greeting,
            letter: state.letter,
            slides: state.slides,
            quiz: state.quiz,
            gifts: state.gifts,
          } as Partial<CardData>);
          
          console.log('Card data saved to Firebase successfully');
        } catch (error) {
          console.error('Error saving card data:', error);
          throw error;
        } finally {
          set({ isSaving: false });
        }
      },
      
      loadFromFirebase: async () => {
        const state = get();
        set({ isLoading: true });
        
        try {
          const cardData = await getCardData(state.cardId);
          
          if (cardData) {
            set({
              greeting: cardData.greeting,
              letter: cardData.letter,
              slides: cardData.slides,
              quiz: cardData.quiz,
              gifts: cardData.gifts,
            });
            console.log('Card data loaded from Firebase successfully');
          }
        } catch (error) {
          console.error('Error loading card data:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'lovely-card-content',
    }
  )
);
