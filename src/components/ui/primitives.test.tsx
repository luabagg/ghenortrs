import { render, screen } from '@testing-library/react';

import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { DotMatrixLoader } from './dot-matrix-loader';
import { Input } from './input';

describe('ui primitives', () => {
  it('renders the GHENO button variants and supports asChild composition', () => {
    const { rerender } = render(<Button>Explorar componentes</Button>);

    expect(
      screen.getByRole('button', { name: 'Explorar componentes' }),
    ).toHaveClass('bg-accent', 'text-on-accent', 'rounded-button');

    rerender(<Button variant="secondary">Falar com GHENO B2B</Button>);

    expect(
      screen.getByRole('button', { name: 'Falar com GHENO B2B' }),
    ).toHaveClass('border-strong', 'bg-background-soft', 'text-primary');

    rerender(
      <Button asChild>
        <a href="/componentes">Ver catálogo</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'Ver catálogo' })).toHaveClass(
      'inline-flex',
      'bg-accent',
    );
  });

  it('renders GHENO card and input primitives with branded surface styling', () => {
    render(
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Shell técnico</CardTitle>
            <CardDescription>Tokens já ativos.</CardDescription>
          </CardHeader>
          <CardContent>Pronto para o M2.</CardContent>
        </Card>
        <Input aria-label="CNPJ" placeholder="00.000.000/0000-00" />
      </div>,
    );

    expect(screen.getByText('Shell técnico').closest('section')).toHaveClass(
      'rounded-panel',
      'border-border',
      'bg-surface-elevated',
    );
    expect(screen.getByLabelText('CNPJ')).toHaveClass(
      'border-strong',
      'bg-background-soft',
      'text-primary',
    );
  });

  it('renders an accessible GHENO dot matrix loader with the expected grid rhythm', () => {
    render(
      <DotMatrixLoader
        aria-label="Carregando vitrine GHENO"
        caption="Sincronizando famílias de componentes."
      />,
    );

    expect(screen.getByLabelText('Carregando vitrine GHENO')).toHaveClass(
      'rounded-panel',
      'border-border',
      'bg-surface',
    );
    expect(
      screen.getByText('Sincronizando famílias de componentes.'),
    ).toBeVisible();
    expect(screen.getAllByTestId('dot-matrix-cell')).toHaveLength(9);
  });
});
