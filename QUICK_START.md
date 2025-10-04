# 🎂 Quick Start Guide - Birthday Card Setup

**Deadline: Before 10:30** ⏰

This guide shows you exactly where to drop your images and edit your content!

---

## 📂 Step 1: Create Folder Structure

Create these folders in `public/`:

```
public/
├── slides/          👈 DROP YOUR SLIDE IMAGES HERE
├── gifts/           👈 DROP YOUR GIFT/PRIZE IMAGES HERE  
└── audio/
    └── background.mp3   👈 DROP YOUR BACKGROUND MUSIC HERE
```

**Quick commands to create folders:**
```bash
mkdir public\slides
mkdir public\gifts
```

---

## 🖼️ Step 2: Add Your Slide Images

### 1. Drop images into `public/slides/`
   - Name them: `slide1.jpg`, `slide2.jpg`, `slide3.jpg`, etc.
   - Supported: `.jpg`, `.png`, `.gif`, `.webp`

### 2. Edit captions in `src/config/slides.ts`:
   
Open the file and you'll see:

```typescript
export const slidesConfig: SlideConfig[] = [
  {
    id: '1',
    imageUrl: '/slides/slide1.jpg',  // 👈 Your image filename
    caption: 'Our first date ❤️'      // 👈 Edit this text
  },
  {
    id: '2',
    imageUrl: '/slides/slide2.jpg',
    caption: 'Every moment with you is **magical**'  // **bold**
  },
  // Add more slides by copying the structure above
];
```

**To add more slides:** Copy one slide object and paste it below, then update the id, imageUrl, and caption.

---

## 💌 Step 3: Edit Your Love Letter

Open `src/config/letter.ts` and edit:

```typescript
export const letterConfig: LetterConfig = {
  title: 'My Love Letter to You',  // 👈 Edit title
  content: `
My Dearest Love,

Write your beautiful letter here...
Use **bold** and *italic* for formatting!

Forever yours,
**Your Name**
  `  // 👈 Edit letter content
};
```

---

## 🎁 Step 4: Set Up Mystery Gifts

### 1. Drop gift images into `public/gifts/`
   - Name them: `gift1.jpg`, `gift2.jpg`, etc.

### 2. Edit prizes in `src/config/gifts.ts`:

```typescript
export const giftsConfig: GiftsConfig = {
  title: 'Choose Your Mystery Gift 🎁',
  prizes: [
    {
      id: '1',
      title: 'A Romantic Dinner',
      message: `I'm taking you to your **favorite restaurant**!`,
      imageUrl: '/gifts/gift1.jpg'  // 👈 Your image
    },
    // Add more prizes by copying the structure above
  ]
};
```

---

## 🎵 Step 5: Add Background Music

Drop your music file into `public/audio/background.mp3`

**Supported formats:** `.mp3`, `.wav`, `.ogg`

---

## 🚀 Step 6: Run & Deploy

### Run locally to test:
```bash
npm run dev
```
Then open http://localhost:3000

### Build for production:
```bash
npm run build
npm start
```

### Deploy to Vercel (fastest & free):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts and your site will be live in minutes!

---

## ✅ Quick Checklist

- [ ] Created `public/slides/` folder
- [ ] Created `public/gifts/` folder  
- [ ] Added slide images to `public/slides/`
- [ ] Edited `src/config/slides.ts` with captions
- [ ] Edited `src/config/letter.ts` with your letter
- [ ] Added gift images to `public/gifts/`
- [ ] Edited `src/config/gifts.ts` with prizes
- [ ] Added `public/audio/background.mp3`
- [ ] Tested locally with `npm run dev`
- [ ] Deployed to Vercel!

---

## 🎨 Formatting Tips

- **Bold text**: Wrap in `**text**`
- *Italic text*: Wrap in `*text*`
- Emojis: Just paste them directly! ❤️💕✨
- Line breaks: Just press Enter in the config files

---

## 🔥 Quick Deploy Commands

```bash
# 1. Test locally
npm run dev

# 2. Deploy to Vercel
npx vercel --prod

# That's it! You'll get a live URL instantly.
```

---

## 📁 File Locations Summary

| What to Edit | File Location |
|-------------|---------------|
| Slide images & captions | `src/config/slides.ts` |
| Love letter | `src/config/letter.ts` |
| Gift prizes | `src/config/gifts.ts` |
| Slide images (drop here) | `public/slides/` |
| Gift images (drop here) | `public/gifts/` |
| Background music | `public/audio/background.mp3` |

---

## 🆘 Troubleshooting

**Images not showing?**
- Make sure image filenames match exactly (case-sensitive)
- Check that images are in the correct folders
- Refresh the browser (Ctrl+F5)

**Can't run npm commands?**
```bash
# Install dependencies first
npm install
```

**Need help?**
- All config files have comments showing you what to edit
- Look for 👈 emoji markers in the config files

---

**You're all set! Good luck with your birthday surprise! 🎉**
