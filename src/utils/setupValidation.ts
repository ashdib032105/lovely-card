// Validation utilities for setup completion

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateGreeting = (
  title: string,
  message: string,
  buttonText: string
): ValidationResult => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Greeting title is required' };
  }
  if (!message || message.trim().length === 0) {
    return { isValid: false, message: 'Greeting message is required' };
  }
  if (!buttonText || buttonText.trim().length === 0) {
    return { isValid: false, message: 'Button text is required' };
  }
  return { isValid: true };
};

export const validateLetter = (
  title: string,
  content: string
): ValidationResult => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Letter title is required' };
  }
  if (!content || content.trim().length < 50) {
    return { isValid: false, message: 'Letter content must be at least 50 characters' };
  }
  return { isValid: true };
};

export const validateSlides = (
  slides: Array<{ imageUrl: string; caption: string }>
): ValidationResult => {
  if (slides.length === 0) {
    return { isValid: false, message: 'At least one slide is required' };
  }
  
  const slidesWithoutImages = slides.filter(s => !s.imageUrl || s.imageUrl.trim().length === 0);
  if (slidesWithoutImages.length > 0) {
    return { isValid: false, message: 'All slides must have images' };
  }
  
  return { isValid: true };
};

export const validateQuiz = (
  questions: Array<{ question: string; answers: Array<{ text: string }> }>
): ValidationResult => {
  if (questions.length === 0) {
    return { isValid: false, message: 'At least one question is required' };
  }
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.question || q.question.trim().length === 0) {
      return { isValid: false, message: `Question ${i + 1} is empty` };
    }
    if (q.answers.length < 2) {
      return { isValid: false, message: `Question ${i + 1} needs at least 2 answers` };
    }
  }
  
  return { isValid: true };
};

export const validateGift = (
  prizes: Array<{ title: string; message: string }>
): ValidationResult => {
  if (prizes.length === 0) {
    return { isValid: false, message: 'At least one prize is required' };
  }
  
  for (let i = 0; i < prizes.length; i++) {
    const p = prizes[i];
    if (!p.title || p.title.trim().length === 0) {
      return { isValid: false, message: `Prize ${i + 1} needs a title` };
    }
    if (!p.message || p.message.trim().length === 0) {
      return { isValid: false, message: `Prize ${i + 1} needs a message` };
    }
  }
  
  return { isValid: true };
};

// Slug validation for custom links
export const validateSlug = (slug: string): ValidationResult => {
  if (!slug || slug.trim().length === 0) {
    return { isValid: false, message: 'Link slug is required' };
  }
  
  if (slug.length < 3) {
    return { isValid: false, message: 'Slug must be at least 3 characters' };
  }
  
  if (slug.length > 50) {
    return { isValid: false, message: 'Slug must be less than 50 characters' };
  }
  
  // Only allow alphanumeric and hyphens
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return { isValid: false, message: 'Only lowercase letters, numbers, and hyphens allowed' };
  }
  
  // Cannot start or end with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { isValid: false, message: 'Slug cannot start or end with a hyphen' };
  }
  
  // Cannot have consecutive hyphens
  if (slug.includes('--')) {
    return { isValid: false, message: 'Slug cannot have consecutive hyphens' };
  }
  
  return { isValid: true };
};

// Generate slug suggestions
export const generateSlugSuggestions = (baseSlug: string): string[] => {
  const suggestions: string[] = [];
  const cleanSlug = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');
  
  suggestions.push(`${cleanSlug}-${Math.floor(Math.random() * 1000)}`);
  suggestions.push(`${cleanSlug}-${new Date().getFullYear()}`);
  suggestions.push(`${cleanSlug}-special`);
  suggestions.push(`${cleanSlug}-love`);
  suggestions.push(`my-${cleanSlug}`);
  
  return suggestions;
};
