# 📸 Instagram API Integration Setup

This guide will help you connect your Instagram account (@gheno_rtrs) to your website so posts automatically update.

## 🎯 What You'll Get

- Automatic updates when you post on Instagram
- Shows your latest 6 posts
- Caches for 1 hour (avoids API limits)
- Falls back to placeholder images if API fails
- Free forever!

---

## 🚀 Step-by-Step Setup (15 minutes)

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click **"Create App"**
3. Choose **"Other"** as use case
4. Choose **"Business"** as app type
5. Fill in:
   - **App Name:** GhenoRTRS Website
   - **App Contact Email:** contato@ghenortrs.com.br
6. Click **"Create App"**

### Step 2: Add Instagram Basic Display

1. In your new app dashboard, scroll down to **"Add Products"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** in the popup
4. In the left sidebar, go to **"Basic Display" > "Basic Display"**

### Step 3: Configure Basic Display

1. Scroll down to **"User Token Generator"**
2. Click **"Add or Remove Instagram Testers"**
3. Click **"Add Instagram Testers"**
4. Enter your Instagram username: `gheno_rtrs`
5. Open Instagram on your phone
6. Go to **Settings > Apps and Websites > Tester Invites**
7. **Accept the invite** from your Facebook app

### Step 4: Generate Access Token

1. Go back to Facebook Developers
2. In **"User Token Generator"** section
3. Click **"Generate Token"** next to your Instagram account
4. Click **"Continue"** on the permissions popup
5. **Copy the Access Token** (long string of random characters)
   - ⚠️ Save this somewhere safe! You'll need it in the next step

### Step 5: Get Long-Lived Access Token (60 days)

The token you just got expires in 1 hour. Let's convert it to a 60-day token:

1. Open this URL in your browser (replace `YOUR_APP_ID`, `YOUR_APP_SECRET`, and `YOUR_SHORT_TOKEN`):

```
https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=YOUR_SHORT_TOKEN
```

**Where to find:**
- `YOUR_APP_SECRET`: Facebook App Dashboard > Settings > Basic > App Secret (click "Show")
- `YOUR_SHORT_TOKEN`: The token you copied in Step 4

2. You'll get a JSON response like:
```json
{
  "access_token": "LONG_ACCESS_TOKEN_HERE",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

3. **Copy the `access_token` value** - this is your long-lived token!

### Step 6: Add Token to Your Project

1. Create a `.env` file in your project root (if it doesn't exist):
```bash
cp .env.example .env
```

2. Open `.env` and add your token:
```env
VITE_INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
```

3. Save the file

### Step 7: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev:all
```

That's it! Your Instagram feed should now show real posts from @gheno_rtrs! 🎉

---

## 🔄 Token Refresh (Every 60 Days)

Long-lived tokens expire after 60 days. Here's how to refresh:

### Option 1: Manual Refresh (Simple)

Repeat Steps 4-6 every 60 days.

### Option 2: Auto-Refresh (Advanced)

Before the token expires (within 60 days), make this API call:

```
https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_CURRENT_TOKEN
```

You'll get a new token valid for another 60 days.

**Pro tip:** Set a calendar reminder for 50 days from now to refresh the token.

---

## 🐛 Troubleshooting

### Posts not showing up?

1. **Check the browser console** (F12 > Console tab)
2. Look for errors related to Instagram

### "Invalid OAuth access token"?

- Your token expired or is incorrect
- Generate a new token (Step 4-6)

### "Instagram API error: 400"?

- Make sure you accepted the tester invite on Instagram
- Wait a few minutes and try again

### Still showing placeholder images?

- Check `.env` file has `VITE_INSTAGRAM_ACCESS_TOKEN=...`
- Make sure the variable starts with `VITE_` (required for Vite)
- Restart dev server after changing `.env`

### Rate limit errors?

- The app caches posts for 1 hour
- Instagram allows 200 requests per hour per user
- You're well within limits

---

## 📊 How It Works

1. **First Load:** Fetches latest 6 posts from Instagram API
2. **Caching:** Saves posts in browser for 1 hour
3. **Subsequent Loads:** Uses cached posts (no API call)
4. **After 1 Hour:** Fetches fresh posts
5. **If API Fails:** Shows your placeholder product images

---

## 🎨 Customization

### Change number of posts

Edit `src/sections/Instagram.jsx`:

```jsx
const { posts, loading, error } = useInstagram(accessToken, 12); // Change 6 to 12
```

### Change cache duration

Edit `src/hooks/useInstagram.js`:

```js
const oneHour = 60 * 60 * 1000; // Change to 2 hours: 2 * 60 * 60 * 1000
```

### Update placeholder images

Replace images in `/public/images/brake-disc-1.jpg` and `/public/images/brake-disc-2.jpg`

---

## 📱 Testing

1. Post something new on Instagram
2. Wait 2-3 minutes (Instagram processes posts)
3. Clear your browser cache (Ctrl+Shift+Delete)
4. Refresh your website
5. New post should appear! ✨

---

## 🔒 Security Notes

- **Access tokens are sensitive** - never commit `.env` to git
- `.env` is already in `.gitignore` (you're safe)
- Tokens are read-only - can only fetch your public posts
- No one can post or delete using this token

---

## 📚 Additional Resources

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Token Refresh Guide](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens)

---

## 🆘 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Review the console for errors
3. Make sure you completed all steps in order
4. Try generating a new token from scratch

---

Happy posting! 📸🚵‍♂️
