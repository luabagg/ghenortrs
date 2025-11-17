import { useState, useEffect } from 'react';
import type { BlingProduct, BlingApiResponse, UseBlingReturn } from '../types';

// Bling API raw response types
interface BlingProductRaw {
  id: number | string;
  nome: string;
  descricao?: string;
  descricaoCurta?: string;
  codigo: string;
  imagem?: Array<{ link: string }>;
  imageThumbnail?: string;
  categoria?: { descricao: string };
}

/**
 * Custom hook to fetch products from Bling API
 * Only fetches images, names, and descriptions (NOT prices)
 * Prices are maintained in Nuvemshop
 */
export const useBling = (): UseBlingReturn => {
  const [products, setProducts] = useState<BlingProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlingProducts = async (): Promise<void> => {
      try {
        setLoading(true);

        // Check if we have cached data (less than 4 hours old)
        const cachedData = localStorage.getItem('bling_products');
        const cachedTimestamp = localStorage.getItem('bling_products_timestamp');

        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp);
          const fourHours = 4 * 60 * 60 * 1000;

          if (age < fourHours) {
            // Use cached data
            setProducts(JSON.parse(cachedData) as BlingProduct[]);
            setLoading(false);
            return;
          }
        }

        // Fetch from backend API (which calls Bling)
        const response = await fetch('/api/bling/products');

        if (!response.ok) {
          throw new Error(`Bling API error: ${response.status}`);
        }

        const data: BlingApiResponse & { products?: BlingProductRaw[] } = await response.json();

        if (!data.success || !data.products) {
          throw new Error('No products returned from Bling');
        }

        // Format products (exclude price)
        const formattedProducts: BlingProduct[] = data.products.map((product: BlingProductRaw) => ({
          id: product.id,
          name: product.nome,
          description: product.descricao || product.descricaoCurta || '',
          sku: product.codigo,
          imageUrl: product.imagem?.[0]?.link || product.imageThumbnail || null,
          images: product.imagem?.map(img => img.link) || [],
          category: product.categoria?.descricao || 'Componentes',
          // NO PRICE - link to Nuvemshop for pricing
          storeUrl: `https://store.ghenortrs.com.br/produtos/${product.codigo}`,
        }));

        // Cache the data
        localStorage.setItem('bling_products', JSON.stringify(formattedProducts));
        localStorage.setItem('bling_products_timestamp', Date.now().toString());

        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching Bling products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');

        // Try to use cached data even if expired
        const cachedData = localStorage.getItem('bling_products');
        if (cachedData) {
          setProducts(JSON.parse(cachedData) as BlingProduct[]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlingProducts();
  }, []);

  return { products, loading, error };
};

/**
 * Hook to fetch a single product by SKU
 */
export const useBlingProduct = (sku: string | undefined): {
  product: BlingProduct | null;
  loading: boolean;
  error: string | null;
} => {
  const [product, setProduct] = useState<BlingProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sku) {
      setLoading(false);
      return;
    }

    const fetchProduct = async (): Promise<void> => {
      try {
        setLoading(true);

        const response = await fetch(`/api/bling/products/${sku}`);

        if (!response.ok) {
          throw new Error(`Bling API error: ${response.status}`);
        }

        const data: BlingApiResponse & { product?: BlingProductRaw } = await response.json();

        if (!data.success || !data.product) {
          throw new Error('Product not found');
        }

        const rawProduct = data.product;
        const formattedProduct: BlingProduct = {
          id: rawProduct.id,
          name: rawProduct.nome,
          description: rawProduct.descricao || rawProduct.descricaoCurta || '',
          sku: rawProduct.codigo,
          imageUrl: rawProduct.imagem?.[0]?.link || rawProduct.imageThumbnail || null,
          images: rawProduct.imagem?.map(img => img.link) || [],
          category: rawProduct.categoria?.descricao || 'Componentes',
          storeUrl: `https://store.ghenortrs.com.br/produtos/${rawProduct.codigo}`,
        };

        setProduct(formattedProduct);
        setError(null);
      } catch (err) {
        console.error('Error fetching Bling product:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);

  return { product, loading, error };
};
