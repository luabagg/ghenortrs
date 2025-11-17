import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background Placeholder */}
      {/* TODO: Replace with actual downhill video */}
      <div className="video-background bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* When you add your video, use this structure:
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-background"
        >
          <source src="/videos/hero-downhill.mp4" type="video/mp4" />
        </video>
        */}
      </div>

      {/* Overlay */}
      <div className="video-overlay" />

      {/* Content */}
      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="heading-xl mb-6">
            Peças de <span className="text-brand-red">Downhill</span>
            <br />
            Direto do Brasil
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Importação e fabricação de componentes de alta performance para mountain bike.
            Freios a disco, peças e acessórios de qualidade internacional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#products"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Ver Produtos
            </motion.a>
            <motion.a
              href="#b2b"
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Revenda Conosco
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <a href="#about" className="block">
            <ChevronDownIcon className="h-8 w-8 text-brand-red mx-auto" />
          </a>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-brand-red rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-brand-red rounded-full animate-pulse delay-75" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-brand-red rounded-full animate-pulse delay-150" />
      </div>
    </section>
  );
};

export default Hero;
