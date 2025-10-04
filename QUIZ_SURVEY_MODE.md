# Quiz Survey Mode Feature

## Overview
The quiz feature now supports **Survey Mode**, allowing questions to have no correct or wrong answers. This makes the quiz flexible for both knowledge testing and opinion gathering.

## Features

### 🎯 Two Question Types

#### 1. **Scored Questions** (Default)
- Have a correct answer
- Contribute to the final score
- Show green (correct) or red (wrong) feedback in results
- Marked with a **"Scored"** badge in edit mode

#### 2. **Survey Questions** (No Validation)
- No correct or wrong answers
- Don't contribute to scoring
- No color-coded feedback in results
- Marked with a **"Survey"** badge in edit mode
- Perfect for opinion-based or preference questions

### 🎛️ Global Scoring Toggle

In **Edit Mode**, you can:
- **Enable/Disable Scoring** globally for the entire quiz
- When disabled, all questions become survey-style
- Passing score setting only appears when scoring is enabled
- Results screen adapts based on scoring status

### 📝 Per-Question Validation Toggle

Each question can individually toggle between:
- **Scored Mode**: Has correct answer, contributes to score
- **Survey Mode**: No correct answer, opinion-based

#### How to Toggle:
1. Enter Edit Mode (click Edit button)
2. Navigate to the question you want to change
3. Click the badge next to the question number:
   - **"Scored"** badge (blue) = Question has correct answer
   - **"Survey"** badge (gray) = Question is opinion-based
4. The badge toggles between the two modes

### 🎨 Visual Indicators

#### Edit Mode:
- **Scored questions**: Show green highlight on correct answer
- **Survey questions**: No green highlight, all answers equal
- **Correct answer button**: Only visible for scored questions
- **Badge color**: Blue for scored, gray for survey

#### View Mode (Results):
- **Scored questions**: Show ✓ for correct, ✗ for wrong answers
- **Survey questions**: No validation icons, just selection highlight
- **Results screen**: Adapts message based on scoring status

### 📊 Results Screen Behavior

#### When Scoring is Enabled:
- Shows percentage score
- Shows correct/total count
- Shows pass/fail status
- Conditional access to gift section (based on passing score)

#### When Scoring is Disabled:
- Shows "Thank You" message
- Displays purple heart icon
- No score calculation
- Automatic access to gift section
- Message: "This was a survey - there are no right or wrong answers!"

## Use Cases

### 1. **Knowledge Quiz** (All Scored)
```
Question: What is my favorite color?
- Blue ❌
- Pink ✓ (Correct)
- Green ❌
- Purple ❌
```

### 2. **Mixed Quiz + Survey**
```
Q1 (Scored): What is my birthday?
Q2 (Survey): Which date idea sounds best to you?
Q3 (Scored): Where did we first meet?
Q4 (Survey): What's your favorite memory of us?
```

### 3. **Pure Survey** (All Survey Mode)
```
Q1 (Survey): What's your favorite season?
Q2 (Survey): Beach or mountains?
Q3 (Survey): Coffee or tea?
```

## Technical Implementation

### Data Structure Changes

```typescript
interface Question {
  id: string;
  question: string;
  answers: Answer[];
  hasCorrectAnswer: boolean; // NEW: Controls validation
}
```

### Key Functions

```typescript
// Toggle question validation mode
toggleQuestionValidation()

// Check if quiz has scoring enabled
hasScoringEnabled()

// Calculate score (only counts scored questions)
calculateScore()

// Check if passed (always true if scoring disabled)
isPassed()
```

### Scoring Logic

- Only questions with `hasCorrectAnswer: true` are counted
- Score percentage = (correct scored questions) / (total scored questions)
- If no scored questions exist, percentage defaults to 100%
- If global scoring is disabled, `isPassed()` always returns `true`

## Editor Controls

### Global Settings (Edit Mode Header)
1. **Quiz Title**: Editable text input
2. **Enable Scoring**: Checkbox toggle
3. **Passing Score**: Number input (0-100%, only visible when scoring enabled)

### Per-Question Settings
1. **Question text**: WYSIWYG editor with formatting
2. **Validation toggle**: Badge button (Scored ↔ Survey)
3. **Answer options**: WYSIWYG editors
4. **Correct answer marker**: Only visible in scored mode

### Answer Management
- **Scored mode**: Shows checkmark button to mark correct answer
- **Survey mode**: Checkmark button hidden (no correct answer needed)
- Green border only appears in scored mode

## Best Practices

### When to Use Scored Questions:
- Factual information (dates, names, places)
- Testing knowledge about yourself
- Questions with definitive correct answers
- When you want to gate access to the gift section

### When to Use Survey Questions:
- Opinion-based questions
- Preference questions
- Open-ended scenarios
- Getting to know the recipient better
- When there's no "right" answer

### Mixed Approach:
- Start with scored questions to test knowledge
- End with survey questions for fun/opinions
- Creates a more engaging and personal experience
- Reduces pressure while maintaining interactivity

## Examples

### Example 1: Romantic Quiz
```
✓ Q1 (Scored): When did we start dating?
✓ Q2 (Scored): What was our first movie together?
○ Q3 (Survey): Which date was your favorite?
○ Q4 (Survey): What makes you happiest about us?
```

### Example 2: Getting to Know You
```
○ Q1 (Survey): What's your dream vacation?
○ Q2 (Survey): Morning person or night owl?
○ Q3 (Survey): Favorite type of cuisine?
○ Q4 (Survey): Ideal weekend activity?
```

### Example 3: Birthday Quiz
```
✓ Q1 (Scored): What's my favorite dessert?
✓ Q2 (Scored): What's my zodiac sign?
✓ Q3 (Scored): What's my lucky number?
○ Q4 (Survey): What gift would you like to give me?
```

## Tips for Creators

1. **Mix question types** for variety and engagement
2. **Use survey mode** for personal questions without pressure
3. **Disable global scoring** for pure surveys/opinion gathering
4. **Set appropriate passing scores** (70% is default)
5. **Use formatting** (bold, italic) to emphasize key words
6. **Add emojis** to make questions more fun and visual
7. **Test both modes** before sharing with recipient

## Keyboard Shortcuts

All standard WYSIWYG shortcuts work in both modes:
- **Ctrl+B / Cmd+B**: Bold text
- **Ctrl+I / Cmd+I**: Italic text
- **Ctrl+Z / Cmd+Z**: Undo

## Future Enhancements

Potential additions:
- Multiple correct answers per question
- Partial credit scoring
- Question categories/tags
- Export survey responses
- Analytics dashboard
- Custom feedback messages per question
