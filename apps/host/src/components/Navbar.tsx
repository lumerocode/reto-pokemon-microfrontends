import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { SafeImage } from './SafeImage';

export function Navbar() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const openSearch = useAppStore((state) => state.openSearch);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <nav aria-label="Primary navigation" className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            POKEDEX
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Open Pokemon search"
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/50"
          >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 m-0 md:mr-2" />
            <span className="hidden sm:inline">Search Pokemon...</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/50"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* User Profile & Dropdown */}
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-controls="profile-menu"
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center space-x-2 p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/50"
              >
                <SafeImage
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover bg-slate-200 dark:bg-slate-700 m-0 md:mr-2"
                  loading="eager"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:inline">
                  {user.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 hidden md:inline transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div id="profile-menu" role="menu" className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium cursor-pointer flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-500">Not logged in</span>
          )}
        </div>
      </div>
    </nav>
  );
}