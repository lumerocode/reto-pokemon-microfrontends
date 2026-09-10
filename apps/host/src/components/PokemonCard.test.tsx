import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PokemonCard } from './PokemonCard';

const pokemon = { id: 25, name: 'pikachu', image: 'pikachu.png' };

describe('PokemonCard', () => {
  it('selects the Pokemon through an accessible button', () => {
    const onSelect = vi.fn();
    render(<PokemonCard pokemon={pokemon} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: 'Select pikachu' }));

    expect(onSelect).toHaveBeenCalledWith(pokemon);
  });
});
