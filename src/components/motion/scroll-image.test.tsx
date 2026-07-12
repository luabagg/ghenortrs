import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScrollImage } from './scroll-image';

describe('ScrollImage', () => {
  it('renders meaningful image semantics through the motion primitive', () => {
    render(<ScrollImage alt="Cubo GHENO" effect="zoom" src="/cubo.jpg" />);

    expect(screen.getByRole('img', { name: 'Cubo GHENO' })).toHaveAttribute(
      'data-motion-image',
      'zoom',
    );
  });

  it('preserves native image attributes', () => {
    render(
      <ScrollImage
        alt="Aro GHENO"
        className="object-cover"
        effect="parallax"
        loading="lazy"
        src="/aro.jpg"
      />,
    );

    expect(screen.getByRole('img', { name: 'Aro GHENO' })).toHaveAttribute(
      'loading',
      'lazy',
    );
    expect(screen.getByRole('img', { name: 'Aro GHENO' })).toHaveClass(
      'object-cover',
    );
  });
});
