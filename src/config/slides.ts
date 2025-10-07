// 🖼️ SLIDES CONFIGURATION
// Drop your images in: public/slides/
// Supported formats: .jpg, .png, .gif, .webp

export interface SlideConfig {
  id: string;
  imageUrl: string; // Path relative to public folder (e.g., '/slides/slide1.jpg')
  caption: string;  // Supports **bold** and *italic* markdown
}

export const slidesConfig: SlideConfig[] = [
  {
    id: '1',
    imageUrl: '/slides/slide1.jpg',
    caption: 'Sayang is a pretty girl ❤️❤️❤️'
  },
  {
    id: '2',
    imageUrl: '/slides/slide2.jpg',
    caption: ' Sayang, my cute yet stressed girl — still standing strong through it all. My hardworking love, you amaze me every day ❤️'
  },
  {
    id: '3',
    imageUrl: '/slides/slide3.jpg',
    caption: 'Your smile makes ebby’s heart flutter💕'
  },
  {
    id: '4',
    imageUrl: '/slides/slide4.jpg',
    caption: 'Together we create **beautiful memories** ✨'
  },
  {
    id: '5',
    imageUrl: '/slides/slide5.jpg',
    caption: 'Forever grateful to have you in my life 💖'
  }
];

// 📝 HOW TO EDIT:
// 1. Add your images to: public/slides/
// 2. Update imageUrl to match your filename (e.g., '/slides/my-photo.jpg')
// 3. Edit captions - use **text** for bold, *text* for italic
// 4. Add more slides by copying the object structure
