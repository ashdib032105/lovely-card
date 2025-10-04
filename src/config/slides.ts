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
    caption: 'Sayang is pretty gurl❤️'
  },
  {
    id: '2',
    imageUrl: '/slides/slide2.jpg',
    caption: ' Sayang cute + stress moment but still keep strong...my hardwork gurl'
  },
  {
    id: '3',
    imageUrl: '/slides/slide3.jpg',
    caption: 'Your smile make ebby *flutter*, your smile make ebby extremely *happy*💕'
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
