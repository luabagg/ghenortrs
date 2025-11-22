// Product types for Bling integration
export interface BlingProduct {
  id: number | string;
  name: string;
  description: string;
  sku: string;
  imageUrl: string | null;
  images: string[];
  category: string;
  storeUrl: string;
}

export interface BlingApiResponse {
  success: boolean;
  products?: BlingProduct[];
  product?: BlingProduct;
  total?: number;
  message?: string;
}

// Instagram types
export interface InstagramPost {
  id: string | number;
  imageUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  permalink: string;
  timestamp?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

export interface InstagramApiResponse {
  data?: Array<{
    id: string;
    caption?: string;
    media_type: string;
    media_url: string;
    permalink: string;
    thumbnail_url?: string;
    timestamp: string;
  }>;
}

// B2B Contact Form types
export interface B2BFormData {
  companyName: string;
  cnpj: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  volume?: string;
  productsInterest?: string;
  message?: string;
}

export interface B2BApiResponse {
  success: boolean;
  message: string;
}

// Hook return types
export interface UseBlingReturn {
  products: BlingProduct[];
  loading: boolean;
  error: string | null;
}

export interface UseInstagramReturn {
  posts: InstagramPost[];
  loading: boolean;
  error: string | null;
}
