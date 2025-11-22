import { motion } from 'framer-motion';
import {
  TruckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  GlobeAmericasIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: GlobeAmericasIcon,
      title: 'Importação Direta',
      description: 'Importamos componentes de alta qualidade direto dos melhores fabricantes mundiais.',
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Fabricação Nacional',
      description: 'Produzimos freios a disco e componentes com tecnologia de ponta no Brasil.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Qualidade Garantida',
      description: 'Todos os produtos passam por rigoroso controle de qualidade antes de chegar até você.',
    },
    {
      icon: TruckIcon,
      title: 'Entrega Rápida',
      description: 'Logística eficiente do sul do Brasil para todo o país.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Sobre a <span className="text-brand-red">GhenoRTRS</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Somos uma empresa do sul do Brasil especializada em componentes de downhill e mountain bike.
            Nossa missão é trazer o melhor da tecnologia internacional e produção nacional para os
            apaixonados por MTB.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-brand-red transition-all duration-300"
            >
              <feature.icon className="h-12 w-12 text-brand-red mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Video Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Video Placeholder 1 */}
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-brand-red rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Vídeo 1: Nossos Produtos</p>
                </div>
              </div>
              {/* TODO: Replace with actual video
              <video controls className="w-full h-full object-cover">
                <source src="/videos/products-showcase.mp4" type="video/mp4" />
              </video>
              */}
            </div>

            {/* Video Placeholder 2 */}
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-brand-red rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Vídeo 2: Fabricação</p>
                </div>
              </div>
              {/* TODO: Replace with actual video
              <video controls className="w-full h-full object-cover">
                <source src="/videos/manufacturing.mp4" type="video/mp4" />
              </video>
              */}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
