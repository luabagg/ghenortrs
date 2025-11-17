# 🛍️ Bling API Integration Setup

This guide will help you connect your Bling account to automatically display product images and descriptions on your website.

## 🎯 What You'll Get

- Product images automatically synced from Bling
- Product names and descriptions
- Automatic updates when you add/edit products in Bling
- Caches for 4 hours (avoids API limits)
- **NO prices displayed** - users click through to Nuvemshop for pricing
- Falls back gracefully if API not configured

---

## 📋 Prerequisites

- Active Bling account
- Products already added to Bling with images
- Admin access to Bling

---

## 🚀 Step-by-Step Setup (10 minutes)

### Step 1: Access Bling API Settings

1. Log in to your Bling account
2. Go to: **Configurações** > **Aplicações** > **API**
3. Or directly: https://www.bling.com.br/configuracoes.php#/aplicacoes

### Step 2: Create API Application

1. Click **"Criar Aplicação"** (Create Application)
2. Fill in the form:
   - **Nome da Aplicação:** GhenoRTRS Website
   - **Tipo:** Choose **"Aplicação Própria"** (Own Application)
   - **Descrição:** Website integration for product catalog
3. Click **"Salvar"** (Save)

### Step 3: Generate API Key (OAuth 2.0)

Bling uses OAuth 2.0. Here's how to get your access token:

1. After creating the application, you'll see:
   - **Client ID**
   - **Client Secret**
