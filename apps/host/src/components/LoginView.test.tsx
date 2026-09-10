import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginView } from './LoginView';
import { useAppStore } from '../store/useAppStore';

afterEach(() => {
  vi.useRealTimers();
  useAppStore.setState({ user: null, theme: 'dark' });
});

describe('LoginView', () => {
  it('validates required fields', () => {
    render(<LoginView />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByText('Username is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<LoginView />);
    const passwordInput = screen.getByLabelText('Password');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('logs in with valid credentials', () => {
    vi.useFakeTimers();
    render(<LoginView />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    vi.advanceTimersByTime(600);

    expect(useAppStore.getState().user?.name).toBe('Luis Meléndez R.');
  });
});