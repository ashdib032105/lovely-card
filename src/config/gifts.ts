// 🎁 GIFTS/PRIZES CONFIGURATION
// Drop your gift images in: public/gifts/

export interface PrizeConfig {
  id: string;
  title: string;
  message: string;   // Supports **bold** and *italic*
  imageUrl?: string; // Path relative to public folder
}

export interface GiftsConfig {
  title: string;
  prizes: PrizeConfig[];
}

export const giftsConfig: GiftsConfig = {
  title: 'Your Special Gift 🎁',
  prizes: [
    {
      id: '1',
      title: 'Your Birthday Surprise',
      message: `Happy Birthday Sayang! 🎂✨

I have prepared something **special** just for you! 

Your present is available when you home after coming back from Terengganu...hehehe! 

I hope you love it as much as I love you! 💕

With all my love,
**Ebby**`,
      imageUrl: '/gifts/gift1.jpg'
    }
  ]
};

// 📝 HOW TO EDIT:
// 1. Add your gift images to: public/gifts/
// 2. Update imageUrl to match your filename (e.g., '/gifts/my-gift.jpg')
// 3. Edit title and message for each prize
// 4. Use **text** for bold, *text* for italic
// 5. To add more prizes, copy a prize object and paste below
