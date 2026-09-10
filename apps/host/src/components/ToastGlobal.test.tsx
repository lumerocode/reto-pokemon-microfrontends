import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ToastGlobal } from './ToastGlobal';
import { useAppStore } from '../store/useAppStore';

afterEach(() => {
  useAppStore.setState({
    history: [],
    dismissedToastVisitKey: null,
  });
});

describe('ToastGlobal', () => {
  it('closes the current visit toast', () => {
    useAppStore.setState({
      history: [{
        id: 25,
        name: 'pikachu',
        image: 'pikachu.png',
        visitedCount: 1,
        lastVisited: '2026-09-10T10:00:00.000Z',
      }],
    });
    render(<ToastGlobal />);

    fireEvent.click(screen.getByRole('button', { name: 'Close toast' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(useAppStore.getState().dismissedToastVisitKey).toBe('25:2026-09-10T10:00:00.000Z:1');
  });
});
