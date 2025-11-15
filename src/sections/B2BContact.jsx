import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const B2BContact = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    volume: '',
    productsInterest: '',
    message: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // TODO: Implement email sending logic
      // For now, we'll simulate the submission
      const response = await fetch('/api/b2b-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        });
        setFormData({
          companyName: '',
          cnpj: '',
          contactName: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          volume: '',
          productsInterest: '',
          message: '',
        });
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato por email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: BuildingOfficeIcon,
      title: 'Preços Especiais',
      description: 'Condições exclusivas para revendedores com tabela B2B diferenciada.',
    },
    {
      icon: EnvelopeIcon,
      title: 'Suporte Dedicado',
      description: 'Equipe especializada para atender suas necessidades comerciais.',
    },
    {
      icon: PhoneIcon,
      title: 'Pedidos Personalizados',
      description: 'Flexibilidade para atender demandas específicas do seu negócio.',
    },
    {
      icon: MapPinIcon,
      title: 'Logística Nacional',
      description: 'Entrega rápida e confiável para todo o Brasil.',
    },
  ];

  return (
    <section id="b2b" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Seja um <span className="text-brand-red">Revendedor</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Faça parte da nossa rede de parceiros. Oferecemos condições especiais para lojas
            e revendedores de todo o Brasil.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700"
            >
              <benefit.icon className="h-10 w-10 text-brand-red mb-3" />
              <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Solicite uma Proposta Comercial
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="Sua empresa"
                />
              </div>

              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  required
                  value={formData.cnpj}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium mb-2">
                  Nome do Contato *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Telefone/WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  Cidade/Estado *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                    placeholder="Cidade"
                  />
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                    placeholder="UF"
                    maxLength="2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="volume" className="block text-sm font-medium mb-2">
                  Volume Mensal Estimado
                </label>
                <select
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                >
                  <option value="">Selecione...</option>
                  <option value="0-10">0-10 unidades</option>
                  <option value="10-50">10-50 unidades</option>
                  <option value="50-100">50-100 unidades</option>
                  <option value="100+">100+ unidades</option>
                </select>
              </div>

              <div>
                <label htmlFor="productsInterest" className="block text-sm font-medium mb-2">
                  Produtos de Interesse
                </label>
                <input
                  type="text"
                  id="productsInterest"
                  name="productsInterest"
                  value={formData.productsInterest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="Ex: Freios, Pedivelas, etc."
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-brand-red transition-colors resize-none"
                placeholder="Conte-nos mais sobre sua necessidade..."
              />
            </div>

            {/* Status Message */}
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg flex items-center ${
                  status.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border border-red-500/50 text-red-400'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                ) : (
                  <XCircleIcon className="h-5 w-5 mr-2" />
                )}
                {status.message}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Proposta'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default B2BContact;
