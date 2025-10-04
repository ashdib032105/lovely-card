'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Edit2, Save, Bold, Italic, Undo2, X } from 'lucide-react';
import Link from 'next/link';
import MusicPlayer from '@/components/MusicPlayer';
import SetupProgress from '@/components/SetupProgress';
import LinkGenerator from '@/components/LinkGenerator';
import CompletionBanner from '@/components/CompletionBanner';
import { useState, useRef, useEffect } from 'react';
import { useSetupStore } from '@/store/setupStore';
import { validateLetter } from '@/utils/setupValidation';
import { letterConfig } from '@/config';

export default function LetterPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);
  // Load letter from static config
  const [letterTitle, setLetterTitle] = useState(letterConfig.title);
  const [letterContent, setLetterContent] = useState(letterConfig.content);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  
  const { updateProgress, checkAllComplete } = useSetupStore();
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Function to apply formatting to selected text
  const applyFormatting = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  // Function to get content from contentEditable div
  const getEditorContent = () => {
    if (!editorRef.current) return '';
    
    // Convert HTML back to plain text with markdown-style markers
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
    
    // Convert markdown to HTML
    let html = text;
    
    // Replace **text** with <strong>text</strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *text* with <em>text</em>
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Replace newlines with <div> for contentEditable
    html = html.split('\n').map(line => `<div>${line || '<br>'}</div>`).join('');
    
    editorRef.current.innerHTML = html;
  };

  // Save content when exiting edit mode
  const handleSaveAndExit = () => {
    if (isEditing && editorRef.current) {
      const content = getEditorContent();
      setLetterContent(content);
    }
    setIsEditing(!isEditing);
  };

  // Initialize editor content when entering edit mode
  useEffect(() => {
    if (isEditing && editorRef.current) {
      setEditorContent(letterContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

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

  // Validate and update progress when content changes
  useEffect(() => {
    const validation = validateLetter(letterTitle, letterContent);
    updateProgress('letter', validation.isValid);
  }, [letterTitle, letterContent, updateProgress]);

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
      // Replace **text** with <strong>text</strong>
      let formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Replace *text* with <em>text</em>
      formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
      
      return (
        <p 
          key={index} 
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
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
        <Link href="/">
          <button className="btn btn-circle btn-ghost bg-white bg-opacity-80 backdrop-blur-sm shadow-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>


      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-20 pb-12">
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
              <Heart className="w-10 h-10 text-pink-500" fill="currentColor" />
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                className="input input-bordered w-full max-w-2xl mx-auto text-3xl md:text-4xl font-bold text-center bg-transparent border-2 border-dashed border-pink-300 focus:border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2"
                placeholder="Enter letter title..."
              />
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
                {letterTitle}
              </h1>
            )}
            
            <p className="text-gray-500 italic">Written from the heart ❤️</p>
          </motion.div>

          {/* Letter Content */}
          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isEditing ? (
              <div className="relative">
                {/* Formatting Toolbar - Top Right (Mobile Friendly) */}
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

                {/* WYSIWYG Editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-[400px] text-lg leading-relaxed border-2 border-dashed border-pink-300 focus:border-purple-500 focus:outline-none p-4 pt-16 rounded-lg bg-white text-gray-700"
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                {renderFormattedText(letterContent)}
              </div>
            )}
          </motion.div>

          {/* Continue Button */}
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/slides">
              <motion.button
                className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl px-8 py-4 rounded-full flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Continue to Memories</span>
                <Heart className="w-5 h-5" fill="white" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
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
