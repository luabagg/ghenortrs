import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Piloto Profissional',
      location: 'São Paulo, SP',
      content: 'Os freios Elite da GhenoRTRS mudaram completamente minha performance nas trilhas. Frenagem precisa e confiável mesmo nas descidas mais técnicas.',
      rating: 5,
    },
    {
      name: 'Bike Shop Torres',
      role: 'Loja Parceira',
      location: 'Porto Alegre, RS',
      content: 'Excelente parceria B2B! Produtos de qualidade, preços competitivos e suporte excepcional. Nossos clientes adoram os componentes GhenoRTRS.',
      rating: 5,
    },
    {
      name: 'Mariana Costa',
      role: 'Ciclista Amadora',
      location: 'Curitiba, PR',
      content: 'Qualidade internacional com preço justo. Comprei meu kit de freios e não me arrependo. Instalação fácil e resultado profissional.',
      rating: 5,
    },
    {
      name: 'Pedal Forte MTB',
      role: 'Equipe de Competição',
      location: 'Florianópolis, SC',
      content: 'Toda nossa equipe usa componentes GhenoRTRS. A durabilidade e performance são impressionantes. Recomendamos de olhos fechados!',
      rating: 5,
    },
  ];

  const stats = [
    { number: '5000+', label: 'Produtos Vendidos' },
    { number: '200+', label: 'Lojas Parceiras' },
    { number: '4.9★', label: 'Avaliação Média' },
    { number: '100%', label: 'Satisfação' },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="section-container">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-brand-red mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            O Que Dizem <span className="text-brand-red">Nossos Clientes</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Depoimentos reais de ciclistas e parceiros que confiam na qualidade GhenoRTRS.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-brand-red/50 transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Garantia de Qualidade</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Entrega Segura</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Suporte Especializado</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
