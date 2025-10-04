'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Edit2, Save } from 'lucide-react';
import Link from 'next/link';
import MusicPlayer from '@/components/MusicPlayer';
import SetupProgress from '@/components/SetupProgress';
import LinkGenerator from '@/components/LinkGenerator';
import CompletionBanner from '@/components/CompletionBanner';
import { useState, useEffect } from 'react';
import { useSetupStore } from '@/store/setupStore';
import { validateGreeting } from '@/utils/setupValidation';
import { useMusic } from '@/contexts/MusicContext';

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [greetingTitle, setGreetingTitle] = useState('Happy Birthday, Sayangku Nur Kaseh Wildany! 🎉');
  const [greetingMessage, setGreetingMessage] = useState('Ebby create this website special for sayang.\nEbby have something beautiful to share with Sayang today...');
  const [buttonText, setButtonText] = useState('Open My Letter');
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  
  const { updateProgress, checkAllComplete } = useSetupStore();
  const { startMusic } = useMusic();

  const handleOpenLetter = () => {
    startMusic(); // Start music when button is clicked
  };

  // Validate and update progress when content changes
  useEffect(() => {
    const validation = validateGreeting(greetingTitle, greetingMessage, buttonText);
    updateProgress('greeting', validation.isValid);
  }, [greetingTitle, greetingMessage, buttonText, updateProgress]);

  // Show completion banner when all sections are complete
  useEffect(() => {
    if (checkAllComplete() && isEditing) {
      setShowCompletionBanner(true);
    }
  }, [checkAllComplete, isEditing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-pink-300 opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-16 h-16" fill="currentColor" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-10 text-purple-300 opacity-20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-20 h-20" fill="currentColor" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/4 text-blue-300 opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Heart className="w-24 h-24" fill="currentColor" />
        </motion.div>
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Main Content */}
      <motion.div
        className="max-w-2xl w-full text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Greeting Card */}
        <motion.div
          className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Edit Mode Indicator */}
          {isEditing && (
            <div className="absolute top-4 right-4 badge badge-success gap-2">
              <Edit2 className="w-3 h-3" />
              Edit Mode
            </div>
          )}
          {/* Heart Icon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-gradient-to-br from-pink-400 to-red-400 rounded-full p-6 shadow-lg">
              <Heart className="w-12 h-12 text-white" fill="white" />
            </div>
          </motion.div>

          {/* Greeting Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isEditing ? (
              <input
                type="text"
                value={greetingTitle}
                onChange={(e) => setGreetingTitle(e.target.value)}
                className="input input-bordered w-full text-4xl md:text-5xl font-bold text-center bg-transparent border-2 border-dashed border-pink-300 focus:border-purple-500 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4"
                placeholder="Enter greeting title..."
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4">
                {greetingTitle}
              </h1>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isEditing ? (
              <textarea
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                className="textarea textarea-bordered w-full text-lg md:text-xl text-gray-700 mb-8 leading-relaxed min-h-[100px] border-2 border-dashed border-pink-300 focus:border-purple-500"
                placeholder="Enter greeting message..."
              />
            ) : (
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
                {greetingMessage}
              </p>
            )}
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-300"></div>
            <Sparkles className="w-5 h-5 text-pink-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-300"></div>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {isEditing ? (
              <div className="flex flex-col items-center gap-2 w-full max-w-md">
                <label className="text-sm text-gray-500">Button Text:</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="input input-bordered w-full text-center border-2 border-dashed border-pink-300 focus:border-purple-500"
                  placeholder="Enter button text..."
                />
                <div className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg px-8 py-4 text-lg rounded-full flex items-center gap-2 opacity-50 cursor-not-allowed">
                  <Heart className="w-5 h-5" fill="white" />
                  <span>{buttonText}</span>
                </div>
                <span className="text-xs text-gray-400">Preview (disabled in edit mode)</span>
              </div>
            ) : (
              <Link href="/letter" onClick={handleOpenLetter}>
                <motion.button
                  className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl px-8 py-4 text-lg rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-5 h-5" fill="white" />
                  <span>{buttonText}</span>
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-sm text-gray-500 mt-6 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Made with endless love by Nabil Adib just for Sayang ❤️
          </motion.p>
        </motion.div>
      </motion.div>

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
