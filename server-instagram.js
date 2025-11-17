import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.INSTAGRAM_SERVER_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Instagram Basic Display API Configuration
// You'll need to set these in your .env file after setting up your Meta app
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

/**
 * Instagram Basic Display API Endpoint
 * Fetches the latest posts from your Instagram account
 *
 * Setup instructions:
 * 1. Go to https://developers.facebook.com/apps
 * 2. Create or select your app
 * 3. Add Instagram Basic Display product
 * 4. Configure OAuth redirect URIs
 * 5. Get your User Token (long-lived token recommended)
 * 6. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID to .env
 */
app.get('/api/instagram/posts', async (req, res) => {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      return res.status(500).json({
        success: false,
        message: 'Instagram API credentials not configured',
        error: 'Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID in environment variables',
      });
    }

    // Fetch posts from Instagram Basic Display API
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const limit = req.query.limit || 6;

    const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=${fields}&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=${limit}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Instagram API Error:', data.error);
      return res.status(400).json({
        success: false,
        message: 'Error fetching Instagram posts',
        error: data.error.message,
      });
    }

    // Filter and format posts
    const posts = data.data.map(post => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.media_type,
      mediaUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink,
      timestamp: post.timestamp,
    }));

    res.status(200).json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

/**
 * Refresh long-lived access token
 * Long-lived tokens expire after 60 days
 * This endpoint helps refresh them before expiration
 */
app.get('/api/instagram/refresh-token', async (req, res) => {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN) {
      return res.status(500).json({
        success: false,
        message: 'Instagram access token not configured',
      });
    }

    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({
        success: false,
        message: 'Error refreshing token',
        error: data.error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      newToken: data.access_token,
      expiresIn: data.expires_in,
    });
  } catch (error) {
    console.error('Error refreshing Instagram token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/instagram/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    configured: !!(INSTAGRAM_ACCESS_TOKEN && INSTAGRAM_USER_ID),
  });
});

app.listen(PORT, () => {
  console.log(`Instagram API server running on port ${PORT}`);
  console.log(`Instagram configured: ${!!(INSTAGRAM_ACCESS_TOKEN && INSTAGRAM_USER_ID)}`);
});
