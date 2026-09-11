import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PokemonHistoryItem } from '@reto-pokemon/shared';
import PokemonHistory from './PokemonHistory';

const history: PokemonHistoryItem[] = [
  {
    id: 25,
    name: 'pikachu',
    image: 'pikachu.png',
    visitedCount: 2,
    lastVisited: '2026-09-11T12:00:00.000Z',
  },
  {
    id: 1,
    name: 'bulbasaur',
    image: 'bulbasaur.png',
    visitedCount: 1,
    lastVisited: '2026-09-10T12:00:00.000Z',
  },
];

describe('PokemonHistory', () => {
  it('shows an empty state when there is no history', () => {
    render(<PokemonHistory history={[]} />);

    expect(screen.getByText('No recently viewed Pokemon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear history' })).toBeDisabled();
  });

  it('orders entries by most recent visit and shows visit counts', () => {
    render(<PokemonHistory history={history} />);

    const entries = screen.getAllByRole('button').filter((button) => button.textContent?.includes('#'));

    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveTextContent('pikachu');
    expect(entries[0]).toHaveTextContent('Seen 2 times');
    expect(entries[1]).toHaveTextContent('bulbasaur');
  });

  it('supports selecting, closing, clearing, and Escape', () => {
    const onSelectPokemon = vi.fn();
    const onClose = vi.fn();
    const onClearHistory = vi.fn();
    render(
      <PokemonHistory
        history={history}
        onSelectPokemon={onSelectPokemon}
        onClose={onClose}
        onClearHistory={onClearHistory}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /pikachu/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear history' }));
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onSelectPokemon).toHaveBeenCalledWith(25);
    expect(onClearHistory).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('moves focus into the dialog and restores it when unmounted', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'View History';
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(<PokemonHistory history={[]} />);

    expect(screen.getByRole('button', { name: 'Close history' })).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(screen.getByRole('button', { name: 'Back' })).toHaveFocus();

    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
