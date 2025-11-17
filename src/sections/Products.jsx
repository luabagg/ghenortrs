import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useBling } from '../hooks/useBling';

const Products = () => {
  // Fetch products from Bling
  const { products: blingProducts, loading, error } = useBling();

  // Fallback placeholder products if Bling not configured
  const placeholderProducts = [
    {
      id: 1,
      name: 'Freios a Disco',
      description: 'Alta performance e segurança para suas descidas mais radicais.',
      imageUrl: '/images/brake-disc-1.jpg',
      storeUrl: 'https://store.ghenortrs.com.br',
    },
    {
      id: 2,
      name: 'Pedivelas',
      description: 'Componentes resistentes para máxima transferência de potência.',
      imageUrl: '/images/brake-disc-2.jpg',
      storeUrl: 'https://store.ghenortrs.com.br',
    },
    {
      id: 3,
      name: 'Componentes',
      description: 'Guidões, stems, selins e muito mais para customizar sua bike.',
      imageUrl: '/images/brake-disc-1.jpg',
      storeUrl: 'https://store.ghenortrs.com.br',
    },
    {
      id: 4,
      name: 'Acessórios',
      description: 'Ferramentas e acessórios essenciais para manutenção e performance.',
      imageUrl: '/images/brake-disc-2.jpg',
      storeUrl: 'https://store.ghenortrs.com.br',
    },
  ];

  // Use Bling products if available, otherwise use placeholders
  // Limit to first 8 products for grid display
  const displayProducts = blingProducts.length > 0
    ? blingProducts.slice(0, 8)
    : placeholderProducts;

  return (
    <section id="products" className="py-20 bg-black">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Nossos <span className="text-brand-red">Produtos</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Explore nossa linha completa de componentes de alta performance para mountain bike.
            Qualidade internacional com preços competitivos.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {loading ? (
            // Loading skeletons
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 animate-pulse"
              >
                <div className="h-64 bg-gray-800" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-800 rounded w-5/6" />
                </div>
              </div>
            ))
          ) : (
            displayProducts.map((product, index) => (
              <motion.div
                key={product.id || product.sku}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-brand-red transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  {product.imageUrl ? (
                    <>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-4xl">
                      🚵
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-red transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm line-clamp-3">
                    {product.description || 'Componente de alta qualidade para mountain bike.'}
                  </p>
                  <a
                    href={product.storeUrl}
                    className="inline-flex items-center text-brand-red hover:text-red-400 font-medium"
                  >
                    Ver preço e comprar
                    <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Status message (subtle) */}
        {error && blingProducts.length === 0 && (
          <p className="text-center text-gray-500 text-sm mb-8">
            Mostrando produtos em destaque. Configure o Bling API para sincronização automática.
          </p>
        )}

        {/* CTA to Store */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <a
            href="https://store.ghenortrs.com.br"
            className="btn-primary inline-flex items-center"
          >
            Ver Todos os Produtos
            <ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
