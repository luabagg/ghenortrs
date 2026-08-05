import { type ComponentProps, useRef } from 'react';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

type ScrollImageProps = Omit<
  ComponentProps<typeof motion.img>,
  'ref' | 'style'
> & {
  effect: 'zoom' | 'parallax';
};

export function ScrollImage({ effect, ...imageProps }: ScrollImageProps) {
  const target = useRef<HTMLImageElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04]);
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);
  const style = reduceMotion
    ? undefined
    : effect === 'zoom'
      ? { scale }
      : { scale: 1.04, y };

  return (
    <motion.img
      ref={target}
      data-motion-image={effect}
      style={style}
      {...imageProps}
    />
  );
}
