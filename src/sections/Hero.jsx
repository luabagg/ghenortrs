import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';

const Hero = () => {
  // Hero carousel images - Add your images to public/images/hero/
  const heroImages = [
    // '/images/hero/downhill-1.jpg',
    // '/images/hero/downhill-2.jpg',
    // '/images/hero/downhill-3.jpg',
    // '/images/hero/products-1.jpg',
  ];

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Carousel Background */}
      <HeroCarousel images={heroImages} />

      {/* Premium Multi-Layer Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-red/20 via-transparent to-brand-red/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />

      {/* Animated Red Glow Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 rounded-full border border-brand-red/50 bg-brand-red/10 backdrop-blur-sm">
              <p className="text-sm font-semibold text-brand-red uppercase tracking-wider">
                Performance & Qualidade
              </p>
            </div>
          </motion.div>

          {/* Main Heading with Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6"
          >
            <span className="block text-white">Componentes de</span>
            <span className="block bg-gradient-to-r from-brand-red via-red-500 to-brand-red bg-clip-text text-transparent">
              Downhill
            </span>
            <span className="block text-white text-4xl md:text-5xl lg:text-6xl mt-2 font-bold">
              Direto do Brasil
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Importação e fabricação de componentes de{' '}
            <span className="text-white font-semibold">alta performance</span> para mountain bike.
            Freios a disco, peças e acessórios de qualidade internacional.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.a
              href="#products"
              className="group relative px-10 py-4 bg-brand-red text-white font-bold text-lg rounded-xl overflow-hidden shadow-2xl shadow-brand-red/50"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(232, 20, 20, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10">Ver Produtos</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            <motion.a
              href="#b2b"
              className="group relative px-10 py-4 border-2 border-brand-red text-white font-bold text-lg rounded-xl overflow-hidden backdrop-blur-sm bg-white/5"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(232, 20, 20, 0.1)",
                borderColor: "rgba(232, 20, 20, 1)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10 group-hover:text-brand-red transition-colors duration-300">
                Revenda Conosco
              </span>
            </motion.a>
          </motion.div>

          {/* Stats/Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { value: '100%', label: 'Nacional' },
              { value: 'Premium', label: 'Qualidade' },
              { value: 'B2B', label: 'Revenda' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-brand-red mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Animated corner accents */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-brand-red/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(232, 20, 20, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(232, 20, 20, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
