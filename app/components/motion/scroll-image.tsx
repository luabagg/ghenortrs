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
  effect: 'zoom';
};

const ZOOM_REST_SCALE = 1.06;

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

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });

  // useScroll's MotionValue starts at 0, then jumps to the real progress after
  // layout. Gate transforms until after that pass so reload does not pop scale.
  useIsomorphicLayoutEffect(() => {
    setMotionReady(true);
  }, []);

  const zoomScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.16, ZOOM_REST_SCALE, 1.12],
  );

  const allowMotion = motionReady && reduceMotion !== true;

  return (
    <div ref={frameRef} className={cn('overflow-hidden', className)}>
      <motion.img
        data-motion-image={effect}
        className="size-full max-w-none object-cover will-change-transform"
        style={{ scale: allowMotion ? zoomScale : ZOOM_REST_SCALE }}
        {...imageProps}
      />
    </div>
  );
}
