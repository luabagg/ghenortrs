import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  content: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const TestimonialCard = ({
  name,
  role,
  location,
  content,
  thumbnailUrl,
  videoUrl,
}: TestimonialCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Start 500ms timer
    hoverTimerRef.current = setTimeout(() => {
      setShowVideo(true);
      // Play video when shown
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Cancel timer if leaving before 500ms
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Hide video and pause
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    // Cleanup timer on unmount
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
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden cursor-pointer group"
    >
      {/* Video/Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden">
        {!showVideo ? (
          // Thumbnail with play icon overlay
          <>
            <img
              src={thumbnailUrl}
              alt={`${name} - ${role}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={isHovered ? { scale: 1.2, opacity: 1 } : { scale: 1, opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <PlayCircleIcon className="h-20 w-20 text-white drop-shadow-lg" />
              </motion.div>
            </div>
            {/* Hover Progress Indicator */}
            {isHovered && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-brand-red"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
              />
            )}
          </>
        ) : (
          // Video
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-300 mb-4 italic leading-relaxed text-sm">
          "{content}"
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-white">{name}</div>
            <div className="text-sm text-gray-400">{role}</div>
            <div className="text-xs text-gray-500">{location}</div>
          </div>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 border-2 border-brand-red/50 rounded-2xl" />
          <div className="absolute inset-0 shadow-[0_0_30px_rgba(232,20,20,0.3)] rounded-2xl" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default TestimonialCard;
