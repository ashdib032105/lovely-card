# 🖼️ Slides Images Folder

## Drop your slide images here!

### Naming Convention:
- `slide1.jpg` - First slide
- `slide2.jpg` - Second slide
- `slide3.jpg` - Third slide
- etc.

### Supported Formats:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

### Recommended Image Size:
- **Width:** 1200px - 1920px
- **Height:** 800px - 1080px
- **Aspect Ratio:** 16:9 or 4:3

### After adding images:
1. Update `src/config/slides.ts` with your image filenames
2. Add captions for each slide
3. Run `npm run dev` to see your changes

---

**Example:**
If you add `slide1.jpg` here, reference it in config as:
```typescript
imageUrl: '/slides/slide1.jpg'
```
