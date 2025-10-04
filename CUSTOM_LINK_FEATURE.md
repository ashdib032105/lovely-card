# Custom Link Generation Feature 🔗

## Overview

The Custom Link Generation feature allows you to create personalized URLs for your digital birthday card after completing all sections. This feature includes progress tracking, validation, and a beautiful user interface for generating and managing custom links.

---

## 🎯 Key Features

### 1. **Setup Progress Tracking**
- Real-time tracking of completion status for all 5 sections
- Visual progress indicator with percentage
- Automatic validation on content changes
- Persistent storage using Zustand + localStorage

### 2. **Progress Widget**
- Floating widget in bottom-right corner (edit mode only)
- Collapsible interface to save screen space
- Section-by-section completion checklist
- "Generate Custom Link" button (enabled at 100%)

### 3. **Link Generator**
- Beautiful modal interface
- Custom slug input with validation
- Real-time availability checking
- Slug suggestions if unavailable
- Optional expiry date
- Success screen with copy-to-clipboard

### 4. **Completion Celebration**
- Animated confetti when 100% complete
- Celebration banner at top of screen
- Quick access to link generation

---

## 📁 File Structure

```
src/
├── store/
│   └── setupStore.ts              # Zustand store for progress tracking
├── utils/
│   └── setupValidation.ts         # Validation utilities
├── components/
│   ├── SetupProgress.tsx          # Progress widget component
│   ├── LinkGenerator.tsx          # Link generation modal
│   └── CompletionBanner.tsx       # Celebration banner
└── app/
    ├── page.tsx                   # Greeting (integrated)
    ├── letter/page.tsx            # Letter (integrated)
    ├── slides/page.tsx            # Slides (integrated)
    ├── quiz/page.tsx              # Quiz (integrated)
    └── gift/page.tsx              # Gift (integrated)
```

---

## 🚀 How to Use

### For Developers

#### 1. **Understanding the Store**

The setup store tracks progress for all sections:

```typescript
import { useSetupStore } from '@/store/setupStore';

const { 
  progress,              // Current progress object
  updateProgress,        // Update section completion
  checkAllComplete,      // Check if all sections complete
  getCompletionPercentage, // Get percentage (0-100)
  setGeneratedLink,      // Save generated link
  generatedLink          // Current generated link
} = useSetupStore();
```

#### 2. **Validation Functions**

Each section has its own validation:

```typescript
import { 
  validateGreeting,
  validateLetter,
  validateSlides,
  validateQuiz,
  validateGift,
  validateSlug
} from '@/utils/setupValidation';

// Example usage
const validation = validateGreeting(title, message, buttonText);
if (validation.isValid) {
  updateProgress('greeting', true);
}
```

#### 3. **Integration Pattern**

Each page follows this pattern:

```typescript
// 1. Import dependencies
import { useSetupStore } from '@/store/setupStore';
import { validateSection } from '@/utils/setupValidation';
import SetupProgress from '@/components/SetupProgress';
import LinkGenerator from '@/components/LinkGenerator';
import CompletionBanner from '@/components/CompletionBanner';

// 2. Setup state
const [showLinkGenerator, setShowLinkGenerator] = useState(false);
const [showCompletionBanner, setShowCompletionBanner] = useState(false);
const { updateProgress, checkAllComplete } = useSetupStore();

// 3. Validate on content changes
useEffect(() => {
  const validation = validateSection(content);
  updateProgress('sectionName', validation.isValid);
}, [content, updateProgress]);

// 4. Show banner when complete
useEffect(() => {
  if (checkAllComplete() && isEditing) {
    setShowCompletionBanner(true);
  }
}, [checkAllComplete, isEditing]);

// 5. Render components
{isEditing && (
  <SetupProgress onGenerateLinkClick={() => setShowLinkGenerator(true)} />
)}
<CompletionBanner
  isVisible={showCompletionBanner}
  onGenerateLinkClick={() => {
    setShowCompletionBanner(false);
    setShowLinkGenerator(true);
  }}
  onDismiss={() => setShowCompletionBanner(false)}
/>
<LinkGenerator
  isOpen={showLinkGenerator}
  onClose={() => setShowLinkGenerator(false)}
/>
```

---

## 📋 Validation Rules

### Greeting Page
- ✅ Title must not be empty
- ✅ Message must not be empty
- ✅ Button text must not be empty

### Letter Page
- ✅ Title must not be empty
- ✅ Content must be at least 50 characters

### Slides Page
- ✅ At least 1 slide required
- ✅ All slides must have images

### Quiz Page
- ✅ At least 1 question required
- ✅ Each question must have at least 2 answers

### Gift Page
- ✅ At least 1 prize required
- ✅ Each prize must have title and message

### Custom Slug
- ✅ 3-50 characters
- ✅ Only lowercase letters, numbers, and hyphens
- ✅ Cannot start or end with hyphen
- ✅ No consecutive hyphens

---

## 🎨 UI Components

### SetupProgress Widget

**Props:**
- `onGenerateLinkClick?: () => void` - Callback when generate button clicked

**Features:**
- Collapsible interface
- Progress bar animation
- Section checklist
- Conditional button state

### LinkGenerator Modal

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close callback

**Features:**
- Two-screen flow (form → success)
- Real-time validation with debouncing
- Slug suggestions
- Copy to clipboard
- Confetti celebration

