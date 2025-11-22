import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  clientName: string;
}

const VideoModal = ({ isOpen, onClose, videoUrl, clientName }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          {/* Video Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-brand-red transition-colors p-2"
              aria-label="Fechar vídeo"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {/* Client Name */}
            <div className="text-white text-center mb-4">
              <h3 className="text-2xl font-bold">{clientName}</h3>
            </div>

            {/* Video */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-brand-red/50">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>

            {/* Close hint */}
            <p className="text-gray-400 text-center mt-4 text-sm">
              Pressione ESC ou clique fora do vídeo para fechar
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
