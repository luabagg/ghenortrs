import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScrollImage } from './scroll-image';

describe('ScrollImage', () => {
  it('renders meaningful image semantics through the motion primitive', () => {
    render(
      <ScrollImage alt="Cubo GHENO rotors" effect="zoom" src="/cubo.jpg" />,
    );

    expect(
      screen.getByRole('img', { name: 'Cubo GHENO rotors' }),
    ).toHaveAttribute('data-motion-image', 'zoom');
  });

  it('preserves native image attributes', () => {
    render(
      <ScrollImage
        alt="Aro GHENO rotors"
        className="object-cover"
        effect="zoom"
        loading="lazy"
        src="/aro.jpg"
      />,
    );

    const image = screen.getByRole('img', { name: 'Aro GHENO rotors' });

    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('data-motion-image', 'zoom');
    // Layout classes land on the measured frame; cover is applied on the img.
    expect(image).toHaveClass('object-cover');
    expect(image.parentElement).toHaveClass('object-cover');
  });
});
