import {
  type ComponentProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

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
 * Resting / bleed scale. Parallax keeps this constant so scroll never
 * reflows size (mobile overscroll used to grow the image via a mid valley).
 * Headroom must cover the max |y| for that effect.
 */
const ZOOM_REST_SCALE = 1.06;
/** Bleed scale — must exceed max parallax |y| on each side from center. */
const PARALLAX_SCALE = 1.28;

// useLayoutEffect warns under SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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

  // Parallax tracks exit only (hero sits at progress 0 at page top).
  // Zoom tracks full enter→leave for Ken Burns on mid-page cards.
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset:
      effect === 'parallax'
        ? ['start start', 'end start']
        : ['start end', 'end start'],
  });

  // useScroll's MotionValue starts at 0, then jumps to the real progress after
  // layout. Gate transforms until after that pass so reload does not pop y.
  useIsomorphicLayoutEffect(() => {
    setMotionReady(true);
  }, []);

  // Zoom: gentle Ken Burns around the resting baseline.
  const zoomScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.16, ZOOM_REST_SCALE, 1.12],
  );

  // Parallax: fixed scale + one-way drift. Monotonic y means overscroll /
  // URL-bar resize cannot "grow" the image when scrolling back up.
  // 14% stays inside 1.28 scale headroom (~14% per side from center).
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);

  const allowMotion = motionReady && reduceMotion !== true;

  const style = !allowMotion
    ? effect === 'zoom'
      ? { scale: ZOOM_REST_SCALE }
      : { scale: PARALLAX_SCALE, y: 0 }
    : effect === 'zoom'
      ? { scale: zoomScale }
      : { scale: PARALLAX_SCALE, y: parallaxY };

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
