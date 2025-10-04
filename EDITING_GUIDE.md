# Editing Guide - Interactive Birthday Card

## 🎨 How to Edit Your Birthday Card

Your birthday card now has a **built-in editor** on both the greeting page and letter page that allows you to customize the content directly without touching any code!

---

## 📝 Greeting Page Editor

### Entering Edit Mode

1. Look for the **blue pencil icon** button in the top-left corner of the page
2. Click it to enter **Edit Mode**
3. The button will turn **green** and show a save icon
4. You'll see an "Edit Mode Active" banner with instructions

### What You Can Edit

When in Edit Mode, you can customize:

#### 1. **Greeting Title**
- The main heading (e.g., "Happy Birthday, Sayang Ebby! 🎉")
- Click the text field to edit
- Supports emojis! 🎉❤️💕

#### 2. **Greeting Message**
- The paragraph below the title
- Multi-line text area
- Press Enter to create new lines
- Perfect for longer, personalized messages

#### 3. **Button Text**
- The text on the "Open My Letter" button
- You'll see a live preview of how it looks
- The button is disabled in edit mode (for safety)

### Saving Your Changes

1. Click the **green save button** (same location as the edit button)
2. Your changes are immediately applied
3. The page returns to normal viewing mode
4. Changes are stored in the browser session (temporary)

### Visual Indicators in Edit Mode

- **Dashed pink borders** around editable fields
- **"Edit Mode" badge** in the top-right of the card
- **Green instruction banner** explaining how to edit
- **Preview of button** showing your custom text

### Tips

- **Use emojis** to make your message more fun and romantic! 🥰💖✨
- **Keep it concise** - shorter messages look better on mobile
- **Test on mobile** - make sure your text fits nicely
- **Refresh to reset** - if you want to start over, just refresh the page

### Current Limitations

- Changes are **not persistent** (they reset on page refresh)
- To make permanent changes, you'll need to:
  - Edit the default values in `src/app/page.tsx` (lines 11-13)
  - Or wait for the admin panel feature (coming soon!)

### Example Customizations

**Romantic:**
```
Title: "To My Beautiful Sayang ❤️"
Message: "Every moment with you is a treasure.
Today, I celebrate the amazing person you are!"
Button: "Read My Love Letter"
```

**Playful:**
```
Title: "Happy Birthday to My Favorite Human! 🎂"
Message: "Get ready for surprises, fun, and lots of love!
This is going to be the best day ever!"
Button: "Let's Celebrate!"
```

**Sweet:**
```
Title: "Happy Birthday, My Everything 💕"
Message: "You make every day brighter.
I've prepared something special just for you..."
Button: "See What's Inside"
```

---

## 💌 Letter Page Editor

### Entering Edit Mode

1. Navigate to the letter page (click "Open My Letter" button)
2. Look for the **blue pencil icon** button in the top-right corner
3. Click it to enter **Edit Mode**
4. The button will turn **green** and show a save icon

### What You Can Edit

#### 1. **Letter Title**
- The heading "My Love Letter to You"
- Click the text field to edit
- Supports emojis! 💕

#### 2. **Letter Content (with Rich Text Formatting!)**
- Full multi-paragraph letter content
- Large textarea for writing
- **Bold** and *Italic* formatting support
- Live preview as you type

### Rich Text Formatting

The letter editor supports **markdown-style formatting**:

#### Using Toolbar Buttons:
1. **Select text** in the textarea
2. Click **Bold** or **Italic** button
3. The formatting is automatically applied

#### Using Markdown Syntax:
- `**text**` → **bold text**
- `*text*` → *italic text*

**Example:**
```
My **Dearest Love**,

You are the *most amazing* person I've ever met.
I **love** you more than words can say!

Forever yours,
**Your Name**
```

**Renders as:**
> My **Dearest Love**,
> 
> You are the *most amazing* person I've ever met.
> I **love** you more than words can say!
> 
> Forever yours,
> **Your Name**

### Features in Edit Mode

- **Floating Toolbar (Top-Right)** - Bold, Italic, and Undo buttons positioned at the top-right of the editor
- **Mobile-Friendly** - Icon-only buttons on mobile, text labels on desktop
- **WYSIWYG Editor** - See formatting applied instantly as you type (What You See Is What You Get)
- **Keyboard Shortcuts** - Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+Z (Undo)
- **Undo Support** - Easily revert changes with the undo button
- **Large Editor** - Comfortable writing space (400px height)
- **Visual Indicators** - Dashed borders and badges
- **No Preview Needed** - Formatting appears directly in the editor!

### Tips for Letter Writing

- **Find the toolbar** - Look at the top-right corner of the editor
- **Use paragraphs** - Press Enter for new lines
- **Emphasize key words** - Select text and click Bold button (or Ctrl+B)
- **Add emotion** - Select text and click Italic button (or Ctrl+I)
- **Made a mistake?** - Click Undo button (or Ctrl+Z)
- **Include emojis** - Make it personal! ❤️💕✨
- **Mobile users** - Toolbar shows icons only for easy thumb access

### Example Love Letter

```
**My Dearest Sayang,**

From the moment I met you, my life has been filled with *joy and laughter*. 

You are my **best friend**, my **partner**, and my **everything**. Every day with you is a *gift* I treasure.

On this special day, I want you to know how much you mean to me. You make the world **brighter** just by being in it.

**Happy Birthday, my love!** 🎉

Forever and always,
**Ebby** ❤️
```

---

## 🔒 Making Changes Permanent

To save your edits permanently (so they don't reset on refresh):

### For Greeting Page:
1. Make your edits in Edit Mode
2. Copy the text you want to keep
3. Open `src/app/page.tsx`
4. Find lines 11-13 and update the `useState` default values

### For Letter Page:
1. Make your edits in Edit Mode
2. Copy the text you want to keep
3. Open `src/app/letter/page.tsx`
4. Find lines 11-23 and update the `useState` default values

Or wait for the **Admin Panel** feature which will save to Firebase!

---

## 📱 Mobile Friendly

Both editors work great on mobile devices:
- Touch-friendly buttons
- Responsive layouts
- Easy text selection
- Comfortable typing experience

---

**Enjoy customizing your romantic birthday card!** 💝
