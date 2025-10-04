---
trigger: always_on
---

# Product Requirements Document (PRD) – Interactive Birthday Card

---

## Purpose
The purpose of this project is to create an **interactive digital birthday card** web app dedicated to the recipient (your girlfriend). The experience is designed to be **romantic, playful, and memorable**, combining multimedia (music, images, confetti effects) with interactivity (slides, quiz, and mystery gift box). The card will be private and personalized, accessed through a unique secure link.

---

## Key Features

### 🎶 Audio & Greeting Flow
- Auto-start romantic background music when recipient begins the experience.
- Personalized greeting screen displaying recipient’s name and a warm introduction.

### 💌 Love Letter
- Main letter section with markdown support for formatting.
- Confetti animation toggle to add celebratory feel.
- Support for text + images.

### 🖼️ Romantic Slides
- Series of images with captions (romantic words, shared memories).
- Navigation via swipe/tap arrows.
- Progress indicators for slides.

### ❓ Quiz Section
- Fun multiple-choice questions.
- Option to unlock prize only if correct answers reach a threshold.
- Configurable question count and answer validation.

### 🎁 Mystery Gift Box
- Display multiple mystery boxes.
- Recipient selects one box → reveal romantic prize message or image.
- Confetti and animation during reveal.

### 🎉 Outro
- Thank-you message with closing note.
- Music fade-out for smooth ending.

### 🔑 Admin Panel (for creator)
- Secure login with Firebase Auth.
- CRUD operations for:
  - Card info (recipient name, greeting, letter)
  - Slides (upload images, add captions)
  - Quiz questions and answers
  - Prizes (mystery box content)
- Link generator with expiry date.
- Preview mode to test before sharing.

### 📊 Analytics (Basic)
- Track when the card is opened.
- Track completion status.
- Track prize selected.

---

## Tech Stack

### Frontend
- **Next.js 15.5.4** (React 18, App Router) – for routing, rendering, and API integration.
- **TypeScript** – for type safety.
- **TailwindCSS + DaisyUI** – for styling, pastel/romantic theme.
- **Framer Motion** – for animations and transitions.
- **canvas-confetti** – for confetti bursts.
- **Zustand** – for state management.

### Backend
- **Next.js API Routes** – for business logic and recipient link validation.
- **Firebase Firestore** – store card data, slides, questions, prizes, and analytics events.
- **Firebase Auth** – admin authentication.
- **Firebase Storage** – hosting images, audio files, and prize graphics.
- **Firebase Analytics** – optional, for tracking events.

### Hosting & Deployment
- **Replit** – hosting the Next.js frontend and API routes.
- **Firebase** – backend services (Firestore, Auth, Storage).

### Optional Tools
- **Sentry** – for error tracking.
- **Playwright** – for end-to-end testing.
- **Lighthouse CI** – for performance testing.

---

## Summary
This product is a **single-recipient, interactive digital card system** with:
- A flow of **greeting → letter → slides → quiz → prize reveal → outro**.
- Admin configuration for customizing the experience.
- Secure tokenized access so only the recipient can view it.
- Built using **Next.js + Firebase** for scalability and simplicity.

This ensures a seamless, mobile-friendly, and delightful surprise experience.
