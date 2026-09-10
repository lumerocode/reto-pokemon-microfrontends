import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Moon, Sun, User } from 'lucide-react';
import { SafeImage } from './SafeImage';

const featuredPokemon = [
  {
    name: 'Eevee',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
  },
  {
    name: 'Pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  },
  {
    name: 'Mew',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
  },
];

export function LoginView() {
  const login = useAppStore((state) => state.login);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const [username, setUsername] = useState('Luis');
  const [password, setPassword] = useState('retotecnico');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const nextFieldErrors = {
      username: username.trim() ? '' : 'Username is required.',
      password: password ? '' : 'Password is required.',
    };

    setFieldErrors(nextFieldErrors);

    if (nextFieldErrors.username || nextFieldErrors.password) return;

    setIsLoading(true);

    setTimeout(() => {
      if (username.trim().toLowerCase() === 'luis' && password === 'retotecnico') {
        login({
          name: 'Luis Meléndez R.',
          email: 'luis@pokereto.com',
          avatar: 'https://ui-avatars.com/api/?name=Luis+Melendez&background=4f46e5&color=fff&bold=true&rounded=true',
        });
      } else {
        setError('Invalid credentials. Please check your username and password.');
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background Animated Pokeballs & Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-400/20 dark:bg-red-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 transition-colors duration-300">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="absolute right-5 top-5 rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>

        {/* Animated Header Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5 h-32 w-full overflow-hidden py-2">
            <div className="login-card-track flex h-full items-end justify-center gap-2">
              {featuredPokemon.map((pokemon, index) => (
                <div
                  key={pokemon.name}
                  className={`login-card-float relative flex shrink-0 items-end justify-center rounded-xl border border-amber-300/70 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_8px_24px_rgba(245,158,11,0.25)] transition-transform duration-500 hover:-translate-y-2 ${
                    index === 1 ? 'h-24 w-20 -translate-y-3' : 'h-20 w-16'
                  }`}
                  style={{ animationDelay: `${index * 180}ms` }}
                >
                  <SafeImage
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="h-20 w-20 object-contain drop-shadow-lg"
                    loading="eager"
                  />
                  <span className="absolute bottom-1 rounded-full bg-slate-950/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-100">
                    {pokemon.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute -inset-3 -z-10 rounded-3xl border border-amber-300/20" />
            <div className="absolute -inset-6 -z-10 rounded-full bg-amber-400/10 blur-2xl" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">POKEDEX</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Micro-Frontend Pokedex App
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <div role="alert" className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (e.target.value.trim()) setFieldErrors((current) => ({ ...current, username: '' }));
                }}
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                placeholder="Enter your username"
              />
            </div>
            {fieldErrors.username && <p id="username-error" className="mt-1.5 text-xs text-red-400">{fieldErrors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value) setFieldErrors((current) => ({ ...current, password: '' }));
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-12 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-indigo-500"
              >
                {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && <p id="password-error" className="mt-1.5 text-xs text-red-400">{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                <span className="sr-only">Signing in...</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}