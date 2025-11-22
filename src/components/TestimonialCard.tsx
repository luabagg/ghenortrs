import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimerRef.current = setTimeout(() => {
      onPlayVideo();
    }, 1200);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-brand-red/50 transition-all duration-300 group cursor-pointer"
    >
      {/* Content */}
      <p className="text-gray-300 mb-6 italic leading-relaxed">
        "{content}"
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-white">{name}</div>
          <div className="text-sm text-gray-400">{role}</div>
          <div className="text-xs text-gray-500">{location}</div>
        </div>
      </div>

      {/* Hover progress indicator - 1.2s loading bar */}
      {isHovered && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-brand-red rounded-b-2xl"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'linear' }}
        />
      )}

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 shadow-[0_0_30px_rgba(232,20,20,0.2)] rounded-2xl" />
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
