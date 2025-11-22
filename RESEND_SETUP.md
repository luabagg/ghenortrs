# Resend Email Integration Setup Guide

This guide will walk you through setting up Resend for the B2B contact form email functionality.

## Why Resend?

Resend is a modern transactional email service built for developers. Benefits include:

- **Free Tier**: 3,000 emails/month (100 emails/day)
- **Better Deliverability**: Professional email infrastructure
- **No SMTP Hassle**: Simple REST API (no complex SMTP config)
- **Custom Domain**: Send from your own domain (e.g., `contato@ghenortrs.com.br`)
- **Developer-Friendly**: Clean API and great documentation

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click **Sign Up**
3. Sign up with your email or GitHub account
4. Verify your email address

## Step 2: Get Your API Key

1. After logging in, go to the [API Keys page](https://resend.com/api-keys)
2. Click **Create API Key**
3. Give it a name (e.g., `GhenoRTRS B2B Form`)
4. Select permissions:
   - **Sending access**: Full access (needed to send emails)
5. Click **Create**
6. Copy the API key (starts with `re_...`)
   - **Important**: Save it now! You won't be able to see it again

## Step 3: Configure Your Environment

1. Create a `.env` file in your project root (if you don't have one)
2. Add your Resend API key:

```env
RESEND_API_KEY=re_your_actual_api_key_here
PORT=3001
```

3. Make sure `.env` is in your `.gitignore` (already configured)

## Step 4: Test the Integration

### Quick Test (Development)

By default, the integration uses `onboarding@resend.dev` as the sender, which works immediately without domain verification. This is perfect for testing!

1. Start your server:
```bash
npm run server
```

2. In another terminal, start your frontend:
```bash
npm run dev
```

3. Visit the B2B form at `http://localhost:5173/#b2b`
4. Fill out the form and submit
5. Check your email (`contato@ghenortrs.com.br`) - you should receive the B2B inquiry
6. The customer should receive an auto-reply confirmation

### Check Resend Dashboard

1. Go to [resend.com/emails](https://resend.com/emails)
2. You'll see all sent emails with delivery status
3. Click on any email to see details, HTML preview, and delivery logs

## Step 5: Verify Your Custom Domain (Production)

For production, you should send emails from your own domain (`ghenortrs.com.br`) instead of `onboarding@resend.dev`.

### Add Your Domain

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter `ghenortrs.com.br`
4. Click **Add**

### Configure DNS Records

Resend will provide you with DNS records to add to your domain registrar (e.g., Registro.br, GoDaddy, etc.):

**SPF Record** (TXT):
```
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Record** (TXT):
```
Name: resend._domainkey
Value: (Resend will provide this - copy exactly as shown)
```

**DMARC Record** (TXT) - Optional but recommended:
```
Name: _dmarc
Value: v=DMARC1; p=none; pct=100; rua=mailto:contato@ghenortrs.com.br
```

### Add DNS Records to Your Registrar

The process varies by registrar. Common Brazilian registrars:

**Registro.br**:
1. Go to [registro.br](https://registro.br)
2. Login → My Domains → Select `ghenortrs.com.br`
3. DNS Management → Add Records
4. Add each TXT record from Resend

**GoDaddy**:
1. Go to [godaddy.com/domains](https://dcc.godaddy.com/domains)
2. Find `ghenortrs.com.br` → Click DNS
3. Add TXT records

**Hostinger/Locaweb/UOL Host**:
1. Access your hosting control panel
2. Find DNS Zone Editor
3. Add TXT records

### Verify Domain in Resend

1. After adding DNS records (wait 5-10 minutes for propagation)
2. Go back to [resend.com/domains](https://resend.com/domains)
3. Click **Verify DNS Records**
4. If all records are correct, status will change to **Verified** ✓

### Update server.js

Once your domain is verified, update the `from` field in `server.js`:

```javascript
// Change from:
from: 'GhenoRTRS <onboarding@resend.dev>',

// To:
from: 'GhenoRTRS <contato@ghenortrs.com.br>',
// or
from: 'GhenoRTRS <noreply@ghenortrs.com.br>',
```

## Troubleshooting

### "API key is invalid"
- Check that you copied the entire API key (starts with `re_`)
- Make sure there are no extra spaces in your `.env` file
- Verify the key hasn't been deleted in Resend dashboard

### "Domain not verified"
- Wait 10-15 minutes after adding DNS records
- Use [mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx) to verify DNS propagation
- Check that TXT records are added exactly as provided by Resend
- For Registro.br domains, DNS changes can take up to 24 hours

### Emails not arriving
- Check Resend dashboard logs at [resend.com/emails](https://resend.com/emails)
- Check spam/junk folder
- Verify domain is properly verified (for custom domain)
- If using `onboarding@resend.dev`, it should work immediately

### Rate Limits
Free tier limits:
- **100 emails per day**
- **3,000 emails per month**

For higher volume, upgrade to a paid plan (starts at $20/month for 50,000 emails).

## Production Checklist

Before going live:

- [ ] Resend account created
- [ ] API key generated and added to `.env`
- [ ] Domain `ghenortrs.com.br` verified in Resend
- [ ] DNS records (SPF, DKIM, DMARC) added
- [ ] Updated `server.js` to use custom domain
- [ ] Tested form submission in production
- [ ] Verified emails arrive (both team notification and customer auto-reply)
- [ ] Checked spam score (Resend dashboard shows this)

## Email Best Practices

1. **Sender Reputation**: Use a consistent "from" address
2. **SPF/DKIM/DMARC**: Always configure these (prevents spam classification)
3. **Unsubscribe Link**: Not required for transactional emails, but good practice
4. **Monitor Bounces**: Check Resend dashboard for bounced emails
5. **Warm Up Domain**: When starting, send gradually (not all 100/day immediately)

## Support

- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: [resend.com/support](https://resend.com/support)
- **API Reference**: [resend.com/docs/api-reference](https://resend.com/docs/api-reference/introduction)

## Cost Estimation

**Free Tier** (perfect for starting):
- 3,000 emails/month
- 100 emails/day
- Great for B2B inquiries (likely <10/day)

**Paid Plan** (if needed later):
- $20/month: 50,000 emails
- $80/month: 100,000 emails
- Custom: Contact Resend for higher volume

For a B2B contact form receiving 5-10 inquiries per day, the **free tier is more than enough**.
