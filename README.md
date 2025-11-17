# GhenoRTRS Homepage

Modern, high-performance homepage for GhenoRTRS - Specialists in downhill bike parts from South Brazil.

## 🎨 Tech Stack

- **React** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Heroicons** - Icons
- **Express** - API server for B2B form
- **Nodemailer** - Email handling

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your email credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3001
```

**For Gmail:**
1. Go to Google Account > Security > 2-Step Verification
2. Create an "App Password" for Mail
3. Use that password in `EMAIL_PASS`

### 3. Run Development Servers

```bash
# Run both frontend and backend
npm run dev:all

# Or run separately:
npm run dev      # Frontend only (http://localhost:5173)
npm run server   # Backend API only (http://localhost:3001)
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
ghenortrs/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation with mobile menu
│   │   └── Footer.jsx       # Footer with contact info
│   ├── sections/
│   │   ├── Hero.jsx         # Hero section with video background
│   │   ├── About.jsx        # About section with features
│   │   ├── Products.jsx     # Product showcase
│   │   ├── B2BContact.jsx   # B2B contact form
│   │   └── Instagram.jsx    # Instagram feed section
│   ├── App.jsx              # Main app component
│   ├── index.css            # Tailwind + custom styles
│   └── main.jsx             # Entry point
├── public/
│   ├── images/              # Product images (TODO: add your images)
│   │   ├── instagram/       # Instagram feed images
│   │   └── ...
│   └── videos/              # Video files (TODO: add your videos)
│       ├── hero-downhill.mp4
│       └── ...
├── server.js                # Express API server
├── .env                     # Environment variables (create this)
└── tailwind.config.js       # Tailwind config with brand colors
```

## 🎥 Adding Your Assets

### Logo

Replace the logo placeholder in:
- `src/components/Navbar.jsx` (line ~24)
- `src/components/Footer.jsx` (line ~96)

**Option 1: Direct Image**
```jsx
<img src="/logo.png" alt="GhenoRTRS" className="w-12 h-12" />
```

**Option 2: AWS S3 / Cloud Storage**
```jsx
<img
  src="https://your-bucket.s3.amazonaws.com/logo.png"
  alt="GhenoRTRS"
  className="w-12 h-12"
/>
```

### Hero Video

Add your downhill video to `/public/videos/hero-downhill.mp4`

Then uncomment in `src/sections/Hero.jsx` (line ~12):
```jsx
<video autoPlay loop muted playsInline className="video-background">
  <source src="/videos/hero-downhill.mp4" type="video/mp4" />
</video>
```

### Product Images

Add images to `/public/images/` and update in `src/sections/Products.jsx`:
```jsx
image: '/images/brakes.jpg'  // Replace placeholder
```

### Instagram Feed

**Option 1: Manual (Current)**
- Add images to `/public/images/instagram/`
- Update `src/sections/Instagram.jsx`

**Option 2: Instagram API (Future)**
- Integrate Instagram Graph API
- Fetch posts dynamically

## 🎨 Brand Colors

Configured in `tailwind.config.js`:

```js
colors: {
  brand: {
    red: '#e81414',    // Primary brand red
    black: '#000000',  // Background
  },
}
```

Usage:
```jsx
<div className="bg-brand-red text-white">...</div>
<button className="btn-primary">...</button>  // Pre-styled button
```

## 📧 Email Configuration

The B2B contact form sends emails via Nodemailer. Configure in `server.js`:

### Current Setup (Gmail)

Works out of the box with Gmail. Just set `.env` variables.

### Using Another Email Service

Edit `server.js` (line ~15):

```js
const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

**Popular Services:**
- Gmail: `service: 'gmail'` (default)
- Outlook: `service: 'hotmail'`
- Custom SMTP: Use `host`, `port`, `secure`

## 🔧 Customization

### Update Contact Info

Edit `src/components/Footer.jsx`:
- Email: contato@ghenortrs.com.br
- Phone: Add your actual phone number (line ~149)
- WhatsApp: Update link (line ~121)

### Add More Sections

Create new section in `src/sections/`:

```jsx
// src/sections/Testimonials.jsx
export default function Testimonials() {
  return <section>...</section>
}
```

Import in `src/App.jsx`:
```jsx
import Testimonials from './sections/Testimonials';

// Add to App
<Testimonials />
```

### Change Animations

All animations use Framer Motion. Example:

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content here
</motion.div>
```

## 📦 Deployment

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in settings
4. Deploy!

**Note:** For the API to work, you'll need to deploy the backend separately or use Vercel Serverless Functions.

### Option 2: Netlify

Similar to Vercel. Backend needs separate deployment.

### Option 3: VPS/Dedicated Server

```bash
# Build frontend
npm run build

# Serve with nginx/apache
# Run backend with PM2:
pm2 start server.js --name ghenortrs-api
pm2 save
```

## 🌐 Domain Setup

Point your domain `ghenortrs.com.br` to your hosting:

1. **Vercel/Netlify:** Follow their DNS instructions
2. **VPS:** Point A record to your server IP

```
Type    Name    Value
A       @       YOUR_SERVER_IP
A       www     YOUR_SERVER_IP
```

## 🛠️ B2B Workflow Recommendation

When B2B form is submitted:

1. ✅ Email sent to `contato@ghenortrs.com.br`
2. ✅ Auto-reply sent to customer
3. 📋 You review lead (CNPJ, volume, etc.)
4. 💰 Create custom quote in Bling (Price Table 2)
5. 📧 Send proposal via email
6. ✅ Convert to customer in Bling
7. 📄 Generate NFe from Bling

### Bling Integration (Future Enhancement)

Consider adding:
- Direct integration with Bling API
- Auto-create B2B leads in Bling
- Sync product catalog from Bling

## 📝 TODO / Future Enhancements

- [ ] Add logo and brand assets
- [ ] Upload hero video
- [ ] Add product images
- [ ] Connect Instagram feed via API
- [ ] Add blog section for SEO
- [ ] Integrate Google Analytics
- [ ] Add Meta Pixel for ads
- [ ] Create B2B product catalog PDF
- [ ] Bling API integration
- [ ] Multi-language support (EN/PT)
- [ ] Add testimonials section
- [ ] Implement product filters

## 🐛 Troubleshooting

### Tailwind styles not working

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run dev
```

### Email not sending

- Check `.env` file exists with correct credentials
- For Gmail: ensure 2FA is enabled and using App Password
- Check server logs: `npm run server`

### Build errors

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📄 License

Proprietary - GhenoRTRS © 2025

## 📞 Support

For questions or issues:
- Email: contato@ghenortrs.com.br
- Instagram: [@gheno_rtrs](https://www.instagram.com/gheno_rtrs)
