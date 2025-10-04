'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useSetupStore } from '@/store/setupStore';

interface SetupProgressProps {
  onGenerateLinkClick?: () => void;
}

export default function SetupProgress({ onGenerateLinkClick }: SetupProgressProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { progress, getCompletionPercentage, checkAllComplete } = useSetupStore();
  
  const percentage = getCompletionPercentage();
  const isComplete = checkAllComplete();
  
  const sections = [
    { key: 'greeting', label: 'Greeting Page', complete: progress.greeting },
    { key: 'letter', label: 'Love Letter', complete: progress.letter },
    { key: 'slides', label: 'Memory Slides', complete: progress.slides },
    { key: 'quiz', label: 'Quiz Section', complete: progress.quiz },
    { key: 'gift', label: 'Mystery Gifts', complete: progress.gift },
  ];

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 max-w-sm w-full md:w-80"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-pink-200 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-pink-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isComplete 
                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                : 'bg-gradient-to-br from-pink-400 to-purple-500'
            }`}>
              {isComplete ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800 text-sm">Setup Progress</h3>
              <p className="text-xs text-gray-600">{percentage}% Complete</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                isComplete 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-pink-100"
            >
              <div className="p-4 space-y-2">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    {section.complete ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      section.complete ? 'text-gray-700 font-medium' : 'text-gray-400'
                    }`}>
                      {section.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
              <div className="p-4 pt-2">
                {isComplete ? (
                  <motion.button
                    onClick={onGenerateLinkClick}
                    className="w-full btn bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Custom Link
                  </motion.button>
                ) : (
                  <button
                    disabled
                    className="w-full btn btn-disabled bg-gray-200 text-gray-400 border-none"
                  >
                    Complete All Sections
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
