import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const Products = () => {
  const productCategories = [
    {
      title: 'Freios a Disco',
      description: 'Alta performance e segurança para suas descidas mais radicais.',
      image: '/images/brakes-placeholder.jpg', // TODO: Replace with actual image
      link: 'https://store.ghenortrs.com.br',
    },
    {
      title: 'Pedivelas',
      description: 'Componentes resistentes para máxima transferência de potência.',
      image: '/images/cranks-placeholder.jpg', // TODO: Replace with actual image
      link: 'https://store.ghenortrs.com.br',
    },
    {
      title: 'Componentes',
      description: 'Guidões, stems, selins e muito mais para customizar sua bike.',
      image: '/images/components-placeholder.jpg', // TODO: Replace with actual image
      link: 'https://store.ghenortrs.com.br',
    },
    {
      title: 'Acessórios',
      description: 'Ferramentas e acessórios essenciais para manutenção e performance.',
      image: '/images/accessories-placeholder.jpg', // TODO: Replace with actual image
      link: 'https://store.ghenortrs.com.br',
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {productCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-brand-red transition-all duration-300"
            >
              {/* Image Placeholder */}
              <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl text-gray-700 group-hover:text-brand-red transition-colors duration-300">
                    🚵
                  </div>
                </div>
                {/* TODO: Replace with actual product images
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-brand-red transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <a
                  href={category.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-brand-red hover:text-red-400 font-medium"
                >
                  Ver produtos
                  <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

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
            target="_blank"
            rel="noopener noreferrer"
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
