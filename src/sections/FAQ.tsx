import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Qual o pedido mínimo para se tornar um revendedor?',
      answer: 'Não exigimos pedido mínimo! Você pode começar com qualquer quantidade que faça sentido para o seu negócio. Nosso objetivo é crescer junto com você, seja comprando 5 ou 50 unidades por mês.',
    },
    {
      question: 'Como funciona a tabela de preços B2B?',
      answer: 'Temos preços especiais para revendedores com margens competitivas. Após preencher o formulário de interesse, nossa equipe comercial enviará a tabela completa de preços B2B com todas as condições e descontos por volume.',
    },
    {
      question: 'Quais são as condições de pagamento?',
      answer: 'Oferecemos condições flexíveis: à vista com desconto adicional, ou parcelado em até 3x sem juros. Para parceiros recorrentes, também trabalhamos com prazos de 30/60 dias mediante análise de crédito.',
    },
    {
      question: 'Quanto tempo demora o envio para minha loja?',
      answer: 'Para produtos em estoque, enviamos em até 24 horas após confirmação do pagamento. O prazo de entrega varia de acordo com sua região: Sul (2-5 dias úteis), Sudeste (3-7 dias úteis), demais regiões (5-12 dias úteis). Trabalhamos com transportadoras confiáveis e fornecemos código de rastreamento.',
    },
    {
      question: 'Os produtos têm garantia? Como funciona para revenda?',
      answer: 'Todos os nossos produtos têm garantia de fábrica contra defeitos de fabricação. Para produtos revendidos, a garantia é passada para o cliente final. Fornecemos certificados de garantia e suporte técnico para você e seus clientes.',
    },
    {
      question: 'Vocês fornecem materiais de marketing?',
      answer: 'Sim! Fornecemos fotos em alta resolução dos produtos, descrições técnicas, especificações completas e logos da marca. Também podemos criar materiais personalizados para campanhas específicas dos nossos parceiros.',
    },
    {
      question: 'Como posso acompanhar o estoque de vocês?',
      answer: 'Nosso catálogo online mostra disponibilidade em tempo real. Parceiros também recebem atualizações semanais sobre novos produtos e reposição de estoque. Para grandes volumes, recomendamos entrar em contato antes para garantir disponibilidade.',
    },
    {
      question: 'Posso devolver produtos que não foram vendidos?',
      answer: 'Trabalhamos com política de troca em caso de defeito ou produto errado. Para produtos em bom estado que não foram vendidos, analisamos caso a caso - entre em contato com nossa equipe comercial para discutir as melhores opções.',
    },
    {
      question: 'Vocês oferecem exclusividade territorial?',
      answer: 'Não trabalhamos com exclusividade territorial, pois isso limitaria o crescimento de outros parceiros. No entanto, valorizamos muito nossos revendedores e oferecemos suporte diferenciado e condições especiais para parceiros de longo prazo.',
    },
    {
      question: 'Como faço pedidos recorrentes?',
      answer: 'Após o primeiro pedido, você terá acesso direto à nossa equipe comercial via WhatsApp/email. Pedidos recorrentes podem ser feitos de forma simples e rápida, e parceiros frequentes ganham prioridade no atendimento e condições ainda melhores.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Perguntas <span className="text-brand-red">Frequentes</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Tire suas dúvidas sobre como se tornar um parceiro GhenoRTRS
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-lg font-semibold pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDownIcon className="h-6 w-6 text-brand-red" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA after FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            Não encontrou sua resposta?
          </p>
          <motion.a
            href="#b2b"
            className="inline-block px-8 py-4 bg-brand-red text-white font-bold text-lg rounded-xl"
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(232, 20, 20, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Entre em Contato
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
