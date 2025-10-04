import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore';
import { getDb } from './firebase';

// Types
export interface CardData {
  id: string;
  greeting: {
    title: string;
    message: string;
    buttonText: string;
  };
  letter: {
    title: string;
    content: string;
  };
  slides: Array<{
    id: string;
    imageUrl: string;
    caption: string;
  }>;
  quiz: {
    title: string;
    passingScore: number;
    enableScoring: boolean;
    questions: Array<{
      id: string;
      question: string;
      hasCorrectAnswer: boolean;
      answers: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>;
    }>;
  };
  gifts: {
    pageTitle: string;
    prizes: Array<{
      id: string;
      title: string;
      message: string;
      imageUrl?: string;
    }>;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GeneratedLinkData {
  slug: string;
  cardId: string;
  fullUrl: string;
  createdAt: Timestamp;
  expiryDate: Timestamp | null;
  views: number;
  isActive: boolean;
}

// Collection references
const CARDS_COLLECTION = 'cards';
const LINKS_COLLECTION = 'links';

/**
 * Save or update card data
 */
export async function saveCardData(cardId: string, data: Partial<CardData>): Promise<void> {
  const cardRef = doc(getDb(), CARDS_COLLECTION, cardId);
  
  const cardData = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Check if document exists
  const cardSnap = await getDoc(cardRef);
  
  if (cardSnap.exists()) {
    // Update existing card
    await updateDoc(cardRef, cardData);
  } else {
    // Create new card
    await setDoc(cardRef, {
      ...cardData,
      id: cardId,
      createdAt: serverTimestamp(),
    });
  }
}

/**
 * Get card data by ID
 */
export async function getCardData(cardId: string): Promise<CardData | null> {
  const cardRef = doc(getDb(), CARDS_COLLECTION, cardId);
  const cardSnap = await getDoc(cardRef);
  
  if (cardSnap.exists()) {
    return cardSnap.data() as CardData;
  }
  
  return null;
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const linksRef = collection(getDb(), LINKS_COLLECTION);
  const q = query(linksRef, where('slug', '==', slug), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.empty;
}

/**
 * Generate and save a custom link
 */
export async function generateCustomLink(
  cardId: string,
  slug: string,
  expiryDate: Date | null = null
): Promise<GeneratedLinkData> {
  // Check if slug is available
  const available = await isSlugAvailable(slug);
  if (!available) {
    throw new Error('Slug is already taken');
  }

  const linkId = slug; // Use slug as document ID for easy lookup
  const linkRef = doc(getDb(), LINKS_COLLECTION, linkId);
  
  const linkData: Omit<GeneratedLinkData, 'createdAt'> & { createdAt: any } = {
    slug,
    cardId,
    fullUrl: `lovelycard.me/${slug}`,
    createdAt: serverTimestamp(),
    expiryDate: expiryDate ? Timestamp.fromDate(expiryDate) : null,
    views: 0,
    isActive: true,
  };

  await setDoc(linkRef, linkData);

  return {
    ...linkData,
    createdAt: Timestamp.now(), // Return current timestamp for immediate use
  };
}

/**
 * Get link data by slug
 */
export async function getLinkBySlug(slug: string): Promise<GeneratedLinkData | null> {
  const linkRef = doc(getDb(), LINKS_COLLECTION, slug);
  const linkSnap = await getDoc(linkRef);
  
  if (linkSnap.exists()) {
    const data = linkSnap.data() as GeneratedLinkData;
    
    // Check if link is expired
    if (data.expiryDate && data.expiryDate.toDate() < new Date()) {
      return null; // Link expired
    }
    
    return data;
  }
  
  return null;
}

/**
 * Increment view count for a link
 */
export async function incrementLinkViews(slug: string): Promise<void> {
  const linkRef = doc(getDb(), LINKS_COLLECTION, slug);
  await updateDoc(linkRef, {
    views: increment(1),
  });
}

/**
 * Get card data by slug (for public viewing)
 */
export async function getCardBySlug(slug: string): Promise<CardData | null> {
  const linkData = await getLinkBySlug(slug);
  
  if (!linkData) {
    return null;
  }
  
  // Increment view count
  await incrementLinkViews(slug);
  
  // Get card data
  return await getCardData(linkData.cardId);
}

/**
 * Deactivate a link
 */
export async function deactivateLink(slug: string): Promise<void> {
  const linkRef = doc(getDb(), LINKS_COLLECTION, slug);
  await updateDoc(linkRef, {
    isActive: false,
  });
}

/**
 * Get all links for a card
 */
export async function getCardLinks(cardId: string): Promise<GeneratedLinkData[]> {
  const linksRef = collection(getDb(), LINKS_COLLECTION);
  const q = query(linksRef, where('cardId', '==', cardId), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data() as GeneratedLinkData);
}
