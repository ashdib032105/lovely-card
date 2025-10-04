'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Check, AlertCircle, Calendar, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSetupStore } from '@/store/setupStore';
import { useCardStore } from '@/store/cardStore';
import { validateSlug, generateSlugSuggestions } from '@/utils/setupValidation';
import { isSlugAvailable, generateCustomLink } from '@/lib/firestore';
import confetti from 'canvas-confetti';

interface LinkGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinkGenerator({ isOpen, onClose }: LinkGeneratorProps) {
  const [slug, setSlug] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { setGeneratedLink, generatedLink } = useSetupStore();
  const { cardId, saveToFirebase } = useCardStore();
  
  const baseUrl = 'lovelycard.me';
  const fullUrl = slug ? `${baseUrl}/${slug}` : baseUrl;

  // Validate slug with debouncing
  useEffect(() => {
    if (!slug) {
      setValidationError(null);
      setIsAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      const validation = validateSlug(slug);
      
      if (!validation.isValid) {
        setValidationError(validation.message || 'Invalid slug');
        setIsAvailable(false);
        setSuggestions(generateSlugSuggestions(slug));
      } else {
        setValidationError(null);
        // Check availability against Firebase
        checkAvailability(slug);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const checkAvailability = async (slugToCheck: string) => {
    setIsValidating(true);
    
    try {
      // Check Firebase for slug availability
      const available = await isSlugAvailable(slugToCheck);
      setIsAvailable(available);
      
      if (!available) {
        setSuggestions(generateSlugSuggestions(slugToCheck));
      }
    } catch (error) {
      console.error('Error checking slug availability:', error);
      setValidationError('Error checking availability. Please try again.');
      setIsAvailable(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleGenerate = async () => {
    if (!slug || !isAvailable) return;

    setIsValidating(true);

    try {
      // Save card data to Firebase first
      await saveToFirebase();

      // Generate custom link in Firebase
      const linkData = await generateCustomLink(
        cardId,
        slug,
        expiryDate ? new Date(expiryDate) : null
      );

      // Save to local store
      const newLink = {
        slug: linkData.slug,
        fullUrl: linkData.fullUrl,
        createdAt: linkData.createdAt.toDate(),
        expiryDate: linkData.expiryDate ? linkData.expiryDate.toDate() : null,
        views: linkData.views,
      };

      setGeneratedLink(newLink);
      setShowSuccess(true);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error generating link:', error);
      setValidationError('Error generating link. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(`https://${generatedLink.fullUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setSlug('');
    setValidationError(null);
    setIsAvailable(null);
    setSuggestions([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!showSuccess ? (
            /* Link Generator Form */
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Generate Custom Link</h2>
                    <p className="text-sm text-gray-600">Create a unique URL for your card</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="btn btn-circle btn-ghost"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Slug Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Link Slug
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 font-medium">{baseUrl}/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="kaseh-wildany"
                    className="input input-bordered flex-1 text-lg"
                    autoFocus
                  />
                </div>

                {/* Validation Feedback */}
                <AnimatePresence mode="wait">
                  {isValidating && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm text-gray-600 mt-2"
                    >
                      <div className="loading loading-spinner loading-xs"></div>
                      Checking availability...
                    </motion.div>
                  )}

                  {!isValidating && validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm text-red-600 mt-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {validationError}
                    </motion.div>
                  )}

                  {!isValidating && isAvailable === true && slug && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm text-green-600 mt-2"
                    >
                      <Check className="w-4 h-4" />
                      Available! This link is ready to use.
                    </motion.div>
                  )}

                  {!isValidating && isAvailable === false && slug && !validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm text-red-600 mt-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      This link is already taken
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Try these alternatives:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.slice(0, 3).map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setSlug(suggestion)}
                          className="badge badge-outline badge-lg hover:badge-primary cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              {slug && isAvailable && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200"
                >
                  <p className="text-xs text-gray-600 mb-1">Preview:</p>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-purple-500" />
                    <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                      {fullUrl}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Expiry Date (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Expiry (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input input-bordered flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for a link that never expires
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!slug || !isAvailable || isValidating}
                  className="btn bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Link
                </button>
              </div>
            </div>
          ) : (
            /* Success Screen */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Link Generated! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6"
              >
                Your custom card link is ready to share!
              </motion.p>

              {/* Generated Link Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200 mb-3">
                  <p className="text-sm text-gray-600 mb-2">Your Custom Link:</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <LinkIcon className="w-5 h-5 text-purple-500" />
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                      {generatedLink?.fullUrl}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="btn btn-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>

                {/* Link Info */}
                <div className="text-left bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-800">
                      {generatedLink?.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expires:</span>
                    <span className="font-medium text-gray-800">
                      {generatedLink?.expiryDate 
                        ? generatedLink.expiryDate.toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium text-gray-800">
                      {generatedLink?.views || 0}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Share Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-pink-50 rounded-xl"
              >
                <p className="text-sm text-gray-700">
                  💕 Share this link with your special someone and make their day magical!
                </p>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleClose}
                className="btn btn-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none shadow-lg hover:shadow-xl"
              >
                Done
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
