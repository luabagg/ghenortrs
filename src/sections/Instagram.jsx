import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const Instagram = () => {
  // Placeholder posts - In production, you would fetch these from Instagram API
  const instagramPosts = [
    { id: 1, image: '/images/instagram/post1.jpg' },
    { id: 2, image: '/images/instagram/post2.jpg' },
    { id: 3, image: '/images/instagram/post3.jpg' },
    { id: 4, image: '/images/instagram/post4.jpg' },
    { id: 5, image: '/images/instagram/post5.jpg' },
    { id: 6, image: '/images/instagram/post6.jpg' },
  ];

  return (
    <section id="instagram" className="py-20 bg-black">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg mb-4">
            Siga no <span className="text-brand-red">Instagram</span>
          </h2>
          <p className="text-lg text-gray-400 mb-6">
            Acompanhe as últimas novidades, dicas de manutenção e conteúdo exclusivo.
          </p>
          <a
            href="https://www.instagram.com/gheno_rtrs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-brand-red hover:text-red-400 font-semibold text-lg"
          >
            @gheno_rtrs
            <ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5" />
          </a>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/gheno_rtrs"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-brand-red transition-all duration-300"
            >
              {/* Placeholder for Instagram images */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20">
                <div className="text-5xl">📸</div>
              </div>
              {/* TODO: Replace with actual Instagram images
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              */}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/20 transition-all duration-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <a
            href="https://www.instagram.com/gheno_rtrs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center"
          >
            Seguir no Instagram
            <ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Instagram;
