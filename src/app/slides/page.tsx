'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Edit2, Save, Bold, Italic, Undo2, X, ChevronLeft, ChevronRight, Plus, Trash2, Upload, Image as ImageIcon, MoveUp, MoveDown } from 'lucide-react';
import Link from 'next/link';
import MusicPlayer from '@/components/MusicPlayer';
import SetupProgress from '@/components/SetupProgress';
import LinkGenerator from '@/components/LinkGenerator';
import CompletionBanner from '@/components/CompletionBanner';
import { useState, useRef, useEffect } from 'react';
import { useSetupStore } from '@/store/setupStore';
import { validateSlides } from '@/utils/setupValidation';
import { slidesConfig, SlideConfig } from '@/config';

export default function SlidesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  
  const { updateProgress, checkAllComplete } = useSetupStore();
  
  // Load slides from static config
  const [slides, setSlides] = useState<SlideConfig[]>(slidesConfig);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSlide = slides[currentSlideIndex];

  // Navigation functions
  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Slide management functions
  const addNewSlide = () => {
    const newSlide: SlideConfig = {
      id: Date.now().toString(),
      imageUrl: '',
      caption: 'Add your caption here...'
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const deleteCurrentSlide = () => {
    if (slides.length === 1) {
      alert('You must have at least one slide!');
      return;
    }
    const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
  };

  const moveSlideUp = () => {
    if (currentSlideIndex === 0) return;
    const newSlides = [...slides];
    [newSlides[currentSlideIndex - 1], newSlides[currentSlideIndex]] = 
      [newSlides[currentSlideIndex], newSlides[currentSlideIndex - 1]];
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex - 1);
  };

  const moveSlideDown = () => {
    if (currentSlideIndex === slides.length - 1) return;
    const newSlides = [...slides];
    [newSlides[currentSlideIndex], newSlides[currentSlideIndex + 1]] = 
      [newSlides[currentSlideIndex + 1], newSlides[currentSlideIndex]];
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSlides = [...slides];
        newSlides[currentSlideIndex].imageUrl = reader.result as string;
        setSlides(newSlides);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to apply formatting to selected text
  const applyFormatting = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  // Function to get content from contentEditable div
  const getEditorContent = () => {
    if (!editorRef.current) return '';
    
    let html = editorRef.current.innerHTML;
    
    // Replace <strong> or <b> with **text**
    html = html.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    html = html.replace(/<b>(.*?)<\/b>/gi, '**$1**');
    
    // Replace <em> or <i> with *text*
    html = html.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    html = html.replace(/<i>(.*?)<\/i>/gi, '*$1*');
    
    // Replace <div> and <p> with newlines
    html = html.replace(/<div>/gi, '\n');
    html = html.replace(/<\/div>/gi, '');
    html = html.replace(/<p>/gi, '');
    html = html.replace(/<\/p>/gi, '\n');
    html = html.replace(/<br\s*\/?>/gi, '\n');
    
    // Remove any remaining HTML tags
    html = html.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value.trim();
  };

  // Function to set content in contentEditable div
  const setEditorContent = (text: string) => {
    if (!editorRef.current) return;
    
    let html = text;
    
    // Replace **text** with <strong>text</strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *text* with <em>text</em>
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Replace newlines with <div> for contentEditable
    html = html.split('\n').map(line => `<div>${line || '<br>'}</div>`).join('');
    
    editorRef.current.innerHTML = html;
  };

  // Save caption when exiting edit mode
  const handleSaveAndExit = () => {
    if (isEditing && editorRef.current) {
      const content = getEditorContent();
      const newSlides = [...slides];
      newSlides[currentSlideIndex].caption = content;
      setSlides(newSlides);
    }
    setIsEditing(!isEditing);
  };

  // Initialize editor content when entering edit mode
  useEffect(() => {
    if (isEditing && editorRef.current && currentSlide) {
      setEditorContent(currentSlide.caption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, currentSlideIndex]);

  // Add keyboard shortcuts
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

  // Auto-hide help banner after 5 seconds
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

  // Function to render markdown-like text
  const renderFormattedText = (text: string) => {
    // Replace **text** with <strong>text</strong>
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with <em>text</em>
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    return (
      <p 
        className="text-gray-800 text-xl md:text-2xl leading-relaxed text-center"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  };

  // Keyboard navigation for slides
  useEffect(() => {
    if (isEditing) return; // Disable navigation in edit mode

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length, isEditing]);

  // Validate and update progress when slides change
  useEffect(() => {
    const validation = validateSlides(slides);
    updateProgress('slides', validation.isValid);
  }, [slides, updateProgress]);

  // Show completion banner when all sections are complete
  useEffect(() => {
    if (checkAllComplete() && isEditing) {
      setShowCompletionBanner(true);
    }
  }, [checkAllComplete, isEditing]);

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
        <Link href="/letter">
          <button className="btn btn-circle btn-ghost bg-white bg-opacity-80 backdrop-blur-sm shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>


      {/* Main Slide Content */}
      <div className="max-w-6xl mx-auto pt-20 pb-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            className="w-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 relative">
              {/* Edit Mode Indicator */}
              {isEditing && (
                <div className="absolute top-4 right-4 badge badge-success gap-2">
                  <Edit2 className="w-3 h-3" />
                  Edit Mode
                </div>
              )}

              {/* Slide Management Toolbar (Edit Mode Only) */}
              {isEditing && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Slide Controls</h3>
                  <div className="flex flex-wrap gap-3 justify-center items-stretch">
                    {/* Add Slide Button */}
                    <button
                      onClick={addNewSlide}
                      className="flex flex-col items-center justify-center px-6 py-2 bg-pink-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800"
                      style={{ borderRadius: '50px' }}
                      title="Add New Slide"
                    >
                      <Plus className="w-5 h-5 mb-0.5" />
                      <span className="text-sm font-medium">Add Slide</span>
                    </button>

                    {/* Change Image Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-opacity-30 hover:bg-opacity-50 active:bg-opacity-70 transition-all border-none text-gray-800"
                      style={{ borderRadius: '50px' }}
                      title="Change Image"
                    >
                      <Upload className="w-5 h-5 mb-0.5" />
                      <span className="text-sm font-medium">Change Image</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={deleteCurrentSlide}
                      className="flex flex-col items-center justify-center px-6 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ borderRadius: '50px' }}
                      title="Delete Current Slide"
                      disabled={slides.length === 1}
                    >
                      <Trash2 className="w-5 h-5 mb-0.5" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>

                    {/* Move Up Button */}
                    <button
                      onClick={moveSlideUp}
                      className="flex flex-col items-center justify-center px-6 py-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ borderRadius: '50px' }}
                      title="Move Slide Up"
                      disabled={currentSlideIndex === 0}
                    >
                      <MoveUp className="w-5 h-5 mb-0.5" />
                      <span className="text-sm font-medium">Move Up</span>
                    </button>

                    {/* Move Down Button */}
                    <button
                      onClick={moveSlideDown}
                      className="flex flex-col items-center justify-center px-6 py-2 bg-purple-500 bg-opacity-20 hover:bg-opacity-40 active:bg-opacity-60 transition-all border-none text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ borderRadius: '50px' }}
                      title="Move Slide Down"
                      disabled={currentSlideIndex === slides.length - 1}
                    >
                      <MoveDown className="w-5 h-5 mb-0.5" />
                      <span className="text-sm font-medium">Move Down</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Image Section */}
              <div className="relative mb-8">
                {currentSlide?.imageUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={currentSlide.imageUrl}
                      alt={`Slide ${currentSlideIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center border-2 border-dashed border-pink-300 hover:border-pink-400 transition-colors">
                    {isEditing ? (
                      <div className="text-center">
                        <div className="bg-white rounded-full p-6 mb-4 shadow-lg">
                          <ImageIcon className="w-12 h-12 text-pink-500" />
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:shadow-xl gap-2 px-8"
                        >
                          <Upload className="w-6 h-6" />
                          <span className="font-semibold">Upload Image</span>
                        </button>
                        <p className="text-sm text-gray-500 mt-3">Click to select an image from your device</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                        <p>No image uploaded</p>
                      </div>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Caption Section */}
              <div className="min-h-[100px]">
                {isEditing ? (
                  <div className="relative">
                    {/* Formatting Toolbar */}
                    <div className="absolute -top-2 right-0 z-10 flex gap-1 bg-white rounded-lg shadow-lg p-1.5 border border-gray-200">
                      <button
                        onClick={() => applyFormatting('bold')}
                        className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-2 hover:bg-pink-100"
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-4 h-4" />
                        <span className="text-xs font-semibold hidden sm:inline">Bold</span>
                      </button>
                      <button
                        onClick={() => applyFormatting('italic')}
                        className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-2 hover:bg-pink-100"
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-4 h-4" />
                        <span className="text-xs font-semibold hidden sm:inline">Italic</span>
                      </button>
                      <div className="divider divider-horizontal mx-0 my-1"></div>
                      <button
                        onClick={() => applyFormatting('undo')}
                        className="btn btn-sm btn-ghost gap-1 min-h-0 h-9 px-2 hover:bg-pink-100"
                        title="Undo (Ctrl+Z)"
                      >
                        <Undo2 className="w-4 h-4" />
                        <span className="text-xs font-semibold hidden sm:inline">Undo</span>
                      </button>
                    </div>

                    {/* WYSIWYG Caption Editor */}
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-[100px] text-lg leading-relaxed border-2 border-dashed border-pink-300 focus:border-purple-500 focus:outline-none p-4 pt-16 rounded-lg bg-white text-gray-700"
                      style={{ whiteSpace: 'pre-wrap' }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    {currentSlide && renderFormattedText(currentSlide.caption)}
                  </div>
                )}
              </div>

              {/* Slide Progress Indicator */}
              <div className="flex justify-center items-center gap-2 mt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlideIndex
                        ? 'bg-pink-500 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Slide Counter */}
              <div className="text-center mt-4 text-gray-500 text-sm">
                Slide {currentSlideIndex + 1} of {slides.length}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Bigger & More User Friendly */}
      {!isEditing && (
        <>
          {/* Left Arrow */}
          <AnimatePresence>
            {currentSlideIndex > 0 && (
              <motion.button
                className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl z-30 flex items-center justify-center hover:shadow-pink-500/50 transition-shadow"
                onClick={goToPreviousSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right Arrow */}
          <AnimatePresence>
            {currentSlideIndex < slides.length - 1 && (
              <motion.button
                className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl z-30 flex items-center justify-center hover:shadow-pink-500/50 transition-shadow"
                onClick={goToNextSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Continue Button (shown on last slide) */}
      {!isEditing && currentSlideIndex === slides.length - 1 && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/gift">
            <motion.button
              className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl px-8 py-4 rounded-full flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Choose Your Gift</span>
              <Heart className="w-5 h-5" fill="white" />
            </motion.button>
          </Link>
        </motion.div>
      )}

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
