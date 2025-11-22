import { useState, useEffect } from 'react';
import type { InstagramPost, InstagramApiResponse, UseInstagramReturn } from '../types';

/**
 * Custom hook to fetch Instagram posts using Basic Display API
 * Includes caching to avoid hitting rate limits
 */
export const useInstagram = (
  accessToken: string | undefined,
  limit: number = 6
): UseInstagramReturn => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError('Instagram access token not configured');
      setLoading(false);
      return;
    }

    const fetchInstagramPosts = async (): Promise<void> => {
      try {
        setLoading(true);

        // Check if we have cached data (less than 1 hour old)
        const cachedData = localStorage.getItem('instagram_posts');
        const cachedTimestamp = localStorage.getItem('instagram_posts_timestamp');

        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp);
          const oneHour = 60 * 60 * 1000;

          if (age < oneHour) {
            // Use cached data
            setPosts(JSON.parse(cachedData) as InstagramPost[]);
            setLoading(false);
            return;
          }
        }

        // Fetch from Instagram API
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error(`Instagram API error: ${response.status}`);
        }

        const data: InstagramApiResponse = await response.json();

        if (!data.data) {
          throw new Error('No data returned from Instagram');
        }

        // Filter only images and videos, format the data
        const formattedPosts: InstagramPost[] = data.data
          .filter(post =>
            post.media_type === 'IMAGE' ||
            post.media_type === 'VIDEO' ||
            post.media_type === 'CAROUSEL_ALBUM'
          )
          .map(post => ({
            id: post.id,
            imageUrl: post.media_url,
            thumbnailUrl: post.thumbnail_url || post.media_url,
            caption: post.caption || '',
            permalink: post.permalink,
            timestamp: post.timestamp,
            mediaType: post.media_type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM',
          }))
          .slice(0, limit);

        // Cache the data
        localStorage.setItem('instagram_posts', JSON.stringify(formattedPosts));
        localStorage.setItem('instagram_posts_timestamp', Date.now().toString());

        setPosts(formattedPosts);
        setError(null);
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');

        // Try to use cached data even if expired
        const cachedData = localStorage.getItem('instagram_posts');
        if (cachedData) {
          setPosts(JSON.parse(cachedData) as InstagramPost[]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [accessToken, limit]);

  return { posts, loading, error };
};
