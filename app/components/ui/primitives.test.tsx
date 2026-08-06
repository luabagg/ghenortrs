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
import { GlassPanel } from './glass-panel';
import { Input } from './input';
import { Label } from './label';
import { MetaLabel } from './meta-label';
import { SectionBand } from './section-band';
import { Textarea } from './textarea';

describe('ui primitives', () => {
  it('renders the GHENO rotors button variants and supports asChild composition', () => {
    const { rerender } = render(<Button>Explorar componentes</Button>);

    expect(
      screen.getByRole('button', { name: 'Explorar componentes' }),
    ).toHaveClass('bg-accent', 'text-on-accent', 'rounded-button');

    rerender(<Button variant="secondary">Falar com GHENO rotors B2B</Button>);

    expect(
      screen.getByRole('button', { name: 'Falar com GHENO rotors B2B' }),
    ).toHaveClass('border-primary/55', 'bg-transparent', 'text-primary');

    rerender(<Button variant="outline">Loja</Button>);
    expect(screen.getByRole('button', { name: 'Loja' })).toHaveClass(
      'border-accent',
      'bg-transparent',
    );

    rerender(<Button variant="ghost">Ver todos</Button>);
    expect(screen.getByRole('button', { name: 'Ver todos' })).toHaveClass(
      'border-transparent',
      'bg-transparent',
    );

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

  it('renders GHENO rotors card, label, input, and textarea primitives with branded surface styling', () => {
    render(
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Shell técnico</CardTitle>
            <CardDescription>Tokens já ativos.</CardDescription>
          </CardHeader>
          <CardContent>Pronto para o M2.</CardContent>
        </Card>
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input aria-label="CNPJ" placeholder="00.000.000/0000-00" />
        <Textarea
          aria-label="Necessidades comerciais"
          placeholder="Conte o mix, volume e tipo de atendimento."
        />
      </div>,
    );

    expect(screen.getByText('Shell técnico').closest('section')).toHaveClass(
      'rounded-panel',
      'border-border',
      'bg-surface-elevated',
    );
    expect(screen.getByText('CNPJ')).toHaveClass(
      'text-sm',
      'font-bold',
      'uppercase',
      'tracking-[0.12em]',
      'text-secondary',
    );
    expect(screen.getByLabelText('CNPJ')).toHaveClass(
      'border-strong',
      'bg-background-soft',
      'text-primary',
    );
    expect(screen.getByLabelText('Necessidades comerciais')).toHaveClass(
      'min-h-28',
      'border-strong',
      'bg-background-soft',
      'text-primary',
    );
  });

  it('renders a reusable GHENO rotors meta label primitive for quiet eyebrow copy', () => {
    render(
      <div>
        <MetaLabel>Componentes</MetaLabel>
        <MetaLabel asChild>
          <a href="/b2b">B2B</a>
        </MetaLabel>
      </div>,
    );

    expect(screen.getByText('Componentes')).toHaveAttribute(
      'data-slot',
      'meta-label',
    );
    expect(screen.getByText('Componentes')).toHaveClass(
      'text-xs',
      'font-bold',
      'tracking-[0.14em]',
      'text-secondary',
    );
    expect(screen.getByText('Componentes')).not.toHaveClass(
      'rounded-pill',
      'bg-accent-dark',
    );
    expect(screen.getByRole('link', { name: 'B2B' })).toHaveAttribute(
      'data-slot',
      'meta-label',
    );
  });

  it('renders a reusable smoked-glass panel primitive for overlay navigation and utility surfaces', () => {
    render(<GlassPanel>Menu técnico</GlassPanel>);

    expect(screen.getByText('Menu técnico')).toHaveAttribute(
      'data-slot',
      'glass-panel',
    );
    expect(screen.getByText('Menu técnico')).toHaveClass(
      'rounded-panel',
      'text-primary',
    );
  });

  it('renders a reusable light-band primitive for commercial contrast sections', () => {
    render(
      <SectionBand>
        <h2>Atendimento comercial</h2>
        <p>Revendas, oficinas e distribuidores com briefing direto.</p>
      </SectionBand>,
    );

    expect(
      screen.getByText('Atendimento comercial').parentElement,
    ).toHaveAttribute('data-slot', 'section-band');
    expect(screen.getByText('Atendimento comercial').parentElement).toHaveClass(
      'bg-success',
      'text-on-primary',
      'rounded-none',
    );
  });

  it('renders an accessible GHENO rotors dot matrix loader with the expected grid rhythm', () => {
    render(
      <DotMatrixLoader
        aria-label="Carregando vitrine GHENO rotors"
        caption="Sincronizando famílias de componentes."
      />,
    );

    expect(screen.getByLabelText('Carregando vitrine GHENO rotors')).toHaveClass(
      'rounded-panel',
      'border-border',
      'bg-surface',
    );
    expect(
      screen.getByText('Sincronizando famílias de componentes.'),
    ).toBeVisible();
    expect(screen.getAllByTestId('dot-matrix-cell')).toHaveLength(9);
  });

  it('keeps the dot matrix loader motion-safe for reduced-motion users', () => {
    render(<DotMatrixLoader aria-label="Carregando catálogo GHENO rotors" />);

    const [firstCell] = screen.getAllByTestId('dot-matrix-cell');

    expect(firstCell).toHaveClass(
      'motion-reduce:animate-none',
      'motion-reduce:opacity-100',
    );
  });
});