### CompletionBanner

**Props:**
- `isVisible: boolean` - Banner visibility
- `onGenerateLinkClick: () => void` - Generate link callback
- `onDismiss: () => void` - Dismiss callback

**Features:**
- Animated entrance
- Confetti celebration
- Auto-dismiss option
- Responsive design

---

## 🔧 Customization

### Changing Validation Rules

Edit `src/utils/setupValidation.ts`:

```typescript
export const validateLetter = (
  title: string,
  content: string
): ValidationResult => {
  // Change minimum content length
  if (!content || content.trim().length < 100) { // Changed from 50
    return { isValid: false, message: 'Letter content must be at least 100 characters' };
  }
  return { isValid: true };
};
```

### Customizing Progress Widget Position

Edit `src/components/SetupProgress.tsx`:

```typescript
// Change from bottom-right to bottom-left
<motion.div
  className="fixed bottom-4 left-4 z-50 max-w-sm w-full md:w-80"
  // ... rest of props
>
```

### Modifying Slug Validation

Edit `src/utils/setupValidation.ts`:

```typescript
export const validateSlug = (slug: string): ValidationResult => {
  // Change length requirements
  if (slug.length < 5) { // Changed from 3
    return { isValid: false, message: 'Slug must be at least 5 characters' };
  }
  
  // Add custom validation
  if (slug.includes('admin')) {
    return { isValid: false, message: 'Slug cannot contain "admin"' };
  }
  
  // ... rest of validation
};
```

---

## 🐛 Troubleshooting

### Progress Not Updating

**Issue**: Progress widget doesn't update when content changes

**Solution**: Ensure validation useEffect has correct dependencies:
```typescript
useEffect(() => {
  const validation = validateSection(content);
  updateProgress('section', validation.isValid);
}, [content, updateProgress]); // Include all dependencies
```

### Link Generator Not Opening

**Issue**: Modal doesn't appear when clicking "Generate Link"

**Solution**: Check state management:
```typescript
const [showLinkGenerator, setShowLinkGenerator] = useState(false);

// Ensure callback is passed correctly
<SetupProgress onGenerateLinkClick={() => setShowLinkGenerator(true)} />
```

### Completion Banner Not Showing

**Issue**: Banner doesn't appear at 100% completion

**Solution**: Verify edit mode is active:
```typescript
useEffect(() => {
  if (checkAllComplete() && isEditing) { // Must be in edit mode
    setShowCompletionBanner(true);
  }
}, [checkAllComplete, isEditing]);
```

### Slug Validation Always Fails

**Issue**: Valid slugs are rejected

**Solution**: Check slug format (lowercase only):
```typescript
// Convert to lowercase before validation
setSlug(e.target.value.toLowerCase())
```

---

## 🚀 Future Enhancements

### Planned Features

1. **Firebase Integration**
   - Store links in Firestore
   - Real availability checking
   - Link expiry management

2. **Analytics Dashboard**
   - Track link views
   - Monitor engagement
   - Export statistics

3. **Advanced Link Management**
   - Edit existing links
   - Delete links
   - Duplicate links
   - Link history

4. **Social Sharing**
   - QR code generation
   - Social media share buttons
   - Email sharing
   - WhatsApp integration

5. **Link Customization**
   - Custom domains
   - Password protection
   - Access limits
   - Geographic restrictions

---

## 📚 API Reference

### useSetupStore Hook

```typescript
interface SetupStore {
  // State
  progress: SetupProgress;
  generatedLink: GeneratedLink | null;
  
  // Actions
  updateProgress: (section: keyof SetupProgress, isComplete: boolean) => void;
  checkAllComplete: () => boolean;
  getCompletionPercentage: () => number;
  setGeneratedLink: (link: GeneratedLink) => void;
  clearGeneratedLink: () => void;
  incrementViews: () => void;
  resetProgress: () => void;
}
```

### Validation Functions

```typescript
// All validation functions return ValidationResult
interface ValidationResult {
  isValid: boolean;
  message?: string;
}

validateGreeting(title: string, message: string, buttonText: string): ValidationResult
validateLetter(title: string, content: string): ValidationResult
validateSlides(slides: Slide[]): ValidationResult
validateQuiz(questions: Question[]): ValidationResult
validateGift(prizes: Prize[]): ValidationResult
validateSlug(slug: string): ValidationResult
generateSlugSuggestions(baseSlug: string): string[]
```

---

## 💡 Tips & Best Practices

1. **Always validate on content changes** - Use useEffect with proper dependencies
2. **Show progress widget only in edit mode** - Prevents distraction during viewing
3. **Persist generated links** - Store in Zustand with localStorage
4. **Provide helpful error messages** - Guide users to fix validation issues
5. **Celebrate completion** - Use confetti and banners for positive feedback
6. **Make slug suggestions** - Help users find available alternatives
7. **Keep UI responsive** - Test on mobile devices
8. **Debounce validation** - Prevent excessive API calls (500ms recommended)

---

## 📞 Support

For issues or questions about this feature:
1. Check this documentation first
2. Review the troubleshooting section
3. Examine the code comments in source files
4. Test in development mode with console logging

---

## 📄 License

This feature is part of the Lovely Card project and follows the same license.
