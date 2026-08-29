export type SellerGate =
  | 'anonymous'
  | 'needs_registration'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'loading'
  | 'unconfigured';

export type SellerTier = 'start' | 'pro' | 'max';

export type SellerSummary = {
  id: string;
  email: string;
  companyName: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  cnpj: string;
  phone: string;
};

export type B2BSessionResponse = {
  authenticated: boolean;
  email?: string | null;
  seller: SellerSummary | null;
  gate: Exclude<SellerGate, 'loading' | 'unconfigured'>;
  tier?: SellerTier | null;
  volume?: number | null;
  error?: string;
};

export type B2BCatalogProduct = {
  id: number;
  sku: string | null;
  name: string;
  description: string;
  imageUrl: string | null;
  priceCents: number | null;
  stock: number | null;
  unit: string | null;
  minQuantity: number;
  category: string | null;
};

export type QuoteSelectionItem = {
  product: B2BCatalogProduct;
  quantity: number;
};
