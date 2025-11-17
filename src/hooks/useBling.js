import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch products from Bling API
 * Only fetches images, names, and descriptions (NOT prices)
 * Prices are maintained in Nuvemshop
 */
export const useBling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlingProducts = async () => {
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
            setProducts(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        // Fetch from backend API (which calls Bling)
        const response = await fetch('/api/bling/products');

        if (!response.ok) {
          throw new Error(`Bling API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.products) {
          throw new Error('No products returned from Bling');
        }

        // Format products (exclude price)
        const formattedProducts = data.products.map(product => ({
          id: product.id,
          name: product.nome,
          description: product.descricao || product.descricaoCurta || '',
          sku: product.codigo,
          imageUrl: product.imagem?.[0]?.link || product.imageThumbnail || null,
          images: product.imagem?.map(img => img.link) || [],
          category: product.categoria?.descricao || 'Componentes',
          // NO PRICE - link to Nuvemshop for pricing
          storeUrl: `https://store.ghenortrs.com.br/produtos/${product.codigo}`, // Adjust based on your Nuvemshop URL structure
        }));

        // Cache the data
        localStorage.setItem('bling_products', JSON.stringify(formattedProducts));
        localStorage.setItem('bling_products_timestamp', Date.now().toString());

        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching Bling products:', err);
        setError(err.message);

        // Try to use cached data even if expired
        const cachedData = localStorage.getItem('bling_products');
        if (cachedData) {
          setProducts(JSON.parse(cachedData));
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
export const useBlingProduct = (sku) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sku) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/bling/products/${sku}`);

        if (!response.ok) {
          throw new Error(`Bling API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.product) {
          throw new Error('Product not found');
        }

        const product = data.product;
        const formattedProduct = {
          id: product.id,
          name: product.nome,
          description: product.descricao || product.descricaoCurta || '',
          sku: product.codigo,
          imageUrl: product.imagem?.[0]?.link || product.imageThumbnail || null,
          images: product.imagem?.map(img => img.link) || [],
          category: product.categoria?.descricao || 'Componentes',
          storeUrl: `https://store.ghenortrs.com.br/produtos/${product.codigo}`,
        };

        setProduct(formattedProduct);
        setError(null);
      } catch (err) {
        console.error('Error fetching Bling product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);

  return { product, loading, error };
};