2. Copy both values (you'll need them)

3. **Generate Access Token:**

   Open this URL in your browser (replace `YOUR_CLIENT_ID`):
   ```
   https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&state=RANDOM_STRING
   ```

4. **Authorize the application** - Click "Autorizar"

5. You'll be redirected to a URL like:
   ```
   http://localhost/?code=AUTHORIZATION_CODE&state=RANDOM_STRING
   ```

   **Copy the `code` parameter** (after `code=`)

6. **Exchange code for access token:**

   Use curl or Postman to make this request:
   ```bash
   curl -X POST https://www.bling.com.br/Api/v3/oauth/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code" \
     -d "code=AUTHORIZATION_CODE" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET"
   ```

7. You'll get a response like:
   ```json
   {
     "access_token": "YOUR_ACCESS_TOKEN_HERE",
     "token_type": "Bearer",
     "expires_in": 21600,
     "refresh_token": "YOUR_REFRESH_TOKEN"
   }
   ```

8. **Copy the `access_token`** - this is your Bling API key!

### Step 4: Add API Key to Your Project

1. Open your `.env` file (create if it doesn't exist):
```bash
cp .env.example .env
```

2. Add your Bling API key:
```env
BLING_API_KEY=your_access_token_here
```

3. Save the file

### Step 5: Restart Server

```bash
# Stop the server (Ctrl+C if running)
# Start both frontend and backend
npm run dev:all
```

### Step 6: Test the Integration

1. Open your browser to `http://localhost:5173`
2. Navigate to the **Products** section
3. Your Bling products should now display with real images!

---

## 🔄 Token Refresh (Every 6 Hours)

Bling access tokens expire after 6 hours. You need to refresh them:

### Manual Refresh

Use your `refresh_token` from Step 3:

```bash
curl -X POST https://www.bling.com.br/Api/v3/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

You'll get a new `access_token` and `refresh_token`.

### Auto-Refresh (Recommended)

**Option A: Use Long-Lived Tokens**

Bling also offers long-lived tokens that don't expire. Contact Bling support to enable this for your account.

**Option B: Implement Auto-Refresh**

We can add automatic token refresh to the server. Let me know if you'd like me to implement this!

---

## 📸 Product Image Requirements

For best results in your Bling product catalog:

### Image Specifications
- **Format:** JPG or PNG
- **Minimum Size:** 800x800px
- **Recommended:** 1200x1200px
- **Aspect Ratio:** Square (1:1) preferred
- **File Size:** < 2MB per image

### Best Practices
1. **Main Image:** Should be the product on white/transparent background
2. **Additional Images:** Action shots, details, size comparisons
3. **Naming:** Use descriptive names (e.g., "freio-disco-shimano-front.jpg")
4. **Optimization:** Compress images before uploading

---

## 🎨 How It Works

```
1. User visits website
2. Frontend calls /api/bling/products
3. Backend fetches from Bling API v3
4. Returns: name, description, SKU, images
5. Does NOT return: prices
6. Frontend displays products
7. "Ver Produtos" links to Nuvemshop (with pricing)
8. Results cached for 4 hours
```

---

## 🔧 Customization

### Change Cache Duration

Edit `src/hooks/useBling.js`:

```js
const fourHours = 4 * 60 * 60 * 1000; // Change to 2 hours: 2 * 60 * 60 * 1000
```

### Filter Products by Category

Edit `server.js` line 125:

```js
// Only fetch products from specific category
const response = await fetch(
  'https://www.bling.com.br/Api/v3/produtos?pagina=1&limite=100&criterio=1&idCategoria=123',
  ...
);
```

### Limit Number of Products

Edit `server.js` line 125:

```js
// Change limite=100 to limite=20
'https://www.bling.com.br/Api/v3/produtos?pagina=1&limite=20&criterio=1',
```

---

## 🐛 Troubleshooting

### Products not showing up?

1. **Check .env file** - Make sure `BLING_API_KEY` is set
2. **Check server logs** - Look for "Error fetching from Bling"
3. **Verify API key** - Test with curl:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://www.bling.com.br/Api/v3/produtos?limite=1
   ```

### "Bling API key not configured"?

- Make sure `.env` has `BLING_API_KEY=...`
- Restart the server after adding it

### "Bling API error: 401"?

- Your token expired (6 hours)
- Generate a new token (Step 3)
- Or use refresh token

### "Bling API error: 429"?

- You hit the rate limit
- Bling allows 300 requests per minute
- The cache reduces API calls
- Wait 1 minute and try again

### Images not loading?

1. **Check Bling product** - Does it have images?
2. **Check image URLs** - Open browser console, look for image errors
3. **Image permissions** - Make sure images are public in Bling

---

## 🔗 Linking to Nuvemshop

Products link to Nuvemshop using this pattern:

```
https://store.ghenortrs.com.br/produtos/{SKU}
```

### Customize URL Pattern

Edit `src/hooks/useBling.js` line 48:

```js
storeUrl: `https://store.ghenortrs.com.br/produtos/${product.codigo}`,
```

Change to match your Nuvemshop URL structure. Common patterns:
- `/produtos/{slug}` - Product slug
- `/p/{id}` - Product ID
- `/produto/{sku}` - SKU

---

## 📊 What Gets Synced

### From Bling ✅
- Product name (`nome`)
- SKU/código (`codigo`)
- Description (`descricao` or `descricaoCurta`)
- Images (`imagem` array)
- Category (`categoria.descricao`)

### NOT Synced ❌
- Price (maintained in Nuvemshop only)
- Stock quantity
- Variants/variations
- Custom fields

---

## 🔒 Security Notes

- **API keys are sensitive** - never commit `.env` to git
- `.env` is already in `.gitignore` (you're safe)
- Tokens are read-only by default
- Can only fetch your own products

---

## 📚 Additional Resources

- [Bling API v3 Documentation](https://developer.bling.com.br/referencia)
- [OAuth 2.0 Guide](https://developer.bling.com.br/oauth)
- [Produto Endpoints](https://developer.bling.com.br/referencia#/Produtos)

---

## 💡 Pro Tips

1. **Keep products updated in Bling** - Changes sync within 4 hours
2. **Use high-quality images** - They're your main sales tool
3. **Write good descriptions** - They appear on your website
4. **Organize categories** - Makes product management easier
5. **Test on staging first** - Before going live

---

## 🆘 Need Help?

If you get stuck:
1. Check Bling API logs in your account
2. Check server console for errors
3. Verify token is valid with curl
4. Try generating a fresh token

---

Happy selling! 🚵‍♂️🛍️
