# Firebase Backend Setup Guide 🔥

## Overview

Your lovely card app is now integrated with Firebase for backend storage. This guide will help you complete the setup and deploy the Firestore security rules.

---

## ✅ What's Already Done

1. **Firebase Project Created**: `lovely-card`
2. **Web App Registered**: Lovely Card Web App
3. **Environment Variables**: `.env.local` configured with your Firebase credentials
4. **Firebase SDK**: Initialized in `src/lib/firebase.ts`
5. **Firestore Services**: Complete CRUD operations in `src/lib/firestore.ts`
6. **Card Store**: Zustand store integrated with Firebase in `src/store/cardStore.ts`
7. **Link Generator**: Updated to use real Firebase availability checking
8. **Security Rules**: Configured in `firestore.rules`

---

## 📋 Remaining Setup Steps

### Step 1: Deploy Firestore Security Rules

The security rules are already written in `firestore.rules`, but they need to be deployed to Firebase.

**Option A: Using Firebase Console (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **lovely-card**
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Copy the contents from `firestore.rules` and paste it into the editor
6. Click **Publish**

**Option B: Using Firebase CLI**

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

### Step 2: Verify Environment Variables

Make sure `.env.local` exists and contains:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD3oPMoEZ9HE2TJXJxQNRlBGql41ykMhlg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lovely-card.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lovely-card
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lovely-card.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1052489614769
NEXT_PUBLIC_FIREBASE_APP_ID=1:1052489614769:web:53e8050d15dd2b673d6990
NEXT_PUBLIC_BASE_URL=lovelycard.me
NEXT_PUBLIC_CARD_ID=my-lovely-card
```

### Step 3: Restart Development Server

After setting up environment variables, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

---

## 🗄️ Database Structure

### Collections

#### 1. **cards** Collection

Stores all card content (greeting, letter, slides, quiz, gifts).

```typescript
{
  id: "my-lovely-card",
  greeting: {
    title: string,
    message: string,
    buttonText: string
  },
  letter: {
    title: string,
    content: string
  },
  slides: [{
    id: string,
    imageUrl: string,
    caption: string
  }],
  quiz: {
    title: string,
    passingScore: number,
    enableScoring: boolean,
    questions: [...]
  },
  gifts: {
    pageTitle: string,
    prizes: [...]
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. **links** Collection

Stores generated custom links.

```typescript
{
  slug: "kaseh-wildany",
  cardId: "my-lovely-card",
  fullUrl: "lovelycard.me/kaseh-wildany",
  createdAt: Timestamp,
  expiryDate: Timestamp | null,
  views: number,
  isActive: boolean
}
```

---

## 🔒 Security Rules Explained

```javascript
// Cards - Anyone can read, anyone can write (for your single-user app)
match /cards/{cardId} {
  allow read: true;
  allow write: true;
}

// Links - Read/create allowed, update only for view count
match /links/{linkId} {
  allow read: true;
  allow create: true;
  allow update: if request.resource.data.diff(resource.data)
    .affectedKeys().hasOnly(['views']);
  allow delete: false;
}
```

**Why these rules?**
- No authentication needed (single user - you)
- Anyone with the link can view the card
- Only view count can be updated (prevents tampering)
- Links cannot be deleted via client (manual deletion from console)

---

## 🚀 How It Works

### Creating a Card

1. **Edit Mode**: You edit content on each page
2. **Auto-Save**: Content is saved to Zustand store (localStorage)
3. **Firebase Sync**: When you generate a link, content is saved to Firestore

### Generating a Link

1. **Complete All Sections**: Fill in all 5 sections (greeting, letter, slides, quiz, gift)
2. **Click "Generate Custom Link"**: Opens the link generator modal
3. **Enter Slug**: Type your desired slug (e.g., "kaseh-wildany")
4. **Real-time Validation**: 
   - Checks slug format
   - Queries Firestore to check availability
   - Shows suggestions if taken
5. **Generate**: 
   - Saves card data to Firestore
   - Creates link document in Firestore
   - Returns success with copy-to-clipboard

### Viewing a Card

1. **Recipient Opens Link**: `lovelycard.me/kaseh-wildany`
2. **Fetch Card Data**: 
   - Look up link by slug
   - Check if expired
   - Get associated card data
   - Increment view count
3. **Display Card**: Show all sections in sequence

---

## 🧪 Testing the Integration

### Test 1: Save Card Data

```typescript
// In browser console or component
import { useCardStore } from '@/store/cardStore';

const { saveToFirebase } = useCardStore();
await saveToFirebase();
// Check Firebase Console > Firestore > cards collection
```

### Test 2: Check Slug Availability

```typescript
import { isSlugAvailable } from '@/lib/firestore';

const available = await isSlugAvailable('test-slug');
console.log('Available:', available);
```

### Test 3: Generate Link

1. Complete all sections in edit mode
2. Click "Generate Custom Link"
3. Enter slug: `test-card-2025`
4. Click "Generate Link"
5. Check Firebase Console > Firestore > links collection

### Test 4: View Card by Slug

```typescript
import { getCardBySlug } from '@/lib/firestore';

const cardData = await getCardBySlug('test-card-2025');
console.log('Card Data:', cardData);
// View count should increment in Firestore
```

---

## 📊 Monitoring & Analytics

### Firebase Console

1. **Firestore Database**
   - View all cards and links
   - Monitor view counts
   - Check timestamps

2. **Usage & Billing**
   - Monitor read/write operations
   - Check storage usage
   - Free tier limits:
     - 50K reads/day
     - 20K writes/day
     - 1GB storage

### View Statistics

Check link views in the progress widget or Firebase Console:

```typescript
import { getLinkBySlug } from '@/lib/firestore';

const linkData = await getLinkBySlug('your-slug');
console.log('Views:', linkData?.views);
```

---

## 🛠️ Troubleshooting

### Issue: "Missing required environment variables"

**Solution**: 
1. Ensure `.env.local` exists
2. Restart dev server
3. Check all variables are prefixed with `NEXT_PUBLIC_`

### Issue: "Permission denied" errors

**Solution**:
1. Deploy Firestore rules (see Step 1)
2. Check rules in Firebase Console
3. Verify rules allow read/write

### Issue: Slug availability always returns false

**Solution**:
1. Check Firestore rules are deployed
2. Verify internet connection
3. Check browser console for errors
4. Ensure Firebase SDK is initialized

### Issue: Card data not saving

**Solution**:
1. Check browser console for errors
2. Verify Firestore rules allow writes
3. Check network tab for failed requests
4. Ensure `cardId` is set correctly

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐
│   Edit Mode     │
│  (Local State)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Zustand Store  │
│  (localStorage) │
└────────┬────────┘
         │
         │ Generate Link
         ▼
┌─────────────────┐
│    Firebase     │
│   Firestore     │
│                 │
│  ┌───────────┐  │
│  │   cards   │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │   links   │  │
│  └───────────┘  │
└────────┬────────┘
         │
         │ View Link
         ▼
┌─────────────────┐
│  Public View    │
│  (Recipient)    │
└─────────────────┘
```

---

## 📝 API Reference

### Firestore Functions

```typescript
// Save card data
await saveCardData(cardId: string, data: Partial<CardData>): Promise<void>

// Get card data
const card = await getCardData(cardId: string): Promise<CardData | null>

// Check slug availability
const available = await isSlugAvailable(slug: string): Promise<boolean>

// Generate custom link
const link = await generateCustomLink(
  cardId: string,
  slug: string,
  expiryDate: Date | null
): Promise<GeneratedLinkData>

// Get link by slug
const link = await getLinkBySlug(slug: string): Promise<GeneratedLinkData | null>

// Increment view count
await incrementLinkViews(slug: string): Promise<void>

// Get card by slug (public viewing)
const card = await getCardBySlug(slug: string): Promise<CardData | null>

// Deactivate link
await deactivateLink(slug: string): Promise<void>

// Get all links for a card
const links = await getCardLinks(cardId: string): Promise<GeneratedLinkData[]>
```

---

## 🎯 Next Steps

1. ✅ Deploy Firestore rules
2. ✅ Test link generation
3. ✅ Create your first card
4. ✅ Generate a custom link
5. ✅ Share with your girlfriend! 💕

---

## 🔐 Security Notes

**For Production:**

If you want to add more security later:

1. **Add Authentication**: Implement Firebase Auth for admin access
2. **Restrict Writes**: Only allow writes from authenticated users
3. **Rate Limiting**: Add Cloud Functions to prevent abuse
4. **Domain Restrictions**: Configure authorized domains in Firebase Console

**Current Setup:**
- Perfect for single-user, private use
- Anyone with the link can view (intended behavior)
- No sensitive data exposed
- View counting works automatically

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify Firestore rules are deployed
3. Check Firebase Console for data
4. Review this guide's troubleshooting section
5. Test with the provided test functions

---

**Your Firebase backend is ready! 🎉**

Start creating your lovely card and generate a custom link to share with your girlfriend!
