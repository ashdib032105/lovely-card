'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Edit2, Save, Bold, Italic, Undo2, X, Plus, Trash2, Gift as GiftIcon, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import MusicPlayer from '@/components/MusicPlayer';
import SetupProgress from '@/components/SetupProgress';
import LinkGenerator from '@/components/LinkGenerator';
import CompletionBanner from '@/components/CompletionBanner';
import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSetupStore } from '@/store/setupStore';
import { validateGift } from '@/utils/setupValidation';
import { giftsConfig, PrizeConfig } from '@/config';

export default function GiftPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(null);
  const [revealedPrizeId, setRevealedPrizeId] = useState<string | null>(null);
  // Load gift config from static config
  const [pageTitle, setPageTitle] = useState(giftsConfig.title);
  const [editingPrizeId, setEditingPrizeId] = useState<string | null>(null);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  
  const { updateProgress, checkAllComplete } = useSetupStore();
  
  // Load prizes from static config
  const [prizes, setPrizes] = useState<PrizeConfig[]>(giftsConfig.prizes);
  
  const titleEditorRef = useRef<HTMLDivElement>(null);
  const messageEditorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPrize = prizes.find(p => p.id === selectedPrizeId);
  const revealedPrize = prizes.find(p => p.id === revealedPrizeId);

  // Handle box selection
  const handleBoxSelect = (prizeId: string) => {
    if (revealedPrizeId) return; // Already revealed
    
    setSelectedPrizeId(prizeId);
    
    // Animate and reveal after delay
    setTimeout(() => {
      setRevealedPrizeId(prizeId);
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
      
      // Multiple confetti bursts
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    }, 1000);
  };

  // Reset selection
  const handleReset = () => {
    setSelectedPrizeId(null);
    setRevealedPrizeId(null);
  };

  // Prize management functions
  const addNewPrize = () => {
    if (prizes.length >= 6) {
      alert('Maximum 6 mystery boxes!');
      return;
    }
    const newPrize: PrizeConfig = {
      id: Date.now().toString(),
      title: 'New Prize',
      message: 'Enter your prize message here...',
      imageUrl: ''
    };
    setPrizes([...prizes, newPrize]);
  };

  const deletePrize = (prizeId: string) => {
    if (prizes.length === 1) {
      alert('You must have at least one prize!');
      return;
    }
    setPrizes(prizes.filter(p => p.id !== prizeId));
    if (editingPrizeId === prizeId) {
      setEditingPrizeId(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, prizeId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPrizes = prizes.map(p => 
          p.id === prizeId ? { ...p, imageUrl: reader.result as string } : p
        );
        setPrizes(newPrizes);
      };
      reader.readAsDataURL(file);
    }
  };

  // WYSIWYG Editor functions
  const applyFormatting = (command: string) => {
    document.execCommand(command, false);
    messageEditorRef.current?.focus();
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
    if (isEditing && editingPrizeId) {
      // Save prize content
      if (titleEditorRef.current && messageEditorRef.current) {
        const title = getEditorContent(titleEditorRef.current);
        const message = getEditorContent(messageEditorRef.current);
        
        const newPrizes = prizes.map(p => 
          p.id === editingPrizeId ? { ...p, title, message } : p
        );
        setPrizes(newPrizes);
      }
    }
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditingPrizeId(null);
    }
  };

  // Initialize editor when editing a prize
  useEffect(() => {
    if (isEditing && editingPrizeId) {
      const prize = prizes.find(p => p.id === editingPrizeId);
      if (prize) {
        if (titleEditorRef.current) {
          setEditorContent(titleEditorRef.current, prize.title);
        }
        if (messageEditorRef.current) {
          setEditorContent(messageEditorRef.current, prize.message);
        }
      }
    }
  }, [isEditing, editingPrizeId]);

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
  }, [isEditing]);

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

  // Validate and update progress when prizes change
  useEffect(() => {
    const validation = validateGift(prizes);
    updateProgress('gift', validation.isValid);
  }, [prizes, updateProgress]);

  // Show completion banner when all sections are complete
  useEffect(() => {
    if (checkAllComplete() && isEditing) {
      setShowCompletionBanner(true);
    }
  }, [checkAllComplete, isEditing]);

  // Function to render markdown-like text
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      let formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
      
      return (
        <p 
          key={index} 
          className="text-gray-700 leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 relative overflow-hidden">
      {/* Music Player */}
      <MusicPlayer />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎁
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-5xl opacity-20"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-1/4 text-7xl opacity-20"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          💝
        </motion.div>
      </div>

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


      {/* Main Content */}
      <div className="max-w-6xl mx-auto pt-20 pb-12 relative z-10">
        {!revealedPrizeId ? (
          /* Mystery Boxes Selection */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Sparkles className="w-12 h-12 text-yellow-500" />
              </motion.div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="input input-bordered w-full max-w-2xl mx-auto text-3xl md:text-4xl font-bold text-center bg-transparent border-2 border-dashed border-pink-300 focus:border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4"
                  placeholder="Enter page title..."
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                  {pageTitle}
                </h1>
              )}
              
              <p className="text-gray-600 text-lg">
                {isEditing 
                  ? 'Click a box below to edit its prize content'
                  : 'Pick one box to reveal your special surprise! 🎉'
                }
              </p>
            </div>

            {/* Prize Management Toolbar (Edit Mode Only) */}
            {isEditing && (
              <div className="mb-8 text-center">
                <button
                  onClick={addNewPrize}
                  className="btn bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl gap-2"
                  disabled={prizes.length >= 6}
                >
                  <Plus className="w-5 h-5" />
                  Add Mystery Box
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  {prizes.length} / 6 boxes
                </p>
              </div>
            )}

            {/* Mystery Boxes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {prizes.map((prize, index) => (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {isEditing && (
                    <div className="absolute -top-3 -right-3 z-20 flex gap-2">
                      <button
                        onClick={() => deletePrize(prize.id)}
                        className="btn btn-sm btn-circle btn-error shadow-lg"
                        title="Delete prize"
                        disabled={prizes.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <motion.button
                    onClick={() => isEditing ? setEditingPrizeId(prize.id) : handleBoxSelect(prize.id)}
                    disabled={!isEditing && selectedPrizeId !== null && selectedPrizeId !== prize.id}
                    className={`w-full h-64 rounded-3xl shadow-2xl transition-all relative overflow-hidden ${
                      selectedPrizeId === prize.id
                        ? 'scale-105 ring-4 ring-purple-500'
                        : 'hover:scale-105'
                    } ${
                      !isEditing && selectedPrizeId !== null && selectedPrizeId !== prize.id
                        ? 'opacity-30 cursor-not-allowed'
                        : ''
                    } ${
                      editingPrizeId === prize.id
                        ? 'ring-4 ring-green-500'
                        : ''
                    }`}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Gift Box Design */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 opacity-90" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ 
                          rotate: selectedPrizeId === prize.id ? [0, -10, 10, -10, 0] : 0,
                          scale: selectedPrizeId === prize.id ? [1, 1.1, 1] : 1
                        }}
                        transition={{ 
                          duration: 0.5,
                          repeat: selectedPrizeId === prize.id ? Infinity : 0,
                          repeatDelay: 0.5
                        }}
                      >
                        <GiftIcon className="w-24 h-24 text-white mb-4" strokeWidth={1.5} />
                      </motion.div>
                      
                      <div className="text-white text-2xl font-bold">
                        Box {index + 1}
                      </div>
                      
                      {editingPrizeId === prize.id && (
                        <div className="mt-2 badge badge-success gap-2">
                          <Edit2 className="w-3 h-3" />
                          Editing
                        </div>
                      )}
                    </div>

                    {/* Sparkle Effects */}
                    <motion.div
                      className="absolute top-4 right-4 text-yellow-300 text-3xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.div>
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Prize Editor Modal (Edit Mode) */}
            <AnimatePresence>
              {isEditing && editingPrizeId && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    // Save before closing
                    if (titleEditorRef.current && messageEditorRef.current) {
                      const title = getEditorContent(titleEditorRef.current);
                      const message = getEditorContent(messageEditorRef.current);
                      
                      const newPrizes = prizes.map(p => 
                        p.id === editingPrizeId ? { ...p, title, message } : p
                      );
                      setPrizes(newPrizes);
                    }
                    setEditingPrizeId(null);
                  }}
                >
                  <motion.div
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Edit Prize Content</h2>
                      <button
                        onClick={() => {
                          // Save before closing
                          if (titleEditorRef.current && messageEditorRef.current) {
                            const title = getEditorContent(titleEditorRef.current);
                            const message = getEditorContent(messageEditorRef.current);
                            
                            const newPrizes = prizes.map(p => 
                              p.id === editingPrizeId ? { ...p, title, message } : p
                            );
                            setPrizes(newPrizes);
                          }
                          setEditingPrizeId(null);
                        }}
                        className="btn btn-circle btn-ghost"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prize Image</label>
                      {prizes.find(p => p.id === editingPrizeId)?.imageUrl ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
                          <img
                            src={prizes.find(p => p.id === editingPrizeId)?.imageUrl}
                            alt="Prize"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Upload className="w-8 h-8 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-video rounded-xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50 hover:bg-pink-100 transition-all flex flex-col items-center justify-center gap-3"
                        >
                          <ImageIcon className="w-12 h-12 text-pink-400" />
                          <span className="text-pink-600 font-medium">Upload Prize Image</span>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, editingPrizeId)}
                        className="hidden"
                      />
                    </div>

                    {/* Title Editor */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prize Title</label>
                      <div
                        ref={titleEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-xl font-bold text-gray-800"
                        style={{ whiteSpace: 'pre-wrap' }}
                      />
                    </div>

                    {/* Message Editor */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prize Message</label>
                      
                      {/* Formatting Toolbar */}
                      <div className="flex gap-1 bg-gray-100 rounded-lg p-1.5 mb-3">
                        <button
                          onClick={() => applyFormatting('bold')}
                          className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-3 hover:bg-pink-100"
                          title="Bold (Ctrl+B)"
                        >
                          <Bold className="w-4 h-4" />
                          <span className="text-xs font-semibold">Bold</span>
                        </button>
                        <button
                          onClick={() => applyFormatting('italic')}
                          className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-3 hover:bg-pink-100"
                          title="Italic (Ctrl+I)"
                        >
                          <Italic className="w-4 h-4" />
                          <span className="text-xs font-semibold">Italic</span>
                        </button>
                        <div className="divider divider-horizontal mx-0 my-1"></div>
                        <button
                          onClick={() => applyFormatting('undo')}
                          className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-3 hover:bg-pink-100"
                          title="Undo (Ctrl+Z)"
                        >
                          <Undo2 className="w-4 h-4" />
                          <span className="text-xs font-semibold">Undo</span>
                        </button>
                      </div>

                      <div
                        ref={messageEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700"
                        style={{ whiteSpace: 'pre-wrap' }}
                      />
                    </div>

                    <button
                      onClick={() => {
                        // Save before closing
                        if (titleEditorRef.current && messageEditorRef.current) {
                          const title = getEditorContent(titleEditorRef.current);
                          const message = getEditorContent(messageEditorRef.current);
                          
                          const newPrizes = prizes.map(p => 
                            p.id === editingPrizeId ? { ...p, title, message } : p
                          );
                          setPrizes(newPrizes);
                        }
                        setEditingPrizeId(null);
                      }}
                      className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl w-full"
                    >
                      <Save className="w-5 h-5" />
                      Save Prize
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Prize Reveal */
          <motion.div
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" fill="white" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4"
              >
                {revealedPrize?.title}
              </motion.h2>
            </div>

            {/* Prize Image */}
            {revealedPrize?.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={revealedPrize.imageUrl}
                    alt={revealedPrize.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Prize Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="prose prose-lg max-w-none mb-8"
            >
              {revealedPrize && renderFormattedText(revealedPrize.message)}
            </motion.div>

            {/* Back to Home Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex justify-center"
            >
              <Link href="/">
                <motion.button
                  className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl px-8 py-4 rounded-full flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-6 h-6" fill="white" />
                  <span className="text-lg font-semibold">Back to Home</span>
                </motion.button>
              </Link>
            </motion.div>
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
