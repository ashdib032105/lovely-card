# 📁 Complete File Structure Guide

## Where Everything Goes

```
lovely-card/
│
├── public/                          ← PUBLIC ASSETS (images, audio)
│   ├── slides/                      ← 🖼️ DROP SLIDE IMAGES HERE
│   │   ├── slide1.jpg              ← Your first slide image
│   │   ├── slide2.jpg              ← Your second slide image
│   │   ├── slide3.jpg              ← Your third slide image
│   │   └── README.md               ← Instructions
│   │
│   ├── gifts/                       ← 🎁 DROP GIFT IMAGES HERE
│   │   ├── gift1.jpg               ← Your first gift image
│   │   ├── gift2.jpg               ← Your second gift image
│   │   ├── gift3.jpg               ← Your third gift image
│   │   └── README.md               ← Instructions
│   │
│   └── audio/                       ← 🎵 DROP MUSIC HERE
│       ├── background.mp3          ← Your background music
│       └── README.md               ← Instructions
│
├── src/
│   ├── config/                      ← ⚙️ EDIT THESE CONFIG FILES
│   │   ├── slides.ts               ← 📝 Edit slide captions here
│   │   ├── letter.ts               ← 📝 Edit love letter here
│   │   ├── gifts.ts                ← 📝 Edit gift prizes here
│   │   ├── quiz.ts                 ← (optional - not used)
│   │   └── index.ts                ← (auto-generated exports)
│   │
│   ├── app/                         ← App pages (already updated)
│   │   ├── page.tsx                ← Home/Greeting page
│   │   ├── letter/page.tsx         ← Letter page
│   │   ├── slides/page.tsx         ← Slides page
│   │   ├── quiz/page.tsx           ← Quiz page
│   │   └── gift/page.tsx           ← Gift page
│   │
│   └── components/                  ← Reusable components
│       └── MusicPlayer.tsx         ← Music player component
│
├── QUICK_START.md                   ← 📖 START HERE - Main guide
├── STATIC_SETUP_COMPLETE.md         ← ✅ Setup completion guide
├── DEPLOY.md                        ← 🚀 Deployment instructions
├── FILE_STRUCTURE.md                ← 📁 This file
├── package.json                     ← Dependencies
└── README.md                        ← Original Next.js readme
```

---

## 🎯 Your Action Items

### 1️⃣ Add Images (Required)

**Slide Images:**
```
public/slides/slide1.jpg  ← Add your images here
public/slides/slide2.jpg
public/slides/slide3.jpg
```

**Gift Images:**
```
public/gifts/gift1.jpg    ← Add your images here
public/gifts/gift2.jpg
public/gifts/gift3.jpg
```

**Background Music:**
```
public/audio/background.mp3  ← Add your music here
```

---

### 2️⃣ Edit Config Files (Required)

**Love Letter:**
```
src/config/letter.ts      ← Edit title and content
```

**Slide Captions:**
```
src/config/slides.ts      ← Edit captions for each slide
```

**Gift Prizes:**
```
src/config/gifts.ts       ← Edit prize titles and messages
```

---

## 📝 Quick Edit Examples

### Edit Letter (`src/config/letter.ts`)
```typescript
export const letterConfig = {
  title: 'Happy Birthday My Love!',  // ← Change this
  content: `
Dear [Her Name],

Happy birthday to the most amazing person...

Love,
[Your Name]
  `  // ← Change this
};
```

### Edit Slides (`src/config/slides.ts`)
```typescript
export const slidesConfig = [
  {
    id: '1',
    imageUrl: '/slides/slide1.jpg',     // ← Must match filename
    caption: 'Our first adventure ❤️'   // ← Change this
  },
  // Add more slides by copying this block
];
```

### Edit Gifts (`src/config/gifts.ts`)
```typescript
export const giftsConfig = {
  title: 'Choose Your Surprise!',
  prizes: [
    {
      id: '1',
      title: 'Dinner Date',              // ← Change this
      message: `Let's go to...`,         // ← Change this
      imageUrl: '/gifts/gift1.jpg'       // ← Must match filename
    },
    // Add more prizes by copying this block
  ]
};
```

---

## 🔄 Workflow

```
1. Add images to public/slides/ and public/gifts/
   ↓
2. Add music to public/audio/background.mp3
   ↓
3. Edit src/config/letter.ts
   ↓
4. Edit src/config/slides.ts
   ↓
5. Edit src/config/gifts.ts
   ↓
6. Test: npm run dev
   ↓
7. Deploy: npx vercel --prod
   ↓
8. Share the link! 🎉
```

---

## 💡 Pro Tips

1. **Image Names:** Use simple names like `slide1.jpg`, not `My Photo (1).jpg`
2. **File Paths:** Always start with `/` like `/slides/slide1.jpg`
3. **Formatting:** Use `**bold**` and `*italic*` in any text field
4. **Emojis:** Just paste them directly! ❤️💕✨
5. **Testing:** Always run `npm run dev` before deploying

---

## ✅ Final Checklist

Before deploying, verify:

- [ ] All image files are in correct folders
- [ ] Image filenames match exactly in config files
- [ ] Background music is named `background.mp3`
- [ ] All config files have your personal content
- [ ] Tested locally and everything works
- [ ] Ready to deploy!

---

**Need help? Check `QUICK_START.md` for detailed instructions!**
