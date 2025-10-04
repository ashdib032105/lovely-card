# 🎁 Gift Images Folder

## Drop your gift/prize images here!

### Naming Convention:
- `gift1.jpg` - First gift
- `gift2.jpg` - Second gift
- `gift3.jpg` - Third gift
- etc.

### Supported Formats:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

### Recommended Image Size:
- **Width:** 800px - 1200px
- **Height:** 600px - 900px
- **Aspect Ratio:** 16:9 or 4:3

### After adding images:
1. Update `src/config/gifts.ts` with your image filenames
2. Add title and message for each prize
3. Run `npm run dev` to see your changes

---

**Example:**
If you add `gift1.jpg` here, reference it in config as:
```typescript
imageUrl: '/gifts/gift1.jpg'
```
