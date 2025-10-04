# 🚀 Deployment Guide

## Quick Deploy to Vercel (Recommended - FREE)

### Option 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy (run from project root)
vercel --prod
```

Follow the prompts:
1. Login to Vercel (creates account if needed)
2. Confirm project settings
3. Get your live URL! 🎉

**Time: ~2 minutes**

---

### Option 2: Vercel Web Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login (free)
3. Click "Add New Project"
4. Import your GitHub repo (or upload folder)
5. Click "Deploy"
6. Get your live URL! 🎉

**Time: ~5 minutes**

---

## Alternative: Netlify (Also FREE)

### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

---

### Using Netlify Drag & Drop

1. Build your project:
   ```bash
   npm run build
   ```

2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)

3. Drag the `.next` folder to the upload area

4. Get your live URL! 🎉

---

## Before Deploying - Final Checklist

- [ ] All images added to `public/slides/` and `public/gifts/`
- [ ] Background music added to `public/audio/background.mp3`
- [ ] All config files edited with your content
- [ ] Tested locally with `npm run dev`
- [ ] Everything looks good!

---

## Environment Variables (Optional)

If you need any environment variables, create `.env.local`:

```bash
# Example (not needed for static setup)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Custom Domain (Optional)

### On Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS instructions

### On Netlify:
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS instructions

---

## Build Commands Reference

```bash
# Development (local testing)
npm run dev

# Production build
npm run build

# Start production server locally
npm start
```

---

## Troubleshooting

### Build fails?
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Images not loading after deploy?
- Check that image paths start with `/` (e.g., `/slides/slide1.jpg`)
- Verify images are in the `public/` folder
- Check filenames match exactly (case-sensitive)

### Music not playing?
- Verify file is named `background.mp3`
- Check file is in `public/audio/`
- Some browsers block autoplay - user needs to interact first

---

## 🎯 Recommended: Vercel

**Why Vercel?**
- ✅ Made for Next.js
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero configuration
- ✅ Free tier is generous
- ✅ Deploy in 2 minutes

---

## Quick Deploy Command

```bash
npx vercel --prod
```

That's it! 🎉
