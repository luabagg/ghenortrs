import { motion } from 'framer-motion';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  content: string;
  videoUrl: string;
  onPlayVideo: () => void;
}

const TestimonialCard = ({
  name,
  role,
  location,
  content,
  onPlayVideo,
}: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-brand-red/50 transition-all duration-300 group"
    >
      {/* Content */}
      <p className="text-gray-300 mb-6 italic leading-relaxed">
        "{content}"
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-white">{name}</div>
          <div className="text-sm text-gray-400">{role}</div>
          <div className="text-xs text-gray-500">{location}</div>
        </div>
      </div>

      {/* Watch Video Button */}
      <motion.button
        onClick={onPlayVideo}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-300"
      >
        <PlayCircleIcon className="h-5 w-5" />
        Assistir Depoimento
      </motion.button>

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 shadow-[0_0_30px_rgba(232,20,20,0.2)] rounded-2xl" />
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
