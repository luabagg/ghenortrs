import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isHovered, setIsHovered] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimerRef.current = setTimeout(() => {
      setShowPlayIcon(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPlayIcon(false);
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
      onClick={onPlayVideo}
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

      {/* Play Icon - appears after 500ms hover */}
      <AnimatePresence>
        {showPlayIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="relative">
              <PlayCircleIcon className="h-20 w-20 text-brand-red drop-shadow-2xl" />
              <div className="absolute inset-0 bg-brand-red/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover progress indicator */}
      {isHovered && !showPlayIcon && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-brand-red rounded-b-2xl"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5 }}
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
