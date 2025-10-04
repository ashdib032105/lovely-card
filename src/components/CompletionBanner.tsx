'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CompletionBannerProps {
  isVisible: boolean;
  onGenerateLinkClick: () => void;
  onDismiss: () => void;
}

export default function CompletionBanner({ 
  isVisible, 
  onGenerateLinkClick,
  onDismiss 
}: CompletionBannerProps) {
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  useEffect(() => {
    if (isVisible && !hasShownConfetti) {
      // Trigger confetti celebration
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ec4899', '#a855f7', '#3b82f6']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ec4899', '#a855f7', '#3b82f6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
      setHasShownConfetti(true);
    }
  }, [isVisible, hasShownConfetti]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 p-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    <Sparkles className="w-10 h-10 text-yellow-300" fill="currentColor" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                      🎉 Setup Complete!
                    </h3>
                    <p className="text-white text-opacity-90 text-sm md:text-base">
                      Your card is ready! Generate a custom link to share with your loved one.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={onGenerateLinkClick}
                    className="btn bg-white text-purple-600 border-none shadow-lg hover:shadow-xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="hidden sm:inline">Generate Link</span>
                    <span className="sm:hidden">Generate</span>
                  </motion.button>

                  <button
                    onClick={onDismiss}
                    className="btn btn-circle btn-ghost text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
