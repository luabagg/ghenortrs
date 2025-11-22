import { useState } from 'react';
import { motion } from 'framer-motion';
import TestimonialCard from '../components/TestimonialCard';
import VideoModal from '../components/VideoModal';

const Testimonials = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({ url: '', name: '' });

  const testimonials = [
    {
      name: 'Bike Shop Torres',
      role: 'Loja Parceira - Cliente Principal',
      location: 'Porto Alegre, RS',
      content: 'Parceria B2B excepcional! Produtos de qualidade superior, preços competitivos e suporte dedicado. Nossos clientes adoram os componentes GhenoRTRS e sempre voltam para comprar mais.',
      videoUrl: '/videos/testimonials/bike-shop-torres.mp4',
    },
    {
      name: 'Pedal Forte MTB',
      role: 'Equipe Profissional de Competição',
      location: 'Florianópolis, SC',
      content: 'Toda nossa equipe profissional confia nos componentes GhenoRTRS. A durabilidade e performance em competições extremas são impressionantes. Recomendamos com total confiança!',
      videoUrl: '/videos/testimonials/pedal-forte.mp4',
    },
  ];

  const handlePlayVideo = (videoUrl: string, clientName: string) => {
    setSelectedVideo({ url: videoUrl, name: clientName });
    setVideoModalOpen(true);
  };

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
            Nossos <span className="text-brand-red">Clientes Principais</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Conheça alguns dos principais parceiros que confiam na qualidade GhenoRTRS.
            <br />
            <span className="text-sm text-brand-red/80">Clique em "Assistir Depoimento" para ver os vídeos</span>
          </p>
        </motion.div>

        {/* Interactive Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <TestimonialCard
                {...testimonial}
                onPlayVideo={() => handlePlayVideo(testimonial.videoUrl, testimonial.name)}
              />
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoUrl={selectedVideo.url}
          clientName={selectedVideo.name}
        />

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
