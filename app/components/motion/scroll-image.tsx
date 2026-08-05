import { type ComponentProps, useLayoutEffect, useRef, useState } from 'react';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

import { cn } from '@/lib/utils';

type ScrollImageProps = Omit<
  ComponentProps<typeof motion.img>,
  'ref' | 'style'
> & {
  effect: 'zoom' | 'parallax';
};

/**
 * Resting scale while scroll progress is mid-range (typical in-view / hero-at-top).
 * Must leave enough overflow headroom for the paired translate ranges below.
 */
const ZOOM_REST_SCALE = 1.06;
const PARALLAX_REST_SCALE = 1.18;

export function ScrollImage({
  effect,
  className,
  ...imageProps
}: ScrollImageProps) {
  // Measure a non-transformed frame. Transforms on the scroll target feed back
  // into getBoundingClientRect and make progress (and the image) jitter.
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [motionReady, setMotionReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });

  // useScroll's MotionValue starts at 0, then jumps to the real progress after
  // layout. Gate transforms until after that pass so reload does not pop y/scale.
  useLayoutEffect(() => {
    setMotionReady(true);
  }, []);

  // Zoom: gentle Ken Burns around the resting baseline.
  const zoomScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.16, ZOOM_REST_SCALE, 1.12],
  );

  // Parallax: grow + drift. Mid keyframes match the pre-motion baseline so
  // enabling motion after layout does not shift the image on reload.
  // Translate stays inside scale headroom (~9% per side at 1.18).
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['-8%', '0%', '8%'],
  );
  const parallaxScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.26, PARALLAX_REST_SCALE, 1.28],
  );

  const allowMotion = motionReady && reduceMotion !== true;

  const style = !allowMotion
    ? effect === 'zoom'
      ? { scale: ZOOM_REST_SCALE }
      : { scale: PARALLAX_REST_SCALE, y: 0 }
    : effect === 'zoom'
      ? { scale: zoomScale }
      : { scale: parallaxScale, y: parallaxY };

  return (
    <div ref={frameRef} className={cn('overflow-hidden', className)}>
      <motion.img
        data-motion-image={effect}
        className="size-full max-w-none object-cover will-change-transform"
        style={style}
        {...imageProps}
      />
    </div>
  );
}
