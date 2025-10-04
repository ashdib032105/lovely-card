'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Edit2, Save, Bold, Italic, Undo2, X, Plus, Trash2, MoveUp, MoveDown, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import MusicPlayer from '@/components/MusicPlayer';
import SetupProgress from '@/components/SetupProgress';
import LinkGenerator from '@/components/LinkGenerator';
import CompletionBanner from '@/components/CompletionBanner';
import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSetupStore } from '@/store/setupStore';
import { validateQuiz } from '@/utils/setupValidation';
import { quizConfig, QuizAnswer, QuizQuestion } from '@/config';

// Type aliases for compatibility
type Answer = QuizAnswer;

interface Question extends QuizQuestion {
  hasCorrectAnswer: boolean; // If false, no validation (survey mode)
}

export default function QuizPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  // Load quiz from static config
  const [quizTitle, setQuizTitle] = useState(quizConfig.title);
  const [passingScore, setPassingScore] = useState(70); // Percentage required to pass
  const [enableScoring, setEnableScoring] = useState(true); // Global toggle for scoring
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  
  const { updateProgress, checkAllComplete } = useSetupStore();
  
  // Load questions from static config and add hasCorrectAnswer flag
  const [questions, setQuestions] = useState<Question[]>(
    quizConfig.questions.map(q => ({
      ...q,
      hasCorrectAnswer: q.answers.some(a => a.isCorrect)
    }))
  );
  
  const questionEditorRef = useRef<HTMLDivElement>(null);
  const answerEditorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Calculate score (only for questions with correct answers)
  const calculateScore = () => {
    let correctCount = 0;
    let scorableQuestions = 0;
    
    questions.forEach(q => {
      if (q.hasCorrectAnswer) {
        scorableQuestions++;
        const userAnswer = userAnswers[q.id];
        const correctAnswer = q.answers.find(a => a.isCorrect);
        if (userAnswer === correctAnswer?.id) {
          correctCount++;
        }
      }
    });
    
    return {
      correct: correctCount,
      total: scorableQuestions,
      percentage: scorableQuestions > 0 ? Math.round((correctCount / scorableQuestions) * 100) : 100
    };
  };

  // Check if quiz is passed
  const isPassed = () => {
    if (!enableScoring) return true; // Always pass if scoring is disabled
    const score = calculateScore();
    return score.percentage >= passingScore;
  };

  // Check if quiz has any scorable questions
  const hasScoringEnabled = () => {
    return enableScoring && questions.some(q => q.hasCorrectAnswer);
  };

  // Handle answer selection
  const handleAnswerSelect = (answerId: string) => {
    if (showResults) return;
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answerId
    });
  };

  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    const unansweredCount = questions.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      if (!confirm(`You have ${unansweredCount} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }
    setShowResults(true);
    
    // Trigger confetti if passed
    if (isPassed()) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  // Toggle question validation mode
  const toggleQuestionValidation = () => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].hasCorrectAnswer = !newQuestions[currentQuestionIndex].hasCorrectAnswer;
    
    // If disabling validation, clear all correct answers
    if (!newQuestions[currentQuestionIndex].hasCorrectAnswer) {
      newQuestions[currentQuestionIndex].answers = newQuestions[currentQuestionIndex].answers.map(a => ({
        ...a,
        isCorrect: false
      }));
    }
    
    setQuestions(newQuestions);
  };

  // Question management functions
  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: 'Enter your question here...',
      hasCorrectAnswer: true,
      answers: [
        { id: `${Date.now()}-a1`, text: 'Answer 1', isCorrect: true },
        { id: `${Date.now()}-a2`, text: 'Answer 2', isCorrect: false },
        { id: `${Date.now()}-a3`, text: 'Answer 3', isCorrect: false },
        { id: `${Date.now()}-a4`, text: 'Answer 4', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const deleteCurrentQuestion = () => {
    if (questions.length === 1) {
      alert('You must have at least one question!');
      return;
    }
    const newQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
    setQuestions(newQuestions);
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(newQuestions.length - 1);
    }
  };

  const moveQuestionUp = () => {
    if (currentQuestionIndex === 0) return;
    const newQuestions = [...questions];
    [newQuestions[currentQuestionIndex - 1], newQuestions[currentQuestionIndex]] = 
      [newQuestions[currentQuestionIndex], newQuestions[currentQuestionIndex - 1]];
    setQuestions(newQuestions);
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const moveQuestionDown = () => {
    if (currentQuestionIndex === questions.length - 1) return;
    const newQuestions = [...questions];
    [newQuestions[currentQuestionIndex], newQuestions[currentQuestionIndex + 1]] = 
      [newQuestions[currentQuestionIndex + 1], newQuestions[currentQuestionIndex]];
    setQuestions(newQuestions);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  // Answer management functions
  const addNewAnswer = () => {
    if (currentQuestion.answers.length >= 6) {
      alert('Maximum 6 answers per question!');
      return;
    }
    const newAnswer: Answer = {
      id: `${Date.now()}-a${currentQuestion.answers.length + 1}`,
      text: `Answer ${currentQuestion.answers.length + 1}`,
      isCorrect: false
    };
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].answers.push(newAnswer);
    setQuestions(newQuestions);
  };

  const deleteAnswer = (answerId: string) => {
    if (currentQuestion.answers.length <= 2) {
      alert('You must have at least 2 answers!');
      return;
    }
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].answers = currentQuestion.answers.filter(a => a.id !== answerId);
    setQuestions(newQuestions);
  };

  const toggleCorrectAnswer = (answerId: string) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].answers = currentQuestion.answers.map(a => ({
      ...a,
      isCorrect: a.id === answerId
    }));
    setQuestions(newQuestions);
  };

  // WYSIWYG Editor functions
  const applyFormatting = (command: string) => {
    document.execCommand(command, false);
    if (editingAnswerId) {
      answerEditorRefs.current[editingAnswerId]?.focus();
    } else {
      questionEditorRef.current?.focus();
    }
  };

  const getEditorContent = (ref: HTMLDivElement | null) => {
    if (!ref) return '';
    
    let html = ref.innerHTML;
    
    html = html.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    html = html.replace(/<b>(.*?)<\/b>/gi, '**$1**');
    html = html.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    html = html.replace(/<i>(.*?)<\/i>/gi, '*$1*');
    html = html.replace(/<div>/gi, '\n');
    html = html.replace(/<\/div>/gi, '');
    html = html.replace(/<p>/gi, '');
    html = html.replace(/<\/p>/gi, '\n');
    html = html.replace(/<br\s*\/?>/gi, '\n');
    html = html.replace(/<[^>]*>/g, '');
    
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value.trim();
  };

  const setEditorContent = (ref: HTMLDivElement | null, text: string) => {
    if (!ref) return;
    
    let html = text;
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.split('\n').map(line => `<div>${line || '<br>'}</div>`).join('');
    
    ref.innerHTML = html;
  };

  const handleSaveAndExit = () => {
    if (isEditing) {
      // Save question
      if (questionEditorRef.current) {
        const content = getEditorContent(questionEditorRef.current);
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].question = content;
        setQuestions(newQuestions);
      }
      
      // Save answers
      currentQuestion.answers.forEach(answer => {
        const ref = answerEditorRefs.current[answer.id];
        if (ref) {
          const content = getEditorContent(ref);
          const newQuestions = [...questions];
          const answerIndex = newQuestions[currentQuestionIndex].answers.findIndex(a => a.id === answer.id);
          if (answerIndex !== -1) {
            newQuestions[currentQuestionIndex].answers[answerIndex].text = content;
          }
          setQuestions(newQuestions);
        }
      });
    }
    setIsEditing(!isEditing);
    setEditingAnswerId(null);
  };

  // Initialize editor content when entering edit mode
  useEffect(() => {
    if (isEditing && currentQuestion) {
      if (questionEditorRef.current) {
        setEditorContent(questionEditorRef.current, currentQuestion.question);
      }
      currentQuestion.answers.forEach(answer => {
        const ref = answerEditorRefs.current[answer.id];
        if (ref) {
          setEditorContent(ref, answer.text);
        }
      });
    }
  }, [isEditing, currentQuestionIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b') {
          e.preventDefault();
          applyFormatting('bold');
        } else if (e.key === 'i') {
          e.preventDefault();
          applyFormatting('italic');
        } else if (e.key === 'z') {
          e.preventDefault();
          applyFormatting('undo');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, editingAnswerId]);

  // Auto-hide help banner
  useEffect(() => {
    if (isEditing && showHelpBanner) {
      const timer = setTimeout(() => {
        setShowHelpBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isEditing, showHelpBanner]);

  // Reset help banner when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setShowHelpBanner(true);
    }
  }, [isEditing]);

  // Validate and update progress when questions change
  useEffect(() => {
    const validation = validateQuiz(questions);
    updateProgress('quiz', validation.isValid);
  }, [questions, updateProgress]);

  // Show completion banner when all sections are complete
  useEffect(() => {
    if (checkAllComplete() && isEditing) {
      setShowCompletionBanner(true);
    }
  }, [checkAllComplete, isEditing]);

  // Function to render markdown-like text
  const renderFormattedText = (text: string) => {
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    return (
      <span dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  };

  // Get answer style based on state
  const getAnswerStyle = (answer: Answer) => {
    if (showResults && currentQuestion.hasCorrectAnswer) {
      const isSelected = userAnswers[currentQuestion.id] === answer.id;
      if (answer.isCorrect) {
        return 'border-green-500 bg-green-50 text-green-800';
      } else if (isSelected) {
        return 'border-red-500 bg-red-50 text-red-800';
      }
      return 'border-gray-300 bg-gray-50 text-gray-500';
    }
    
    const isSelected = userAnswers[currentQuestion.id] === answer.id;
    return isSelected 
      ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-lg' 
      : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 relative">
      {/* Music Player */}
      <MusicPlayer />

      {/* Back Button */}
      <motion.div
        className="fixed top-4 left-4 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link href="/slides">
          <button className="btn btn-circle btn-ghost bg-white bg-opacity-80 backdrop-blur-sm shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>

      {/* Edit Mode Toggle Button */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleSaveAndExit}
          className={`btn btn-circle ${isEditing ? 'btn-success' : 'btn-primary'} shadow-lg`}
          title={isEditing ? 'Save & Exit Edit Mode' : 'Enter Edit Mode'}
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Edit Mode Instructions */}
      <AnimatePresence>
        {isEditing && showHelpBanner && (
          <motion.div
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-2xl p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2">
              <Edit2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-semibold mb-1">💡 Quick Tip</p>
                <p className="text-xs opacity-90">
                  Edit questions & answers with formatting! Click text to edit. Shortcuts: Ctrl+B, Ctrl+I, Ctrl+Z
                </p>
              </div>
              <button
                onClick={() => setShowHelpBanner(false)}
                className="btn btn-ghost btn-xs btn-circle text-white hover:bg-white hover:bg-opacity-20 flex-shrink-0"
                aria-label="Close help banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-20 pb-12">
        {!showResults ? (
          <motion.div
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Edit Mode Indicator */}
            {isEditing && (
              <div className="absolute top-4 right-4 badge badge-success gap-2">
                <Edit2 className="w-3 h-3" />
                Edit Mode
              </div>
            )}

            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <HelpCircle className="w-10 h-10 text-purple-500" />
              </div>
              
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="input input-bordered w-full max-w-2xl mx-auto text-3xl md:text-4xl font-bold text-center bg-transparent border-2 border-dashed border-pink-300 focus:border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4"
                    placeholder="Enter quiz title..."
                  />
                  <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-600">Enable Scoring:</label>
                      <input
                        type="checkbox"
                        checked={enableScoring}
                        onChange={(e) => setEnableScoring(e.target.checked)}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                    </div>
                    {enableScoring && (
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-600">Passing Score:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={passingScore}
                          onChange={(e) => setPassingScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="input input-bordered input-sm w-20 text-center"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
                  {quizTitle}
                </h1>
              )}
              
              <p className="text-gray-500 italic">Test your knowledge about me! 🎯</p>
            </motion.div>

            {/* Question Management Toolbar (Edit Mode Only) */}
            {isEditing && (
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Question Controls</h3>
                <div className="flex flex-wrap gap-3 justify-center items-stretch">
                  <button
                    onClick={addNewQuestion}
                    className="flex flex-col items-center justify-center px-6 py-2 bg-pink-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800"
                    style={{ borderRadius: '50px' }}
                    title="Add New Question"
                  >
                    <Plus className="w-5 h-5 mb-0.5" />
                    <span className="text-sm font-medium">Add Question</span>
                  </button>

                  <button
                    onClick={deleteCurrentQuestion}
                    className="flex flex-col items-center justify-center px-6 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderRadius: '50px' }}
                    title="Delete Current Question"
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="w-5 h-5 mb-0.5" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>

                  <button
                    onClick={moveQuestionUp}
                    className="flex flex-col items-center justify-center px-6 py-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderRadius: '50px' }}
                    title="Move Question Up"
                    disabled={currentQuestionIndex === 0}
                  >
                    <MoveUp className="w-5 h-5 mb-0.5" />
                    <span className="text-sm font-medium">Move Up</span>
                  </button>

                  <button
                    onClick={moveQuestionDown}
                    className="flex flex-col items-center justify-center px-6 py-2 bg-purple-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderRadius: '50px' }}
                    title="Move Question Down"
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    <MoveDown className="w-5 h-5 mb-0.5" />
                    <span className="text-sm font-medium">Move Down</span>
                  </button>
                </div>
              </div>
            )}

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-500">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <button
                          onClick={toggleQuestionValidation}
                          className={`badge gap-2 cursor-pointer hover:brightness-95 transition-all ${
                            currentQuestion.hasCorrectAnswer
                              ? 'badge-primary'
                              : 'badge-neutral'
                          }`}
                          title={currentQuestion.hasCorrectAnswer ? 'Has correct answer (click to disable)' : 'Survey mode - no correct answer (click to enable)'}
                        >
                          {currentQuestion.hasCorrectAnswer ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Scored
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-3 h-3" />
                              Survey
                            </>
                          )}
                        </button>
                      )}
                      {!isEditing && userAnswers[currentQuestion.id] && (
                        <span className="badge badge-success gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          Answered
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="relative">
                      {/* Formatting Toolbar */}
                      <div className="absolute -top-2 right-0 z-10 flex gap-1 bg-white rounded-lg shadow-lg p-1.5 border border-gray-200">
                        <button
                          onClick={() => {
                            setEditingAnswerId(null);
                            applyFormatting('bold');
                          }}
                          className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-2 hover:bg-pink-100"
                          title="Bold (Ctrl+B)"
                        >
                          <Bold className="w-4 h-4" />
                          <span className="text-xs font-semibold hidden sm:inline">Bold</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingAnswerId(null);
                            applyFormatting('italic');
                          }}
                          className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-2 hover:bg-pink-100"
                          title="Italic (Ctrl+I)"
                        >
                          <Italic className="w-4 h-4" />
                          <span className="text-xs font-semibold hidden sm:inline">Italic</span>
                        </button>
                        <div className="divider divider-horizontal mx-0 my-1"></div>
                        <button
                          onClick={() => {
                            setEditingAnswerId(null);
                            applyFormatting('undo');
                          }}
                          className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-2 hover:bg-pink-100"
                          title="Undo (Ctrl+Z)"
                        >
                          <Undo2 className="w-4 h-4" />
                          <span className="text-xs font-semibold hidden sm:inline">Undo</span>
                        </button>
                      </div>

                      {/* Question Editor */}
                      <div
                        ref={questionEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onFocus={() => setEditingAnswerId(null)}
                        className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-2 border-dashed border-pink-300 focus:border-purple-500 focus:outline-none p-4 pt-16 rounded-lg bg-white"
                        style={{ whiteSpace: 'pre-wrap' }}
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                      {renderFormattedText(currentQuestion.question)}
                    </h2>
                  )}
                </div>

                {/* Answers */}
                <div className="space-y-4">
                  {currentQuestion.answers.map((answer, index) => (
                    <div key={answer.id} className="relative">
                      {isEditing ? (
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div
                              ref={(el) => {
                                answerEditorRefs.current[answer.id] = el;
                              }}
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setEditingAnswerId(answer.id)}
                              className={`w-full p-4 border-2 rounded-xl transition-all cursor-text ${
                                currentQuestion.hasCorrectAnswer && answer.isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-300 bg-white'
                              } focus:border-purple-500 focus:outline-none`}
                              style={{ whiteSpace: 'pre-wrap' }}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            {currentQuestion.hasCorrectAnswer && (
                              <button
                                onClick={() => toggleCorrectAnswer(answer.id)}
                                className={`btn btn-sm ${
                                  answer.isCorrect ? 'btn-success' : 'btn-ghost'
                                }`}
                                title="Mark as correct answer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteAnswer(answer.id)}
                              className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                              title="Delete answer"
                              disabled={currentQuestion.answers.length <= 2}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAnswerSelect(answer.id)}
                          disabled={showResults}
                          className={`w-full p-4 border-2 rounded-xl transition-all text-left ${getAnswerStyle(answer)}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">
                              {renderFormattedText(answer.text)}
                            </span>
                            {showResults && currentQuestion.hasCorrectAnswer && answer.isCorrect && (
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            )}
                            {showResults && currentQuestion.hasCorrectAnswer && !answer.isCorrect && userAnswers[currentQuestion.id] === answer.id && (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Answer Button (Edit Mode) */}
                  {isEditing && currentQuestion.answers.length < 6 && (
                    <button
                      onClick={addNewAnswer}
                      className="w-full p-4 border-2 border-dashed border-pink-300 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all text-pink-600 font-medium flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Answer Option
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!isEditing && (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-outline btn-primary"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="btn bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl"
                  >
                    Submit Quiz
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={goToNextQuestion}
                    className="btn btn-primary"
                  >
                    Next
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                )}
              </div>
            )}

            {/* Progress Indicator */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => !isEditing && setCurrentQuestionIndex(index)}
                  disabled={isEditing}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-purple-500 w-8'
                      : userAnswers[q.id]
                      ? 'bg-green-400'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* Results Screen */
          <motion.div
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                {!hasScoringEnabled() || isPassed() ? (
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-16 h-16 text-red-500" />
                  </div>
                )}
              </motion.div>

              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                {!hasScoringEnabled() || isPassed() ? 'Amazing! 🎉' : 'Nice Try! 💪'}
              </h2>

              {!hasScoringEnabled() ? (
                <>
                  <div className="mb-8">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                      100%
                    </div>
                    <p className="text-xl text-gray-600">
                      {questions.length} out of {questions.length} correct
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Passing score: {passingScore}%
                    </p>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
                    <p className="text-lg text-green-800 font-medium">
                      You know me so well! 💕 You've unlocked the mystery gift section!
                    </p>
                  </div>
                </>
              ) : hasScoringEnabled() ? (
                <>
                  <div className="mb-8">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                      {calculateScore().percentage}%
                    </div>
                    <p className="text-xl text-gray-600">
                      {calculateScore().correct} out of {calculateScore().total} correct
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Passing score: {passingScore}%
                    </p>
                  </div>

                  {isPassed() ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
                      <p className="text-lg text-green-800 font-medium">
                        You know me so well! 💕 You've unlocked the mystery gift section!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                      <p className="text-lg text-red-800 font-medium">
                        Don't worry! You can try again to unlock the mystery gift. 🎁
                      </p>
                    </div>
                  )}
                </>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleResetQuiz}
                  className="btn btn-outline btn-primary btn-lg"
                >
                  Try Again
                </button>
                {isPassed() && (
                  <Link href="/gift">
                    <motion.button
                      className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Claim Your Prize</span>
                      <Heart className="w-5 h-5" fill="white" />
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Setup Progress Widget (only in edit mode) */}
      {isEditing && (
        <SetupProgress onGenerateLinkClick={() => setShowLinkGenerator(true)} />
      )}

      {/* Completion Banner */}
      <CompletionBanner
        isVisible={showCompletionBanner}
        onGenerateLinkClick={() => {
          setShowCompletionBanner(false);
          setShowLinkGenerator(true);
        }}
        onDismiss={() => setShowCompletionBanner(false)}
      />

      {/* Link Generator Modal */}
      <LinkGenerator
        isOpen={showLinkGenerator}
        onClose={() => setShowLinkGenerator(false)}
      />
    </div>
  );
}
