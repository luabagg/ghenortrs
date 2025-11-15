# Assets Directory

## 📁 Directory Structure

```
public/
├── images/
│   ├── instagram/           # Instagram feed images (6 posts)
│   ├── brakes-placeholder.jpg
│   ├── cranks-placeholder.jpg
│   ├── components-placeholder.jpg
│   └── accessories-placeholder.jpg
├── videos/
│   ├── hero-downhill.mp4    # Main hero background video
│   ├── products-showcase.mp4
│   └── manufacturing.mp4
└── logo.png                 # Company logo
```

## 🎥 Video Requirements

### Hero Video (`videos/hero-downhill.mp4`)
- **Recommended Size:** 1920x1080 (Full HD)
- **Duration:** 10-30 seconds (will loop)
- **Format:** MP4 (H.264 codec)
- **File Size:** < 10MB (compressed)
- **Content:** Action downhill footage, brand showcase

### Product/Manufacturing Videos
- **Size:** 1280x720 or higher
- **Format:** MP4
- **Keep file sizes reasonable** for web loading

## 🖼️ Image Requirements

### Logo
- **Format:** PNG with transparent background
- **Size:** 500x500px or higher (square)
- **Use:** Navbar, Footer, Social sharing

### Product Images
- **Format:** JPG or PNG
- **Size:** 800x600px or higher
- **Aspect Ratio:** 4:3 or 16:9
- **Quality:** High quality, well-lit product photos

### Instagram Images
- **Format:** JPG
- **Size:** 1080x1080px (square)
- **Quantity:** 6 posts for grid display
- **Naming:** `post1.jpg`, `post2.jpg`, etc.

## 📤 Upload Methods

### Option 1: Direct Upload (For Development)
Simply drop your files into the appropriate folders.

### Option 2: AWS S3 (Recommended for Production)
1. Upload assets to S3 bucket
2. Update image/video URLs in components:
   - `src/sections/Hero.jsx` - Hero video
   - `src/sections/About.jsx` - Feature videos
   - `src/sections/Products.jsx` - Product images
   - `src/sections/Instagram.jsx` - Instagram images
   - `src/components/Navbar.jsx` - Logo
   - `src/components/Footer.jsx` - Logo

Example:
```jsx
<img src="https://your-bucket.s3.amazonaws.com/logo.png" alt="Logo" />
```

### Option 3: CDN (Cloudflare, Cloudinary, etc.)
Upload to your preferred CDN and update URLs.

## 🎨 Brand Guidelines

- **Primary Color:** #e81414 (Red)
- **Background:** #000000 (Black)
- **Logo:** Should work on both black and white backgrounds
- **Imagery:** High-energy, action-focused, Brazilian spirit

## ⚡ Optimization Tips

### For Videos:
```bash
# Use ffmpeg to compress videos
ffmpeg -i input.mp4 -vcodec h264 -acodec mp2 output.mp4
```

### For Images:
- Use tools like TinyPNG, ImageOptim
- Target < 200KB per image for web
- Consider WebP format for better compression

## 📝 Next Steps

1. Add your logo to `/public/logo.png`
2. Add hero video to `/public/videos/hero-downhill.mp4`
3. Add product images to `/public/images/`
4. Add 6 Instagram posts to `/public/images/instagram/`
5. Update component files to use your actual assets
6. Test loading speeds and optimize if needed

Need help? Check the main README.md for detailed instructions!
